# 🔒 LockFi — Vault Protection Against Risky Withdrawals

**LockFi** is a security-oriented smart vault that introduces a strategic delay on high-risk withdrawals, preventing the instant loss of user funds.

Instead of allowing large amounts to exit a wallet immediately, LockFi creates a "reaction window." This gives the user time to detect unauthorized activity, cancel the withdrawal, or trigger an emergency lock before the funds are actually moved.

**⭐ The Vision**: Instant fund drainage should not be the industry standard. Users deserve a fair window of time to react to threats.

Project developed for the **Monad Hackathon** (1st Place Winner 🏆).

**Smart Contract:** [`LockFi.sol`](https://testnet.monadscan.com/address/0x31b36930BdFe07f4366379De4CFeAEF528Ce8e70)
**Live Demo:** [LockFi DApp](https://lockfi.vercel.app/)

---

## The Problem

Currently, in the crypto ecosystem:

- **Compromised Wallet** → Funds are drained in seconds.
- **Fat-finger Errors** → No way to revert a transaction once sent.
- **Total Drainage** → Attackers can empty a vault instantly.

**The Reality:**

- Zero reaction time.
- No intermediate protection layer.
- Everything happens at the speed of the blockchain, making any mistake or exploit fatal.

## The Solution — LockFi

LockFi acts as an **Intelligent Security Layer** for your assets.

When you deposit funds into the vault and attempt a withdrawal, the system categorizes the risk:

- 🟢 **Small Withdrawals** → Executed instantly.
- 🟠 **Large Withdrawals** → Placed in a "Pending" queue.
- 🔴 **Suspicious Patterns** → Automatically flagged for a mandatory delay.

This delay creates a **Reaction Window**. If a transaction wasn't initiated by you (or was a mistake), you can:

1. **Cancel** the withdrawal immediately.
2. **Lock** the entire vault.
3. **Save** withdraw your assets to a safe pre-defined address before they leave the contract.

## How it Works in Practice

### 1. Deposit

The user sends ETH to the vault. The value is safely stored within the smart contract logic.

### 2. Request Withdrawal

When a user requests a withdrawal, the contract evaluates the risk profile:

**Secure Withdrawal:** If the amount is small relative to the total balance, it executes immediately.
**Risky Withdrawal:** If the amount meets one of the risky behaviors, the withdrawal enters a **Pending State**.

### 3. Execute or Cancel

If the withdrawal was legitimate, the user simply waits for the timer to expire and calls the execution function. If the activity is suspicious, the user can trigger an **Immediate Cancel**, returning the funds to the secure vault state.

### 4. Emergency Lockdown

In case of a known or suspicious of compromise, the user can trigger an **Emergency Lock**. This freezes all outgoing activity for 24 hours, providing a vital buffer to move recovery keys or secure other assets.

---

## Risk Detection Rules

A withdrawal is flagged and delayed if it triggers any of the following conditions.

These rules are designed to detect common attack behaviors while preserving normal user experience.

---

### Rule 1: Threshold Breach (Large Withdrawal)

Triggered if the withdrawal amount is greater than **60% of the user's total balance**.

**Example**

Balance: `10 ETH`  
Withdrawal: `7 ETH` → **Flagged**

This rule protects against **instant full-balance drain attempts**, which are common after wallet compromise.

---

### Rule 2: Anomaly Detection (Suspicious Pattern)

Triggered if a small "test" withdrawal is immediately followed by a large withdrawal.

**Example**

Withdrawal 1: `0.1 ETH`  
Withdrawal 2: `5 ETH` → **Flagged**

This rule protects against **staged attack behavior**, where attackers first test wallet permissions before attempting a larger withdrawal.

---

### Rule 3: Cumulative Withdrawal Limit (Time-Based Protection)

Triggered if the user's **total withdrawals within a rolling time window** exceed a defined percentage of their balance.

**Current Configuration**

- Maximum allowed: **30% of balance**
- Time window: **72 hours**

If cumulative withdrawals exceed this threshold, the **next withdrawal is automatically flagged and delayed**, regardless of size.

**Example**

Withdrawal 1 → `10%`  
Withdrawal 2 → `10%`  
Withdrawal 3 → `10%`  
Withdrawal 4 → `Any amount` → **Flagged**

This rule protects against **slow-drain attacks**, where attackers attempt to bypass large-withdrawal protections by extracting funds gradually over time.

---

## Why These Rules Matter

Together, these mechanisms create **layered behavioral protection** against multiple real-world attack patterns:

- **Rule 1** → Blocks large instant drains  
- **Rule 2** → Detects staged attack behavior  
- **Rule 3** → Prevents slow cumulative draining  

Instead of blocking withdrawals outright, LockFi introduces **controlled delays**, giving users time to react, cancel suspicious actions, or move funds to a safe address.

---

### Key Features

- **ETH Storage Vault:** Secure on-chain accounting.
- **Dynamic Delays:** Speed for small amounts, safety for large ones.
- **Active Defense:** Cancel pending transactions or lock the vault entirely.
- **One Pending Action:** Prevents spamming withdrawal requests to bypass security.

## Technical Overview

### Smart Contract Functions

```solidity
deposit()           // Securely store ETH
withdraw(amount)    // Initiate withdrawal (Instant or Delayed)
executeWithdraw()   // Complete a pending withdrawal after the delay
cancelWithdraw()    // Revert a suspicious pending withdrawal
emergencyLock()     // 24-hour freeze on all vault activity
```

## Security Architecture

- Strict Internal Accounting: Prevents reentrancy and balance manipulation.
- State Independence: Each user’s security state (timers/locks) is isolated.
- Mandatory Timelocks: Immutable logic ensures delays cannot be bypassed if triggered.
- Safe-Address Whitelisting: Pre-define recovery addresses.

## Authorship

Leticia Azevedo — Smart Contract Architecture & Lead Dev
Shaiane Viana — UI/UX Design

Built with 💜 for the Monad ecosystem.
