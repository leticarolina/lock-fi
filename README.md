# 🔒 LockFi — Smart Vault Security Protocol

**LockFi** is a self-custody smart vault that protects your funds from instant drainage by introducing behavioral risk detection on withdrawals.

Instead of letting funds exit immediately, LockFi evaluates every withdrawal attempt against a set of rules designed to detect real attack patterns. Suspicious withdrawals are delayed — not blocked — giving you a reaction window to cancel, lock your vault, or move funds to a pre-registered safe address.

> **The Vision:** Instant fund drainage should not be the industry standard. Users deserve a fair window of time to react to threats.

🏆 **1st Place Winner — Monad Hackathon**

- **Smart Contract:** [`LockFi.sol`](https://testnet.monadscan.com/address/0x0919Df3678039BCe59abdD19D7bf9e7D1b7eb5d8)
- **Live Demo:** [lock-fi.vercel.app](https://lock-fi.vercel.app/)
- **Security Design:** [`SECURITY.md`](./SECURITY.md)

---

## The Problem

In crypto today:

- **Compromised wallet** → funds drained in seconds, no recourse.
- **Fat-finger error** → transaction sent, nothing you can do.
- **Slow drain attack** → attacker extracts gradually, staying under the radar.
- **Safe address hijack** → attacker reroutes your recovery address before you notice.

Everything happens at blockchain speed. One mistake or one compromised key, and it's over.

---

## The Solution

LockFi sits between your funds and the outside world. Every withdrawal is evaluated before it executes.

**🟢 Small, normal amount** — executes instantly.  
**🟠 Large or suspicious amount** — enters pending queue with a 12h delay.  
**🟠 Any withdrawal after a small probe** — flagged by pattern detection, 12h delay.  
**🟠 Cumulative drain over 72h** — flagged by time-window tracking, 12h delay.

If something looks wrong, you have time to act:

1. **Cancel** the pending withdrawal — funds return to your vault immediately.
2. **Lock the vault** — freeze all outgoing activity for up to 30 days.
3. **Withdraw to safe address** — route everything to a pre-registered trusted address.

---

## Risk Detection Rules

### Rule 1 — Large Withdrawal

**Trigger:** Withdrawal exceeds 60% of your vault balance.

```solidity
Balance: 10 ETH
Withdrawal: 7 ETH (70%) → Flagged, 12h delay
```

Defends against instant full-balance drain after wallet compromise.

---

### Rule 2 — Test-Probe Pattern

**Trigger:** Your previous withdrawal was less than 5% of balance.

```solidity
Withdrawal 1: 0.04 ETH (4%) → Executes instantly
Withdrawal 2: Any amount   → Flagged, 12h delay
```

Defends against staged attacks where an attacker first sends a small "test" transaction to verify wallet access before attempting a larger drain.

---

### Rule 3 — Cumulative Time Window

**Trigger:** Total withdrawals within the last 72 hours exceed 30% of your balance.

```solidity
Balance: 10 ETH
Withdrawal 1: 10% → OK
Withdrawal 2: 10% → OK
Withdrawal 3: 11% → Flagged (cumulative > 30%)
```

Defends against slow-drain attacks where an attacker extracts gradually to avoid triggering Rule 1.

---

## Key Features

### Withdrawal Lifecycle

- Every withdrawal is either instant or enters a **12-hour pending queue**.
- Only **one pending withdrawal** per user — prevents spamming to exhaust the delay mechanism.
- Pending withdrawals can be **cancelled at any time**, returning funds to the vault instantly.

### Emergency Lock

- Freeze all vault activity for a **user-defined duration** (1 hour to 30 days).
- Lock can only be **extended, never shortened** — an attacker cannot reduce your lock to regain access sooner.
- Blocks all withdrawals, pending executions, and safe address changes while active.

### Safe Address Recovery

- Register a **trusted recovery address** as a permanent exit path.
- Changing the safe address requires a **24-hour delay** — prevents attackers from rerouting it before you can react.
- Safe address changes are **blocked during emergency lock**.
- `withdrawToSafe` sends your entire balance to the safe address in one transaction.

---

## How It Works

**Normal withdrawal flow:**

1. User deposits ETH into the vault
2. User requests a withdrawal
3. LockFi evaluates the risk — instant if safe, 12h pending queue if suspicious
4. If pending: user waits and executes, or cancels immediately if it wasn't them

**If the vault is ever at risk:**

1. Detect suspicious activity
2. Trigger emergency lock (1 hour to 30 days — nothing moves)
3. Cancel any pending withdrawal if one was queued by the attacker
4. Wait for the lock to expire
5. Withdraw everything to your pre-registered safe address

---

## Smart Contract Functions

```solidity
// Core vault
deposit()                              // Deposit native token
withdraw(uint256 amount)               // Initiate withdrawal — instant or delayed
executeWithdraw()                      // Execute after delay expires
cancelWithdraw()                       // Cancel pending withdrawal

// Emergency
emergencyLock(uint256 duration)        // Lock vault (1h to 30 days)

// Safe address
setSafeAddress(address _safe)          // Register recovery address (first time)
requestSafeAddressChange(address)      // Request change (24h delay)
confirmSafeAddressChange()             // Confirm after delay
cancelSafeAddressChange()              // Cancel pending change
withdrawToSafe()                       // Send full balance to safe address

// View helpers
getUserState(address)                  // Full vault state in one call
getInstantWithdrawLimit(address)       // Max amount that executes instantly
getRemainingPendingTime(address)       // Time left on pending withdrawal
getRemainingLockTime(address)          // Time left on emergency lock
```

---

## Security Architecture

- **ReentrancyGuard** on all functions that transfer ETH.
- **Checks-Effects-Interactions** pattern throughout — balance deducted before ETH sent.
- **Per-user state isolation** — no shared pools, no cross-user risk.
- **Extension-only lock** — `lockedUntil` can only move forward in time.
- **Behavioral detection** — risk rules operate on pattern history, not just single transaction amounts.

For full design rationale, threat model, and audit guidance see [`SECURITY.md`](./SECURITY.md).

---

## Testing

Test coverage includes unit tests across all functions and edge cases, plus invariant tests verifying solvency, balance integrity, and state consistency under arbitrary call sequences.

---

## Known Limitations

- Native token only (ETH / MON). ERC-20 support is planned.
- Rule thresholds are hardcoded constants. Configurable thresholds are a future consideration.
- `lastWithdrawPercent` (Rule 2 probe detection) persists indefinitely. A user who once made a small withdrawal will have their next withdrawal delayed regardless of elapsed time. The cancel mechanism mitigates this.

---

## Stack

- **Smart Contract:** Solidity 0.8.20, Foundry, OpenZeppelin
- **Frontend:** React, wagmi, RainbowKit, Next.js
- **Network:** Monad Testnet

---

## Authorship

**Leticia Azevedo** — Smart Contract Architecture & Lead Dev  
**Shaiane Viana** — UI/UX Design

Built with 💜 for the Monad ecosystem.
