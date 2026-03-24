// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {LockFi} from "../src/LockFi.sol";

contract LockFiTest is Test {
    LockFi vault;

    address leti = address(1);
    address shai = address(2);
    address eve = address(3);

    uint256 constant INITIAL_BALANCE = 10 ether;

    function setUp() public {
        vault = new LockFi();

        // Fund test users
        vm.deal(leti, INITIAL_BALANCE);
        vm.deal(shai, INITIAL_BALANCE);
        vm.deal(eve, INITIAL_BALANCE);
    }

    modifier deposited(address user, uint256 amount) {
        vm.prank(user);
        vault.deposit{value: amount}();
        _;
    }

    function testDeposit() public {
        uint256 amount = 1 ether;

        vm.prank(leti);
        vault.deposit{value: amount}();

        uint256 balance = vault.balances(leti);

        assertEq(balance, amount);
    }

    function test_deposit_zeroAmount() public {
        vm.prank(leti);
        vm.expectRevert(LockFi.AmountZero.selector);
        vault.deposit();

        uint256 balance = vault.balances(leti);

        assertEq(balance, 0);
    }

    /*
    ============================================================
                SMALL WITHDRAW → INSTANT
    ============================================================
    */

    function test_withdraw_InstantRelease() public deposited(leti, 1 ether) {
        uint256 firstWithdraw = 0.1 ether; // 10%
        uint256 secondWithdraw = 0.1 ether; // 10%

        uint256 beforeBalance = leti.balance;

        vm.startPrank(leti);
        vault.withdraw(firstWithdraw);
        // Next withdraw <40%
        vault.withdraw(secondWithdraw);
        vm.stopPrank();
        // Should NOT create pending
        bool hasPending = vault.hasPendingWithdraw(leti);
        assertFalse(hasPending);

        // ETH received
        assertEq(leti.balance, beforeBalance + secondWithdraw + firstWithdraw);
    }

    function test_withdraw_largeAmountPending()
        public
        deposited(leti, 1 ether)
    {
        uint256 withdrawAmount = 0.8 ether; // 80%
        uint256 currentBalance = vault.balances(leti);

        vm.prank(leti);
        vault.withdraw(withdrawAmount);

        assertEq(vault.balances(leti), currentBalance - withdrawAmount);

        bool hasPending = vault.hasPendingWithdraw(leti);
        assertTrue(hasPending);
        (uint256 amount, uint256 unlockTime, uint256 requestTime) = vault
            .getPendingWithdraw(leti);
        assertTrue(hasPending);
        assertEq(amount, withdrawAmount);
        assertGt(unlockTime, requestTime);
    }

    function test_withdraw_zeroAmountReverts() public deposited(leti, 1 ether) {
        vm.prank(leti);

        vm.expectRevert(LockFi.AmountZero.selector);

        vault.withdraw(0);
    }

    function test_withdraw_insufficientBalanceReverts()
        public
        deposited(leti, 1 ether)
    {
        vm.prank(leti);

        vm.expectRevert();

        vault.withdraw(2 ether);
    }

    function test_withdraw_whenPendingExistsReverts()
        public
        deposited(leti, 1 ether)
    {
        vm.startPrank(leti);

        vault.withdraw(0.8 ether);

        vm.expectRevert(LockFi.PendingWithdrawExists.selector);

        vault.withdraw(0.1 ether);

        vm.stopPrank();
    }

    /*
    ============================================================
                CANCEL WITHDRAW
    ============================================================
    */

    function test_cancelWithdraw_restoresBalance()
        public
        deposited(leti, 1 ether)
    {
        uint256 withdrawAmount = 0.8 ether;

        vm.startPrank(leti);
        vault.withdraw(withdrawAmount);
        vault.cancelWithdraw();
        vm.stopPrank();

        uint256 balance = vault.balances(leti);

        assertEq(balance, 1 ether);

        bool hasPending = vault.hasPendingWithdraw(leti);

        assertFalse(hasPending);
    }

    function test_cancelWithdraw_withoutPendingReverts()
        public
        deposited(leti, 1 ether)
    {
        vm.prank(leti);

        vm.expectRevert(LockFi.NoPendingWithdraw.selector);

        vault.cancelWithdraw();
    }

    function test_cancelWithdraw_stillWorksWhileLocked() public {
        vm.startPrank(leti);

        vault.deposit{value: 1 ether}();

        vault.withdraw(0.8 ether);

        vault.emergencyLock();

        vault.cancelWithdraw(); // Cancel must still work

        vm.stopPrank();

        bool hasPending = vault.hasPendingWithdraw(leti);

        assertFalse(hasPending);
    }

    /*
    ============================================================
                EXECUTE AFTER DELAY
    ============================================================
    */

    function test_executeWithdraw_AfterDelay() public deposited(leti, 1 ether) {
        uint256 withdrawAmount = 0.8 ether;

        vm.startPrank(leti);
        vault.withdraw(withdrawAmount);
        // Warp forward 1 hour
        vm.warp(block.timestamp + 1 hours);

        uint256 beforeBalance = leti.balance;

        vault.executeWithdraw();

        vm.stopPrank();

        assertEq(leti.balance, beforeBalance + withdrawAmount);
    }

    function test_ExecuteWithdraw_reverts_BeforeDelay()
        public
        deposited(leti, 1 ether)
    {
        uint256 withdrawAmount = 0.8 ether;

        vm.startPrank(leti);

        vault.withdraw(withdrawAmount);

        vm.expectRevert(LockFi.TimeoutNotOver.selector);

        vault.executeWithdraw();

        vm.stopPrank();
    }

    function test_executeWithdraw_withoutPendingReverts()
        public
        deposited(leti, 1 ether)
    {
        vm.prank(leti);

        vm.expectRevert(LockFi.NoPendingWithdraw.selector);

        vault.executeWithdraw();
    }

    function test_executeWithdraw_reducesContractBalance() public {
        vm.startPrank(leti);

        vault.deposit{value: 1 ether}();

        vault.withdraw(0.8 ether);

        vm.warp(block.timestamp + 1 hours);

        uint256 before = vault.totalBalance();

        vault.executeWithdraw();

        uint256 afterBalance = vault.totalBalance();

        vm.stopPrank();

        assertEq(before - afterBalance, 0.8 ether);
    }

    /*
    ============================================================
                EMERGENCY LOCK BLOCKS WITHDRAW
    ============================================================
    */

    function test_emergencyLock_BlocksWithdraw()
        public
        deposited(leti, 1 ether)
    {
        vm.startPrank(leti);

        vault.emergencyLock();

        vm.expectRevert(LockFi.VaultLocked.selector);

        vault.withdraw(0.1 ether);

        vm.warp(block.timestamp + 23 hours); //move forward but still within lock duration
        vm.expectRevert(LockFi.VaultLocked.selector);
        vault.withdraw(0.1 ether);

        vm.warp(block.timestamp + 24 hours); //move forward past lock duration
        vault.withdraw(0.1 ether); // should work now

        vm.stopPrank();
    }

    function test_emergencyLock_resetsTimer() public deposited(leti, 1 ether) {
        vm.startPrank(leti);

        vault.emergencyLock();

        uint256 firstLock = vault.lockedUntil(leti);

        vm.warp(block.timestamp + 1 hours);

        vault.emergencyLock();

        uint256 secondLock = vault.lockedUntil(leti);

        vm.stopPrank();

        assertGt(secondLock, firstLock);
    }

    function testCancelStillWorksWhileLocked() public {
        vm.startPrank(leti);

        vault.deposit{value: 1 ether}();

        vault.withdraw(0.8 ether);

        vault.emergencyLock();

        // Cancel must still work
        vault.cancelWithdraw();

        vm.stopPrank();

        bool hasPending = vault.hasPendingWithdraw(leti);

        assertFalse(hasPending);
    }

    function test_withdraw_afterLockExpires() public deposited(leti, 1 ether) {
        vm.startPrank(leti);

        vault.emergencyLock();

        // Warp 24 hours
        vm.warp(block.timestamp + 24 hours);

        vault.withdraw(0.1 ether);

        vm.stopPrank();

        bool hasPending = vault.hasPendingWithdraw(leti);

        assertFalse(hasPending);
    }

    function test_emergencyLock_allowsWithdrawToSafe()
        public
        deposited(leti, 1 ether)
    {
        vm.startPrank(leti);

        vault.setSafeAddress(shai);

        vault.emergencyLock();

        uint256 safeBalanceBefore = shai.balance;

        vault.withdrawToSafe();

        uint256 safeBalanceAfter = shai.balance;

        assertEq(safeBalanceAfter, safeBalanceBefore + 1 ether);

        vm.stopPrank();
    }

    /*
    ============================================================
            SUSPICIOUS PATTERN TEST
            (<5% → >40%)
    ============================================================
    */

    function test_SuspiciousPatternTriggersPending()
        public
        deposited(leti, 1 ether)
    {
        vm.startPrank(leti);

        // Small withdraw (<5%)
        vault.withdraw(0.04 ether);

        // Large withdraw (>40%)
        vault.withdraw(0.5 ether);

        vm.stopPrank();

        bool hasPending = vault.hasPendingWithdraw(leti);

        assertTrue(hasPending);
    }

    /*
    ============================================================
                SAFE ADDRESS TESTS
    ============================================================
    */

    function test_setSafeAddress_reverts_ifZeroOrAlreadySet()
        public
        deposited(leti, 1 ether)
    {
        vm.prank(leti);
        vm.expectRevert(LockFi.InvalidSafeAddress.selector);
        vault.setSafeAddress(address(0));

        vm.prank(leti);
        vault.setSafeAddress(shai);

        vm.prank(leti);
        vm.expectRevert(LockFi.SafeAddressAlreadySet.selector);
        vault.setSafeAddress(eve);
    }

    function test_setSafeAddress_success() public deposited(leti, 1 ether) {
        vm.prank(leti);
        vm.expectEmit(true, false, false, true);
        emit LockFi.SafeAddressSet(leti, shai);
        vault.setSafeAddress(shai);

        address safe = vault.safeAddress(leti);
        assertEq(safe, shai);
    }

    function test_requestSafeAddressChange_reverts_ifNotSetOrPending()
        public
        deposited(leti, 1 ether)
    {
        vm.startPrank(leti);
        vm.expectRevert(LockFi.SafeAddressNotSet.selector);
        vault.requestSafeAddressChange(shai);

        vault.setSafeAddress(shai);
        vault.requestSafeAddressChange(eve);

        vm.expectRevert(LockFi.PendingSafeChangeExists.selector);
        vault.requestSafeAddressChange(address(0x04));

        vm.stopPrank();
    }

    function test_requestSafeAddressChange_reverts_ifInvalidAddressOrHasPending()
        public
        deposited(leti, 1 ether)
    {
        vm.startPrank(leti);
        vault.setSafeAddress(shai);

        vm.expectRevert(LockFi.InvalidSafeAddress.selector);
        vault.requestSafeAddressChange(leti); // same as sender

        vm.expectRevert(LockFi.SafeAddressAlreadySet.selector);
        vault.requestSafeAddressChange(shai); // same as current safe

        vault.requestSafeAddressChange(eve); // valid change
        vm.expectRevert(LockFi.PendingSafeChangeExists.selector);
        vault.requestSafeAddressChange(address(0x04)); // another change while pending

        vm.stopPrank();
    }

    function test_requestSafeAddressChange_reverts_ifPendingWithdrawExists()
        public
        deposited(leti, 1 ether)
    {
        vm.startPrank(leti);
        vault.setSafeAddress(shai);

        vault.withdraw(0.8 ether); // >60% → pending

        vm.expectRevert(LockFi.PendingWithdrawalExists.selector);
        vault.requestSafeAddressChange(eve);

        vm.stopPrank();
    }

    function test_requestSafeAddressChange_success()
        public
        deposited(leti, 1 ether)
    {
        vm.startPrank(leti);
        vault.setSafeAddress(shai);

        vm.expectEmit(true, true, false, true);
        emit LockFi.SafeAddressChangeRequested(
            shai,
            eve,
            block.timestamp + 24 hours
        );
        vault.requestSafeAddressChange(eve);

        (address pendingSafe, uint256 unlockTime) = vault.getPendingSafeChange(
            address(leti)
        );

        assertEq(pendingSafe, eve);
        assertEq(unlockTime, 24 hours);

        vm.stopPrank();
    }

    function test_confirmSafeAddressChange_reverts_ifNoPending()
        public
        deposited(leti, 1 ether)
    {
        vm.prank(leti);

        vm.expectRevert(LockFi.NoPendingSafeChange.selector);
        vault.confirmSafeAddressChange();
    }

    function test_confirmSafeAddressChange_reverts_ifDelayNotOver()
        public
        deposited(leti, 1 ether)
    {
        vm.startPrank(leti);

        vault.setSafeAddress(shai);
        vault.requestSafeAddressChange(eve);

        vm.expectRevert(LockFi.SafeChangeDelayNotOver.selector);
        vault.confirmSafeAddressChange();

        vm.stopPrank();
    }

    function test_confirmSafeAddressChange_success()
        public
        deposited(leti, 1 ether)
    {
        vm.startPrank(leti);

        vault.setSafeAddress(shai);
        vault.requestSafeAddressChange(eve);

        vm.warp(block.timestamp + 24 hours);

        vm.expectEmit(true, true, false, true);
        emit LockFi.SafeAddressChangeConfirmed(leti, eve);

        vault.confirmSafeAddressChange();

        address newSafe = vault.safeAddress(leti);
        assertEq(newSafe, eve);

        (address pendingSafe, uint256 unlockTime) = vault.getPendingSafeChange(
            leti
        );

        assertEq(pendingSafe, address(0));
        assertEq(unlockTime, 0);

        vm.stopPrank();
    }

    function test_cancelSafeAddressChange_reverts_ifNoPending()
        public
        deposited(leti, 1 ether)
    {
        vm.prank(leti);

        vm.expectRevert(LockFi.NoPendingSafeChange.selector);
        vault.cancelSafeAddressChange();
    }

    function test_cancelSafeAddressChange_success()
        public
        deposited(leti, 1 ether)
    {
        vm.startPrank(leti);

        vault.setSafeAddress(shai);
        vault.requestSafeAddressChange(eve);

        vm.expectEmit(true, false, false, true);
        emit LockFi.SafeAddressChangeCancelled(leti);

        vault.cancelSafeAddressChange();

        (address pendingSafe, uint256 unlockTime) = vault.getPendingSafeChange(
            leti
        );

        assertEq(pendingSafe, address(0));
        assertEq(unlockTime, 0);

        address currentSafe = vault.safeAddress(leti);
        assertEq(currentSafe, shai);

        vm.stopPrank();
    }

    function test_withdrawToSafe_reverts_ifSafeNotSet()
        public
        deposited(leti, 1 ether)
    {
        vm.prank(leti);

        vm.expectRevert(LockFi.SafeAddressNotSet.selector);
        vault.withdrawToSafe();
    }

    function test_withdrawToSafe_reverts_ifPendingWithdrawExists()
        public
        deposited(leti, 1 ether)
    {
        vm.startPrank(leti);

        vault.setSafeAddress(shai);

        vault.withdraw(0.8 ether); // >60% → pending

        vm.expectRevert(LockFi.PendingWithdrawalExists.selector);
        vault.withdrawToSafe();

        vm.stopPrank();
    }

    function test_withdrawToSafe_success() public deposited(leti, 1 ether) {
        vm.startPrank(leti);

        vault.setSafeAddress(shai);

        uint256 safeBalanceBefore = shai.balance;

        vm.expectEmit(true, true, false, true);
        emit LockFi.EmergencyWithdrawToSafe(leti, shai, 1 ether);

        vault.withdrawToSafe();

        uint256 safeBalanceAfter = shai.balance;

        assertEq(safeBalanceAfter, safeBalanceBefore + 1 ether);

        uint256 remaining = vault.balances(leti);
        assertEq(remaining, 0);

        vm.stopPrank();
    }

    function test_withdrawToSafe_reverts_ifBalanceZero() public {
        vm.startPrank(leti);

        vault.setSafeAddress(shai);

        vm.expectRevert(LockFi.AmountZero.selector);
        vault.withdrawToSafe();

        vm.stopPrank();
    }

    function test_withdrawToSafe_clearsUserBalance()
        public
        deposited(leti, 1 ether)
    {
        vm.startPrank(leti);

        vault.setSafeAddress(shai);

        vault.withdrawToSafe();

        uint256 balance = vault.balances(leti);

        assertEq(balance, 0);

        vm.stopPrank();
    }

    /*
    ============================================================
            BEHAVIOUR TEST
    ============================================================
    */

    function test_multipleUsersIsolation() public {
        vm.prank(leti);
        vault.deposit{value: 1 ether}();

        vm.prank(shai);
        vault.deposit{value: 1 ether}();

        vm.prank(leti);
        vault.withdraw(0.8 ether);

        bool letiPending = vault.hasPendingWithdraw(leti);

        bool shaiPending = vault.hasPendingWithdraw(shai);

        assertTrue(letiPending);
        assertFalse(shaiPending);

        uint256 shaiBalanceBefore = shai.balance;
        vm.prank(shai);
        vault.withdraw(0.1 ether);
        assertEq(shai.balance, shaiBalanceBefore + 0.1 ether);
    }

    function test_multiUserAccountingIntegrity() public {
        vm.prank(leti);
        vault.deposit{value: 1 ether}();

        vm.prank(shai);
        vault.deposit{value: 2 ether}();

        vm.prank(leti);
        vault.withdraw(0.8 ether);

        (uint256 pendingAmount, , ) = vault.getPendingWithdraw(leti);

        uint256 total = vault.totalBalance();

        uint256 letiBal = vault.balances(leti);

        uint256 shaiBal = vault.balances(shai);

        assertEq(total, letiBal + shaiBal + pendingAmount);
    }

    function test_repeatedPendingCycle() public {
        vm.startPrank(leti);

        vault.deposit{value: 1 ether}();

        for (uint256 i = 0; i < 3; i++) {
            vault.withdraw(0.8 ether);

            vault.cancelWithdraw();
        }

        vm.stopPrank();

        uint256 balance = vault.balances(leti);

        assertEq(balance, 1 ether);
    }

    function test_exactBoundary60Percent() public {
        vm.startPrank(leti);

        vault.deposit{value: 1 ether}();

        // exactly 60%
        vault.withdraw(0.6 ether);

        vm.stopPrank();

        bool hasPending = vault.hasPendingWithdraw(leti);

        // > 60 triggers, not == 60
        assertFalse(hasPending);
    }

    function test_receiveFunctionDeposit() public {
        vm.prank(leti);

        (bool success, ) = address(vault).call{value: 1 ether}("");

        assertTrue(success);

        uint256 balance = vault.balances(leti);

        assertEq(balance, 1 ether);
    }

    /*
    ============================================================
            GETTERS TEST
    ============================================================
    */

    function testGetUserVaultBalance() public {
        vm.prank(leti);

        vault.deposit{value: 1 ether}();

        uint256 balance = vault.getUserVaultBalance(leti);

        assertEq(balance, 1 ether);
    }

    function testAvailableWithdrawAmount() public {
        vm.startPrank(leti);

        vault.deposit{value: 1 ether}();

        uint256 available = vault.getInstantWithdrawLimit(leti);
        assertEq(available, 0.4 ether);

        vault.withdraw(0.8 ether);

        uint256 afterPending = vault.getInstantWithdrawLimit(leti);

        assertEq(afterPending, 0);

        vm.stopPrank();
    }

    function testIsVaultLocked() public {
        vm.startPrank(leti);

        vault.deposit{value: 1 ether}();

        vault.emergencyLock();

        bool locked = vault.isVaultLocked(leti);

        assertTrue(locked);

        vm.warp(block.timestamp + 24 hours);

        bool unlocked = vault.isVaultLocked(leti);

        assertFalse(unlocked);

        vm.stopPrank();
    }

    function testRemainingLockTime() public {
        vm.startPrank(leti);

        vault.deposit{value: 1 ether}();

        vault.emergencyLock();

        uint256 remaining = vault.getRemainingLockTime(leti);

        assertGt(remaining, 0);

        vm.stopPrank();
    }

    function testRemainingPendingTime() public {
        vm.startPrank(leti);

        vault.deposit{value: 1 ether}();

        vault.withdraw(0.8 ether);

        uint256 remaining = vault.getRemainingPendingTime(leti);

        assertGt(remaining, 0);

        vm.stopPrank();
    }

    function testGetUserState() public {
        vm.startPrank(leti);

        vault.deposit{value: 1 ether}();

        (
            uint256 balance,
            uint256 instantLimit,
            bool hasPending,
            ,
            ,
            bool locked,

        ) = vault.getUserState(leti);

        assertEq(balance, 1 ether);

        assertFalse(hasPending);

        assertFalse(locked);

        assertEq(instantLimit, 0.4 ether);

        vm.stopPrank();
    }

    function test_getPendingSafeChange_returnsZero_ifNone()
        public
        deposited(leti, 1 ether)
    {
        (address pendingSafe, uint256 unlockTime) = vault.getPendingSafeChange(
            leti
        );

        assertEq(pendingSafe, address(0));
        assertEq(unlockTime, 0);
    }

    function test_getPendingSafeChange_returnsPendingData()
        public
        deposited(leti, 1 ether)
    {
        vm.startPrank(leti);

        vault.setSafeAddress(shai);
        vault.requestSafeAddressChange(eve);

        (address pendingSafe, uint256 unlockTime) = vault.getPendingSafeChange(
            leti
        );

        assertEq(pendingSafe, eve);
        assertEq(unlockTime, 24 hours);

        vm.stopPrank();
    }

    function test_getPendingSafeChange_returnsZero_afterCancel()
        public
        deposited(leti, 1 ether)
    {
        vm.startPrank(leti);

        vault.setSafeAddress(shai);
        vault.requestSafeAddressChange(eve);

        vault.cancelSafeAddressChange();

        (address pendingSafe, uint256 unlockTime) = vault.getPendingSafeChange(
            leti
        );

        assertEq(pendingSafe, address(0));
        assertEq(unlockTime, 0);

        vm.stopPrank();
    }
}
