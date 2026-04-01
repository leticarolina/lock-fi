// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title LockFi
 * @author Leticia Azevedo
 * @notice LockFi is a security-focused smart vault that protects users from risky withdrawals
 * by introducing time-delayed execution for suspicious or large withdrawal behavior.
 * @dev This contract acts as a self-custody vault where users deposit ETH and withdraw funds
 * based on risk-aware logic. Withdrawals that exceed predefined safety thresholds are
 * delayed instead of executed instantly, allowing users time to react in case of compromise.
 */

contract LockFi is ReentrancyGuard {
    error AmountZero();
    error InsufficientBalance(uint256 balance);
    error PendingWithdrawExists();
    error TimeoutNotOver();
    error NoPendingWithdraw();
    error EmergencyLockOngoing();
    error SafeAddressNotSet();
    error InvalidSafeAddress();
    error SafeAddressAlreadySet();
    error PendingSafeChangeExists();
    error NoPendingSafeChange();
    error SafeChangeDelayNotOver();
    error PendingWithdrawalExists();
    error TransferFailed();
    error DurationTooShort();
    error DurationTooLong();
    error LockNotExtended();

    uint256 public constant DELAY = 12 hours;
    uint256 public constant MIN_LOCK_DURATION = 1 hours;
    uint256 public constant MAX_LOCK_DURATION = 30 days;
    uint256 public constant SAFE_ADDRESS_CHANGE_DELAY = 24 hours;
    uint256 public constant WINDOW_DURATION_FOR_MAX_WITHDRAW = 72 hours;
    uint256 public constant MAX_INSTANT_WITHDRAW_PERCENT = 30;

    mapping(address => uint256) public balances; //Tracks withdrawable funds
    mapping(address => WithdrawalRequest) public pendingWithdraw; // Pending withdrawals per user
    mapping(address => uint256) public lastWithdrawPercent; // Tracks last withdrawal %.
    mapping(address => uint256 endTimeout) public lockedUntil; // Tracks until when withdrawal is locked for that user
    mapping(address => address) public safeAddress; //safe address for each user, used as recovery in case of compromise.
    mapping(address => address) public pendingSafeAddress; //pending safe address change, requires delay before execution.
    mapping(address => uint256) public safeChangeUnlockTime; // Tracks when pending safe address change can be executed.
    mapping(address => uint256) public withdrawnInWindow; // Tracks cumulative withdrawn % in current window for each user
    mapping(address => uint256) public windowStartTime; // Tracks start time of current window for cumulative withdrawal %

    //Pending withdrawal structure, each user can only have ONE pending withdrawal.
    struct WithdrawalRequest {
        uint256 amount;
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
    /// @notice Deposit native token into the vault
    function deposit() external payable {
        if (msg.value == 0) {
            revert AmountZero();
        }

        balances[msg.sender] += msg.value;

        emit Deposited(msg.sender, msg.value);
    }

    receive() external payable {
        balances[msg.sender] += msg.value;

        emit Deposited(msg.sender, msg.value);
    }

    /// WITHDRAW FUNCTION
    /// @notice Attempt withdrawal, may be delayed based on risk assessment
    /// @dev If withdrawal is deemed risky, it creates a pending request instead of executing immediately.
    function withdraw(uint256 amount) external nonReentrant {
        if (amount == 0) {
            revert AmountZero();
        }

        // Check if vault is currently locked for the user (due to emergency lock)
        if (block.timestamp < lockedUntil[msg.sender]) {
            revert EmergencyLockOngoing();
        }

        uint256 userBalance = balances[msg.sender];

        // Ensure user has enough funds
        if (userBalance < amount) {
            revert InsufficientBalance(userBalance);
        }

        // Only ONE pending withdrawal allowed
        if (pendingWithdraw[msg.sender].amount != 0) {
            revert PendingWithdrawExists();
        }

        bool risky = _isRisky(msg.sender, amount, userBalance); //Determine whether withdrawal is risky
        uint256 withdrawPercent = (amount * 100) / userBalance; // Calculate withdrawal percentage for lastWithdrawPercent tracking
        balances[msg.sender] -= amount; // Deduct balance immediately
        lastWithdrawPercent[msg.sender] = withdrawPercent; // Update last withdrawal %

        //if risky - create a pending request
        if (risky) {
            uint256 unlockTime = block.timestamp + DELAY;

            pendingWithdraw[msg.sender] = WithdrawalRequest({
                amount: amount,
                unlockTime: unlockTime,
                requestTime: block.timestamp
            });

            emit WithdrawalRequested(
                msg.sender,
                amount,
                unlockTime,
                block.timestamp
            );

            return;
        }

        // Send funds immediately if not risky and update withdrawal window tracking
        _updateWithdrawWindow(msg.sender, withdrawPercent);
        _sendEth(msg.sender, amount);

        emit WithdrawalExecuted(msg.sender, amount);
    }

    //EXECUTE PENDING WITHDRAWAL
    function executeWithdraw() external nonReentrant {
        WithdrawalRequest storage req = pendingWithdraw[msg.sender];
        uint256 executeAmount = req.amount;

        if (executeAmount == 0) {
            revert NoPendingWithdraw();
        }
        if (block.timestamp < req.unlockTime) {
            revert TimeoutNotOver();
        }
        if (block.timestamp < lockedUntil[msg.sender]) {
            revert EmergencyLockOngoing();
        }

        delete pendingWithdraw[msg.sender];

        uint256 balanceBeforeRequest = balances[msg.sender] + executeAmount;
        uint256 percent = (executeAmount * 100) / balanceBeforeRequest;
        _updateWithdrawWindow(msg.sender, percent);
        _sendEth(msg.sender, executeAmount);

        emit WithdrawalExecuted(msg.sender, executeAmount);
    }

    //CANCEL WITHDRAW
    /// @dev intentionally does NOT reset lastWithdrawPercent on cancel.
    // Resetting would allow an attacker to erase their suspicious pattern
    // by cancelling a flagged withdrawal and repeating the test-then-drain sequence.
    function cancelWithdraw() external {
        WithdrawalRequest storage req = pendingWithdraw[msg.sender];
        uint256 amount = req.amount;

        if (amount == 0) {
            revert NoPendingWithdraw();
        }

        balances[msg.sender] += amount;

        delete pendingWithdraw[msg.sender];

        emit WithdrawalCancelled(msg.sender, amount);
    }

    function emergencyLock(uint256 duration) external {
        if (duration < MIN_LOCK_DURATION) revert DurationTooShort();
        if (duration > MAX_LOCK_DURATION) revert DurationTooLong();

        uint256 unlockTime = block.timestamp + duration;
        if (unlockTime < lockedUntil[msg.sender]) revert LockNotExtended();
        lockedUntil[msg.sender] = unlockTime;

        emit EmergencyLockActivated(msg.sender, unlockTime);
    }

    // RISK DETECTION LOGIC
    /// @dev This function implements the core risk assessment logic based on predefined rules.
    function _isRisky(
        address user,
        uint256 amount,
        uint256 balance
    ) internal view returns (bool) {
        // RULE 1: amount > 60% of balance
        bool largeWithdrawal = amount > (balance * 60) / 100;

        // RULE 2: last withdrawal < 5%
        uint256 lastPercent = lastWithdrawPercent[user];

        bool hasPreviousWithdrawal = lastPercent > 0;
        bool isLastWithdrawSmall = lastPercent < 5;
        bool suspiciousPattern = hasPreviousWithdrawal && isLastWithdrawSmall;

        // RULE 3: cumulative withdrawals in last 72h > 30% of balance
        uint256 currentPercent = (amount * 100) / balance;
        uint256 accumulated = withdrawnInWindow[user];
        uint256 startTime = windowStartTime[user];
        bool cumulativeExceeded = false; // Default to false if no withdrawals in window or window expired

        if (startTime != 0) {
            bool windowActive = block.timestamp <=
                startTime + WINDOW_DURATION_FOR_MAX_WITHDRAW;

            if (windowActive) {
                cumulativeExceeded =
                    accumulated + currentPercent > MAX_INSTANT_WITHDRAW_PERCENT;
            }
        }

        return largeWithdrawal || suspiciousPattern || cumulativeExceeded;
    }

    //INTERNAL ETH SEND
    function _sendEth(address to, uint256 amount) internal {
        (bool success, ) = to.call{value: amount}("");

        // require(success, "Transfer failed");
        if (!success) revert TransferFailed();
    }

    function _updateWithdrawWindow(address user, uint256 percent) internal {
        uint256 start = windowStartTime[user];

        // Initialize window if first use
        if (start == 0) {
            windowStartTime[user] = block.timestamp;
            withdrawnInWindow[user] = percent;
            return;
        }

        // Reset window if 72 hours have passed since start
        if (block.timestamp > start + WINDOW_DURATION_FOR_MAX_WITHDRAW) {
            windowStartTime[user] = block.timestamp;

            withdrawnInWindow[user] = percent;

            return;
        }

        // Otherwise accumulate percent in current window
        withdrawnInWindow[user] += percent;
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
        if (_safe == msg.sender) {
            revert InvalidSafeAddress();
        }

        safeAddress[msg.sender] = _safe;

        emit SafeAddressSet(msg.sender, _safe);
    }

    function requestSafeAddressChange(address _newSafe) external {
        if (lockedUntil[msg.sender] > block.timestamp) {
            revert EmergencyLockOngoing();
        }

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
        if (lockedUntil[msg.sender] > block.timestamp) {
            revert EmergencyLockOngoing();
        }

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

    /// @notice not allowed even during emergencyLock
    function withdrawToSafe() external nonReentrant {
        if (lockedUntil[msg.sender] > block.timestamp) {
            revert EmergencyLockOngoing();
        }

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

        _updateWithdrawWindow(msg.sender, 100);
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
        if (pendingWithdraw[user].amount > 0) return 0;

        // If last withdrawal was a small probe, next withdrawal will be flagged regardless
        if (lastWithdrawPercent[user] > 0 && lastWithdrawPercent[user] < 5) {
            return 0;
        }

        return (balances[user] * 60) / 100; // Rule 1 threshold
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
        } else if (
            lastWithdrawPercent[user] > 0 && lastWithdrawPercent[user] < 5
        ) {
            instantLimit = 0; // Rule 2 — next withdrawal will be flagged regardless
        } else {
            instantLimit = (balance * 60) / 100; // Rule 1 threshold
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
