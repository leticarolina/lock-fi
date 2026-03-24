// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title LockFi
 * @author Leticia Azevedo
 * @notice LockFi is a security-focused smart vault that protects users from risky withdrawals
 * by introducing time-delayed execution for suspicious or large withdrawal behavior.
 * @dev This contract acts as a self-custody vault where users deposit ETH and withdraw funds
 * based on risk-aware logic. Withdrawals that exceed predefined safety thresholds are
 * delayed instead of executed instantly, allowing users time to react in case of compromise.
 */

contract LockFi {
    error AmountZero();
    error InsufficientBalance(uint256 balance);
    error PendingWithdrawExists();
    error TimeoutNotOver();
    error NoPendingWithdraw();
    error VaultLocked();

    error SafeAddressNotSet();
    error InvalidSafeAddress();
    error SafeAddressAlreadySet();
    error PendingSafeChangeExists();
    error NoPendingSafeChange();
    error SafeChangeDelayNotOver();
    error PendingWithdrawalExists();

    uint256 public constant DELAY = 1 hours;
    uint256 public constant LOCK_DURATION = 24 hours;
    uint256 public constant SAFE_ADDRESS_CHANGE_DELAY = 24 hours;

    mapping(address => uint256) public balances; //Tracks withdrawable funds (not pending funds)
    mapping(address => WithdrawalRequest) public pendingWithdraw; // Pending withdrawals per user
    mapping(address => uint256) public lastWithdrawPercent; // Tracks last withdrawal %.
    mapping(address => uint256 endTimeout) public lockedUntil; // Tracks until when withdrawal is locked for that user
    mapping(address => address) public safeAddress; //safe address for each user, can be set by user and used as recovery in case of compromise.
    mapping(address => address) public pendingSafeAddress; //pending safe address change, only one pending change allowed, requires delay before execution.
    mapping(address => uint256) public safeChangeUnlockTime; // Tracks when pending safe address change can be executed.

    //Pending withdrawal structure, each user can only have ONE pending withdrawal.
    struct WithdrawalRequest {
        uint256 amount; // Amount locked
        uint256 unlockTime; // When execution allowed
        uint256 requestTime; // Timestamp created
    }

    //EVENTS
    event Deposited(address indexed user, uint256 amount);
    event WithdrawalRequested(
        address indexed user,
        uint256 amount,
        uint256 unlockTime,
        uint256 requestTime
    );
    event WithdrawalExecuted(address indexed user, uint256 amount);
    event WithdrawalCancelled(address indexed user, uint256 amount);
    event EmergencyLockActivated(address indexed user, uint256 lockedUntil);
    event SafeAddressSet(address indexed user, address safe);
    event SafeAddressChangeRequested(
        address indexed previousSafe,
        address indexed newSafe,
        uint256 unlockTime
    );
    event SafeAddressChangeConfirmed(address indexed user, address newSafe);
    event SafeAddressChangeCancelled(address indexed user);
    event EmergencyWithdrawToSafe(
        address indexed user,
        address safe,
        uint256 amount
    );

    /// DEPOSIT FUNCTION
    /// @notice Deposit ETH into the vault
    function deposit() external payable {
        if (msg.value == 0) {
            revert AmountZero();
        }

        // Increase user balance
        balances[msg.sender] += msg.value;

        emit Deposited(msg.sender, msg.value);
    }

    receive() external payable {
        balances[msg.sender] += msg.value;

        emit Deposited(msg.sender, msg.value);
    }

    /// WITHDRAW FUNCTION
    /// @notice Attempt withdrawal
    function withdraw(uint256 amount) external {
        if (block.timestamp < lockedUntil[msg.sender]) {
            revert VaultLocked();
        }

        uint256 userBalance = balances[msg.sender];

        if (amount == 0) {
            revert AmountZero();
        }

        // Ensure user has enough funds
        if (userBalance < amount) {
            revert InsufficientBalance(userBalance);
        }

        // Only ONE pending withdrawal allowed
        if (pendingWithdraw[msg.sender].amount != 0) {
            revert PendingWithdrawExists();
        }

        bool risky = _isRisky(msg.sender, amount, userBalance); //Determine whether withdrawal is risky
        uint256 percent = (amount * 100) / userBalance; // Calculate withdrawal percentage for tracking

        //if risky - create a pending request
        if (risky) {
            balances[msg.sender] -= amount; //Deduct balance immediately

            uint256 unlockTime = block.timestamp + DELAY;

            pendingWithdraw[msg.sender] = WithdrawalRequest({
                amount: amount,
                unlockTime: unlockTime,
                requestTime: block.timestamp
            });
            lastWithdrawPercent[msg.sender] = percent;

            emit WithdrawalRequested(
                msg.sender,
                amount,
                unlockTime,
                block.timestamp
            );

            return;
        }

        //if Safe , execute
        balances[msg.sender] -= amount; // Deduct balance
        lastWithdrawPercent[msg.sender] = percent; // Update last withdrawal tracking

        _sendEth(msg.sender, amount); // Send ETH

        emit WithdrawalExecuted(msg.sender, amount);
    }

    //EXECUTE PENDING WITHDRAWAL
    function executeWithdraw() external {
        WithdrawalRequest storage req = pendingWithdraw[msg.sender];
        uint256 executeAmount = req.amount;

        if (executeAmount == 0) {
            revert NoPendingWithdraw();
        }
        if (block.timestamp < req.unlockTime) {
            revert TimeoutNotOver();
        }

        delete pendingWithdraw[msg.sender];

        _sendEth(msg.sender, executeAmount);

        emit WithdrawalExecuted(msg.sender, executeAmount);
    }

    //CANCEL WITHDRAW
    function cancelWithdraw() external {
        WithdrawalRequest storage req = pendingWithdraw[msg.sender];

        if (req.amount == 0) {
            revert NoPendingWithdraw();
        }

        uint256 amount = req.amount;
        balances[msg.sender] += amount;

        delete pendingWithdraw[msg.sender];

        emit WithdrawalCancelled(msg.sender, amount);
    }

    function emergencyLock() external {
        uint256 unlockTime = block.timestamp + LOCK_DURATION;

        lockedUntil[msg.sender] = unlockTime;

        emit EmergencyLockActivated(msg.sender, unlockTime);
    }

    // RISK DETECTION
    function _isRisky(
        address user,
        uint256 amount,
        uint256 balance
    ) internal view returns (bool) {
        // RULE 1: amount > 60% of balance
        bool largeWithdrawal = amount > (balance * 60) / 100;

        // RULE 2: last withdrawal < 5% AND new withdrawal > 40%
        uint256 lastPercent = lastWithdrawPercent[user];

        bool hasPreviousWithdrawal = lastPercent > 0;
        bool isLastWithdrawSmall = lastPercent < 5;
        bool isNextWithdrawLarge = amount > (balance * 40) / 100;
        bool suspiciousPattern = hasPreviousWithdrawal &&
            isLastWithdrawSmall &&
            isNextWithdrawLarge;

        return largeWithdrawal || suspiciousPattern;
    }

    //INTERNAL ETH SEND
    function _sendEth(address to, uint256 amount) internal {
        (bool success, ) = to.call{value: amount}("");

        require(success, "Transfer failed");
    }

    /*
    ============================================================
                    SAFE ADDRESS MANAGEMENT
    ============================================================
    */
    function setSafeAddress(address _safe) external {
        if (_safe == address(0)) {
            revert InvalidSafeAddress();
        }

        if (safeAddress[msg.sender] != address(0)) {
            revert SafeAddressAlreadySet();
        }

        safeAddress[msg.sender] = _safe;

        emit SafeAddressSet(msg.sender, _safe);
    }

    function requestSafeAddressChange(address _newSafe) external {
        if (_newSafe == address(0)) {
            revert InvalidSafeAddress();
        }

        if (safeAddress[msg.sender] == address(0)) {
            revert SafeAddressNotSet();
        }

        if (safeAddress[msg.sender] == _newSafe) {
            revert SafeAddressAlreadySet();
        }

        if (_newSafe == msg.sender) {
            revert InvalidSafeAddress();
        }

        if (pendingSafeAddress[msg.sender] != address(0)) {
            revert PendingSafeChangeExists();
        }

        if (pendingWithdraw[msg.sender].amount != 0) {
            revert PendingWithdrawalExists();
        }

        uint256 unlockTime = block.timestamp + SAFE_ADDRESS_CHANGE_DELAY;

        pendingSafeAddress[msg.sender] = _newSafe;
        safeChangeUnlockTime[msg.sender] = unlockTime;

        emit SafeAddressChangeRequested(
            safeAddress[msg.sender],
            _newSafe,
            unlockTime
        );
    }

    function confirmSafeAddressChange() external {
        address pending = pendingSafeAddress[msg.sender];

        if (pending == address(0)) {
            revert NoPendingSafeChange();
        }

        if (block.timestamp < safeChangeUnlockTime[msg.sender]) {
            revert SafeChangeDelayNotOver();
        }

        safeAddress[msg.sender] = pending;

        delete pendingSafeAddress[msg.sender];
        delete safeChangeUnlockTime[msg.sender];

        emit SafeAddressChangeConfirmed(msg.sender, pending);
    }

    function cancelSafeAddressChange() external {
        if (pendingSafeAddress[msg.sender] == address(0)) {
            revert NoPendingSafeChange();
        }

        delete pendingSafeAddress[msg.sender];
        delete safeChangeUnlockTime[msg.sender];

        emit SafeAddressChangeCancelled(msg.sender);
    }

    /// @notice intentionally allowed even during emergencyLock, this provides an emergency recovery path
    function withdrawToSafe() external {
        address safe = safeAddress[msg.sender];

        if (safe == address(0)) {
            revert SafeAddressNotSet();
        }

        if (pendingWithdraw[msg.sender].amount != 0) {
            revert PendingWithdrawalExists();
        }

        uint256 amount = balances[msg.sender];

        if (amount == 0) {
            revert AmountZero();
        }

        balances[msg.sender] = 0;

        _sendEth(safe, amount);

        emit EmergencyWithdrawToSafe(msg.sender, safe, amount);
    }

    /*
    ============================================================
                    VIEW HELPERS
    ============================================================
    */

    function getUserVaultBalance(address user) external view returns (uint256) {
        return balances[user];
    }

    /// @notice Returns true if user has pending withdrawal
    function hasPendingWithdraw(address user) external view returns (bool) {
        return pendingWithdraw[user].amount > 0;
    }

    /// @notice Returns instant withdraw limit
    function getInstantWithdrawLimit(
        address user
    ) external view returns (uint256) {
        if (pendingWithdraw[user].amount > 0) {
            return 0;
        }
        return (balances[user] * 40) / 100;
    }

    function getPendingWithdraw(
        address user
    )
        external
        view
        returns (uint256 amount, uint256 unlockTime, uint256 requestTime)
    {
        WithdrawalRequest memory req = pendingWithdraw[user];

        return (req.amount, req.unlockTime, req.requestTime);
    }

    function isVaultLocked(address user) external view returns (bool) {
        return block.timestamp < lockedUntil[user];
    }

    function getRemainingLockTime(
        address user
    ) external view returns (uint256) {
        uint256 lockTime = lockedUntil[user];

        if (block.timestamp >= lockTime) {
            return 0;
        }

        return lockTime - block.timestamp;
    }

    function getRemainingPendingTime(
        address user
    ) external view returns (uint256) {
        WithdrawalRequest memory req = pendingWithdraw[user];

        if (req.amount == 0) {
            return 0;
        }

        if (block.timestamp >= req.unlockTime) {
            return 0;
        }

        return req.unlockTime - block.timestamp;
    }

    function getUserState(
        address user
    )
        external
        view
        returns (
            uint256 balance,
            uint256 instantLimit,
            bool hasPending,
            uint256 pendingAmount,
            uint256 remainingPendingTime,
            bool isLocked,
            uint256 remainingLockTime
        )
    {
        balance = balances[user];
        WithdrawalRequest memory req = pendingWithdraw[user];
        if (req.amount > 0) {
            instantLimit = 0;
        } else {
            instantLimit = (balance * 40) / 100;
        }

        hasPending = req.amount > 0;

        pendingAmount = req.amount;

        if (req.amount > 0 && block.timestamp < req.unlockTime) {
            remainingPendingTime = req.unlockTime - block.timestamp;
        }

        isLocked = block.timestamp < lockedUntil[user];

        if (isLocked) {
            remainingLockTime = lockedUntil[user] - block.timestamp;
        }
    }

    function getPendingSafeChange(
        address user
    ) external view returns (address pendingSafe, uint256 remainingTime) {
        pendingSafe = pendingSafeAddress[user];

        if (pendingSafe == address(0)) {
            return (address(0), 0);
        }

        uint256 unlockTime = safeChangeUnlockTime[user];

        if (block.timestamp >= unlockTime) {
            return (pendingSafe, 0);
        }

        remainingTime = unlockTime - block.timestamp;
    }

    function totalBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
