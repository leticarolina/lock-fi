// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SafeVault {
    error AmountZero();
    error InsufficientBalance(uint256 balance);
    error PendingWithdrawExists();
    error TimeoutNotOver();
    error NoPendingWithdraw();
    error VaultLocked();

    uint256 public constant DELAY = 1 hours;
    uint256 public constant LOCK_DURATION = 24 hours;

    mapping(address => uint256) public balances; //Tracks withdrawable funds (not pending funds)
    mapping(address => WithdrawalRequest) public pendingWithdraw; // Pending withdrawals per user
    mapping(address => uint256) public lastWithdrawPercent; // Tracks last withdrawal %.
    mapping(address => uint256 endTimeout) public lockedUntil; // Tracks until when withdrawal is locked for that user

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
}
