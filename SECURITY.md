# LockFi — Security Design Document

**Author:** Leticia Azevedo  
**Contract:** `LockFi.sol`  
**Version:** Post-hackathon MVP  
**Last Updated:** March 2026

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

A common attacker behavior: first send a small "test" transaction to verify wallet permissions and contract interaction, then follow with a large drain. LockFi's Rule 2 specifically detects this sequential pattern.

### 4. Slow Drain Attack

An attacker with partial access attempts to bypass large-withdrawal protections by extracting funds gradually over time in smaller increments. LockFi's Rule 3 tracks cumulative withdrawals over a 72-hour window to detect and flag this behavior.

### 5. Safe Address Hijacking

An attacker with a compromised key attempts to change the user's safe address to their own, then use `withdrawToSafe` to drain funds. The 24-hour delay on safe address changes prevents this — the legitimate user has time to detect and cancel the pending change.

---

## Risk Detection Rules

### Rule 1 — Large Withdrawal Threshold

**Trigger:** Withdrawal amount exceeds 60% of the user's current balance.  
**Defends against:** Instant full-balance drain after wallet compromise.  
**Rationale:** Legitimate users rarely need to withdraw the majority of a vault balance in a single transaction. This threshold was chosen to be permissive enough for normal use while catching the most common drain pattern.

### Rule 2 — Suspicious Sequential Pattern

**Trigger:** The previous withdrawal was less than 5% of balance AND the current withdrawal exceeds 40% of balance.  
**Defends against:** Test-probe attack behavior where an attacker first verifies access with a small transaction before executing a large drain.  
**Rationale:** The combination of a small prior withdrawal followed immediately by a large one is a strong behavioral signal of staged attack activity. Normal users do not typically follow this pattern.

**Important design note:** `lastWithdrawPercent` is intentionally NOT reset when a withdrawal is cancelled. If it were reset, an attacker could erase their own suspicious pattern history by cancelling a flagged withdrawal and repeating the test-probe sequence. The percent is recorded at the moment of withdrawal request, not execution.

### Rule 3 — Cumulative 72-Hour Window

**Trigger:** Total withdrawals within the last 72 hours exceed 30% of the user's balance.  
**Defends against:** Slow drain attacks where an attacker extracts funds gradually to avoid triggering Rule 1.  
**Rationale:** A rolling time window catches accumulated suspicious behavior that no single transaction would flag individually.

**Window behavior:** The window initializes on first withdrawal and resets after 72 hours. Cumulative percentage is tracked per user in isolation.

---

## Intentional Design Decisions

### emergencyLock accepts a user-defined duration

Rather than a hardcoded lock duration, `emergencyLock` accepts a `duration` parameter bounded between `MIN_LOCK_DURATION` (1 hour) and `MAX_LOCK_DURATION` (30 days).

**Rationale:** A fixed duration cannot serve both use cases above. An active threat response may only need hours. A user going offline for a month needs days or weeks. Forcing a single value either makes the lock too short to be useful for passive protection or too long to be practical for active response. The contract enforces the safety constraints without making the duration decision for the user.

**Bounds rationale:** The 1-hour minimum prevents trivially short locks that provide no meaningful protection. The 30-day maximum prevents accidental semi-permanent lockout where a user forgets they locked the vault.

### Two separate functions for safe address setup vs. change

`setSafeAddress` (first-time setup) and `requestSafeAddressChange` (subsequent changes) are intentionally separate functions with different security requirements.

**Rationale:** First-time setup requires no delay — there is no existing safe address to protect and no attack vector to defend against. However, changing an existing safe address is a high-risk operation: an attacker with a compromised key would immediately attempt to reroute the safe address to their own wallet before calling `withdrawToSafe`. The mandatory 24-hour delay on changes makes this attack ineffective. Merging these into one function would add conditional complexity without improving security.

### withdrawToSafe respects emergencyLock

`withdrawToSafe` is not allowed to execute when the vault is under emergency lock. This is intentional.

**Rationale:** Emergency lock serves two distinct use cases:

**Active threat response:** User detects a compromise and locks immediately. The recovery path is still protected upstream, any attempt to reroute the safe address requires a 24-hour delay, giving the user time to cancel a malicious safe address change before it executes. The user waits for the lock to expire then calls `withdrawToSafe`.

**Passive protection:** User is going offline for an extended period and wants a hard guarantee that nothing moves. Emergency lock with a user-defined duration (up to 30 days) provides this.

In both cases the guarantee of this invariant must be absolute — nothing leaves the vault while locked. The tradeoff is a potential wait during an active attack, but this is preferable to the alternative: a user who activates emergency lock believing funds are fully frozen while an attacker can still drain via `withdrawToSafe` if the safe address was already changed undetected.

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

---

## Disclaimer

This document describes design intent, not a formal security audit. LockFi has not been independently audited. Do not deposit funds you cannot afford to lose until a formal audit has been completed.

## Audit Guidance

For auditors reviewing this contract, the highest-priority areas to examine are:

1. **Balance accounting** across the withdraw → pending → execute/cancel lifecycle, particularly around the interaction between `balances`, `pendingWithdraw.amount`, and `withdrawToSafe`.
2. **`_isRisky` state reads** — confirm that `lastWithdrawPercent` is read before it is written in `withdraw()`, ensuring Rule 2 compares against the previous withdrawal, not the current one.
3. **`_updateWithdrawWindow` behavior** — verify correct window initialization, accumulation, and reset logic across edge cases.
4. **Reentrancy** — `nonReentrant` is applied to all functions that call `_sendEth`. Verify coverage is complete.