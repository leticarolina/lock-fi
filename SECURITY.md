# LockFi — Security Design Document

**Author:** Leticia Azevedo  
**Contract:** `LockFi.sol`  
**Version:** MVP
**Last Updated:** April 2026

---

## Overview

LockFi is a self-custody smart vault that introduces behavioral risk detection on withdrawals. Instead of allowing instant fund drainage, LockFi evaluates each withdrawal attempt against a set of rules designed to detect common on-chain attack patterns. Suspicious withdrawals are delayed rather than blocked outright, giving the legitimate user a reaction window to cancel, lock the vault, or route funds to a pre-registered safe address.

The core design philosophy is: **instant fund drainage should not be the default behavior for large or suspicious withdrawals.**

---

## Threat Model

LockFi is designed to defend against the following attack scenarios:

### 1. Compromised Private Key

An attacker gains access to the user's private key and attempts to drain the vault immediately. Without LockFi, funds are gone in seconds. With LockFi, a large withdrawal is flagged and delayed, giving the legitimate user time to detect the unauthorized activity and cancel or lock the vault.

### 2. Fat-Finger / User Error

A user accidentally initiates a large withdrawal to the wrong address. The delay window provides a cancellation path before funds leave the contract.

### 3. Staged Attack (Test-Probe Pattern)

A common attacker behavior: first send a small "test" transaction to verify wallet permissions and contract interaction, then follow with a larger drain. LockFi's Rule 2 detects this sequential pattern that any withdrawal following a small probe is flagged regardless of its size.

### 4. Slow Drain Attack

An attacker with partial access attempts to bypass large-withdrawal protections by extracting funds gradually over time in smaller increments. LockFi's Rule 3 tracks cumulative withdrawals over a 72-hour window to detect and flag this behavior.

### 5. Safe Address Hijacking

An attacker with a compromised key attempts to change the user's safe address to their own, then use `withdrawToSafe` to drain funds. The 24-hour delay on safe address changes prevents this, so the legitimate user has time to detect and cancel the pending change before it takes effect.

### 6. Lock Bypass via Safe Address Change

An attacker who cannot immediately drain funds attempts to queue a safe address change during an active emergency lock, wait for the change delay to expire, confirm the reroute, then drain via `withdrawToSafe` the moment the lock expires. Both `requestSafeAddressChange` and `confirmSafeAddressChange` are blocked during emergency lock, closing this attack path entirely.

### 7. Lock Duration Reduction

An attacker with a compromised key finds the vault under emergency lock and attempts to reduce the lock duration by calling `emergencyLock` with a shorter value, gaining access sooner. The contract enforces extension-only behavior, `lockedUntil` can only move forward in time, never backward.

---

## Risk Detection Rules

### Rule 1 — Large Withdrawal Threshold

**Trigger:** Withdrawal amount exceeds 60% of the user's current balance.  
**Defends against:** Instant full-balance drain after wallet compromise.  
**Rationale:** Legitimate users rarely need to withdraw the majority of a vault balance in a single transaction. This threshold was chosen to be permissive enough for normal use while catching the most common drain pattern.

### Rule 2 — Suspicious Sequential Pattern

**Trigger:** The previous withdrawal was less than 5% of balance at the time it was made.  
**Defends against:** Test-probe attack behavior where an attacker first verifies wallet access with a small transaction before executing a larger drain.  
**Rationale:** A small probe withdrawal is a strong behavioral signal of staged attack intent. Any withdrawal following a probe, regardless of size, is treated as suspicious. The original design included a secondary threshold (next withdrawal > 40%) but this was removed because it made Rule 2 nearly redundant with Rule 3.

**Important design notes:**

- `lastWithdrawPercent` is intentionally **not reset when a withdrawal is cancelled**. If it were reset, an attacker could erase their suspicious pattern history by cancelling a flagged withdrawal and repeating the test-probe sequence. The percent is recorded at the moment of the withdrawal request, not at execution.
- `lastWithdrawPercent` is also intentionally **not reset when the 72-hour window expires**. The probe pattern is a behavioral signal that persists regardless of time. A patient attacker who probes and then waits for a window reset should still be flagged.

### Rule 3 — Cumulative 72-Hour Window

**Trigger:** Total withdrawals within the last 72 hours exceed 30% of the user's balance.  
**Defends against:** Slow drain attacks where an attacker extracts funds gradually to avoid triggering Rule 1.  
**Rationale:** A rolling time window catches accumulated suspicious behavior that no single transaction would flag individually.

**Window behavior:** The window initializes on first withdrawal and resets after 72 hours. Cumulative percentage is tracked per user in isolation. Deposits during an active window do not reset accumulation, the percent of each withdrawal is calculated against the balance at the time of that specific withdrawal.

---

## Intentional Design Decisions

### emergencyLock accepts a user-defined duration

Rather than a hardcoded lock duration, `emergencyLock` accepts a `duration` parameter bounded between `MIN_LOCK_DURATION` (1 hour) and `MAX_LOCK_DURATION` (30 days).

**Rationale:** Emergency lock serves two distinct use cases that a fixed duration cannot satisfy simultaneously:

**Active threat response:** User detects a compromise and needs to freeze the vault immediately. A short lock (hours) may be sufficient while they assess and respond.

**Passive protection:** User is going offline for an extended period and wants a hard guarantee that nothing moves. A longer lock (days or weeks) serves this need.

The contract enforces safety bounds without making the duration decision for the user.

**Bounds rationale:** The 1-hour minimum prevents trivially short locks that offer no meaningful protection. The 30-day maximum prevents accidental semi-permanent lockout.

### emergencyLock can only extend, never shorten

Once `lockedUntil` is set, subsequent calls to `emergencyLock` can only push the unlock time further into the future. Any call where `block.timestamp + duration < lockedUntil` reverts with `LockNotExtended`.

**Rationale:** Without this check, an attacker with a compromised key could find a locked vault and immediately reduce the lock duration to regain access sooner. Extension-only behavior ensures the lock is an absolute guarantee — once set, it cannot be weakened.

### Two separate functions for safe address setup vs. change

`setSafeAddress` (first-time setup) and `requestSafeAddressChange` (subsequent changes) are intentionally separate functions with different security requirements.

**Rationale:** First-time setup requires no delay — there is no existing safe address to protect and no attack vector to defend against. However, changing an existing safe address is a high-risk operation: an attacker with a compromised key would immediately attempt to reroute the safe address to their own wallet before calling `withdrawToSafe`. The mandatory 24-hour delay on changes makes this attack ineffective. Merging these into one function would add conditional complexity without improving security.

### Safe address changes are blocked during emergency lock

Both `requestSafeAddressChange` and `confirmSafeAddressChange` revert with `EmergencyLockOngoing` when the vault is locked.

**Rationale:** Without this block, an attacker could queue a safe address change during an active lock, wait for the 24-hour change delay, confirm the reroute, then call `withdrawToSafe` immediately after the lock expires — effectively bypassing the lock's protection. Blocking both request and confirm during lock closes this attack window entirely.

**Effect on legitimate users:** A user who queued a safe address change before activating a lock can still cancel the pending change at any time. They can confirm it after the lock expires. `cancelSafeAddressChange` is intentionally not blocked during lock — cancelling is always a safe action.

### withdrawToSafe respects emergencyLock

`withdrawToSafe` is not allowed to execute when the vault is under emergency lock. This is intentional.

**Rationale:** Emergency lock must be an absolute freeze on all outgoing activity. Allowing `withdrawToSafe` to bypass the lock would undermine the passive protection use case — a user who locks for 30 days expects nothing to move, but an attacker with the key could still drain via `withdrawToSafe` if the safe address had already been changed undetected.

For the active threat use case, the user can wait for the lock to expire then call `withdrawToSafe`. The safe address itself is protected by a 24-hour change delay and is blocked during lock, making it a trusted destination by the time the lock expires.

### One pending withdrawal per user

The contract enforces a strict limit of one pending withdrawal per user at any time.

**Rationale:** Allowing multiple pending withdrawals would create a potential bypass, an attacker could spam withdrawal requests to exhaust the delay mechanism or create ambiguous state around balance accounting. A single pending slot keeps state simple. If a user has a pending withdrawal and initiates another, the new request will fail until they cancel or execute the existing one.

### Balance deducted immediately on risky withdrawal request

When a withdrawal is flagged as risky and placed in the pending queue, the amount is deducted from `balances[msg.sender]` immediately rather than at execution time.

**Rationale:** This prevents a double-spend scenario where a user's displayed balance could be used to initiate additional withdrawals against funds already committed to a pending request. It also simplifies balance accounting across the cancel/execute lifecycle.

### emergencyLock check added to executeWithdraw

`executeWithdraw` checks `lockedUntil` in addition to `withdraw`. This means an emergency lock activated after a pending withdrawal was created will still block execution.

**Rationale:** Without this check, an attacker who successfully queued a withdrawal before the user triggered emergency lock could still execute it after the delay. Adding the check ensures emergency lock is a true freeze on all outgoing activity.

---

## Constants and Their Rationale

**`DELAY` — 12 hours**  
Withdrawal delay for flagged requests. Long enough to act on an alert, short enough not to punish legitimate users.

**`MIN_LOCK_DURATION` — 1 hour**  
Shortest meaningful emergency lock. Prevents trivially short locks that offer no real protection.

**`MAX_LOCK_DURATION` — 30 days**  
Caps user-defined lock duration to prevent accidental long-term lockout.

**`SAFE_ADDRESS_CHANGE_DELAY` — 24 hours**  
Mandatory delay before a safe address change takes effect. Blocks attackers from rerouting recovery funds within the same window used for emergency response.

**`WINDOW_DURATION_FOR_MAX_WITHDRAW` — 72 hours**  
Rolling window for cumulative withdrawal tracking. Wide enough to catch slow drain attacks without flagging normal multi-day usage.

**`MAX_WITHDRAW_PERCENT` — 30%**  
Maximum cumulative withdrawals allowed within the 72-hour window before triggering a delay.

---

## Known Limitations

- **Native token only (current version):** LockFi currently supports only the native token of the deployed chain. ERC-20 support would require per-token balance tracking and separate risk windows, and is planned for a future version.
- **Rule thresholds are fixed:** Delay thresholds and risk percentages are hardcoded constants. Future versions could explore user-configurable thresholds within safe bounds.
- **No oracle integration:** Risk detection is purely behavioral and on-chain. It does not account for external price volatility or cross-protocol context.
- **Single safe address:** Each user can register one safe address. Multi-address recovery is a potential future feature.
- **`lastWithdrawPercent` persists indefinitely:** The probe detection history never resets. A legitimate user who once made a small withdrawal will have their next withdrawal flagged regardless of how much time has passed. The cancel mechanism mitigates this, the delayed withdrawal can be cancelled and re-requested, but it is a known UX friction point.

---

## Disclaimer

This document describes design intent, not a formal security audit. LockFi has not been independently audited. Do not deposit funds you cannot afford to lose until a formal audit has been completed.

## Audit Guidance

For auditors reviewing this contract, the highest-priority areas to examine are:

1. **Balance accounting** across the withdraw → pending → execute/cancel lifecycle, particularly around the interaction between `balances`, `pendingWithdraw.amount`, and `withdrawToSafe`.
2. **`_isRisky` state reads** — confirm that `lastWithdrawPercent` is read before it is written in `withdraw()`, ensuring Rule 2 compares against the previous withdrawal, not the current one.
3. **`_updateWithdrawWindow` behavior** — verify correct window initialization, accumulation, and reset logic across edge cases.
4. **Reentrancy** — `nonReentrant` is applied to all functions that call `_sendEth`. Verify coverage is complete.