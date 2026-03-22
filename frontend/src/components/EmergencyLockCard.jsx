import React, { useState } from 'react'
import { useVault } from '../context/VaultContext.jsx'
import { useCountdown } from '../hooks/useCountdown.js'

export default function EmergencyLockCard() {
  const { emergencyLock, isEmergencyLocked, activateEmergencyLock, deactivateEmergencyLock } = useVault()
  const locked = isEmergencyLocked()
  const { formatted } = useCountdown(emergencyLock?.unlockTimestamp)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isActivating, setIsActivating] = useState(false)

  const handleActivate = async () => {
    setIsActivating(true)
    await new Promise(r => setTimeout(r, 500))
    activateEmergencyLock()
    setIsActivating(false)
    setShowConfirm(false)
  }

  // If lock is active, show the active lock card
  if (locked) {
    const activatedDate = emergencyLock.activatedAt.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
    const activatedTime = emergencyLock.activatedAt.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })

    return (
      <div className="relative rounded-2xl overflow-hidden">
        {/* Red pulsing border glow */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-vault-danger/25 via-vault-danger/5 to-transparent pointer-events-none" />

        <div className="card border-vault-danger/30 relative">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-vault-danger/15 flex items-center justify-center">
                  <svg className="w-5 h-5 text-vault-danger" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                {/* Pulse ring */}
                <span className="absolute inset-0 rounded-xl border-2 border-vault-danger/40 animate-ping" style={{ animationDuration: '2s' }} />
              </div>
              <div>
                <h3 className="font-display font-700 text-base text-vault-danger tracking-wide">
                  Emergency Lock Active
                </h3>
                <p className="text-vault-muted text-[10px] font-body tracking-wider uppercase mt-0.5">
                  All withdrawals are frozen
                </p>
              </div>
            </div>

            {/* Active badge */}
            <span className="px-3 py-1.5 bg-vault-danger/10 border border-vault-danger/30 rounded-full text-vault-danger text-[10px] font-body tracking-wider uppercase animate-pulse">
              Locked
            </span>
          </div>

          {/* Info row */}
          <div className="grid grid-cols-2 gap-4 mb-5 p-4 bg-vault-surface/80 rounded-xl border border-vault-border/50">
            <div className="space-y-1">
              <p className="text-vault-muted text-[10px] font-body tracking-[0.12em] uppercase">
                Activated
              </p>
              <p className="font-body text-xs text-vault-text-dim">
                {activatedDate}, {activatedTime}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-vault-muted text-[10px] font-body tracking-[0.12em] uppercase">
                Unlocks In
              </p>
              <p className="font-display font-700 text-xl text-vault-danger tabular-nums">
                {formatted}
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-5">
            <div className="h-1.5 bg-vault-surface rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-vault-danger to-vault-danger/50 rounded-full animate-shimmer"
                style={{ backgroundSize: '200% 100%', width: '100%' }}
              />
            </div>
          </div>

          {/* What's blocked message */}
          <div className="flex items-start gap-2.5 p-3 bg-vault-danger-glow border border-vault-danger/15 rounded-xl mb-4">
            <svg className="w-4 h-4 text-vault-danger mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <div className="space-y-1">
              <p className="text-vault-danger text-[11px] font-body font-medium">
                No withdrawals can be processed during emergency lock.
              </p>
              <p className="text-vault-muted text-[10px] font-body leading-relaxed">
                Deposits are still allowed. Any pending withdrawal has been automatically cancelled.
                The vault will unlock automatically when the timer reaches 00:00.
              </p>
            </div>
          </div>

          {/* For demo only — remove in production */}
          <button
            onClick={deactivateEmergencyLock}
            className="w-full py-2.5 text-vault-muted text-[10px] font-body tracking-wider uppercase
                       border border-dashed border-vault-border/50 rounded-lg
                       hover:border-vault-muted/40 hover:text-vault-text-dim
                       transition-all duration-200"
          >
            ⚠ Force Unlock (Demo Only)
          </button>
        </div>
      </div>
    )
  }

  // If lock is NOT active, show the activate button
  return (
    <div className="card border-vault-border/50 relative overflow-hidden">
      {/* Subtle danger tint in corner */}
      <div className="absolute -top-12 -right-12 w-28 h-28 bg-vault-danger/3 rounded-full blur-2xl pointer-events-none" />

      <div className="relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-vault-danger/8 flex items-center justify-center">
              <svg className="w-4.5 h-4.5 text-vault-danger/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <div>
              <h3 className="font-display font-600 text-sm text-vault-text tracking-wide">
                Emergency Lock
              </h3>
              <p className="text-vault-muted text-[10px] font-body mt-0.5">
                Freeze all withdrawals instantly
              </p>
            </div>
          </div>

          {!showConfirm ? (
            <button
              onClick={() => setShowConfirm(true)}
              className="px-4 py-2 bg-vault-danger/10 border border-vault-danger/25 rounded-lg
                         text-vault-danger text-[11px] font-body font-medium tracking-wider uppercase
                         hover:bg-vault-danger/20 hover:border-vault-danger/40
                         transition-all duration-200"
            >
              Activate
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-3 py-2 text-vault-muted text-[11px] font-body tracking-wider uppercase
                           hover:text-vault-text transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleActivate}
                disabled={isActivating}
                className="px-4 py-2 bg-vault-danger border border-vault-danger rounded-lg
                           text-white text-[11px] font-body font-medium tracking-wider uppercase
                           hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]
                           disabled:opacity-60
                           transition-all duration-200 flex items-center gap-2"
              >
                {isActivating ? (
                  <>
                    <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.3" />
                      <path d="M12 2C6.48 2 2 6.48 2 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    Locking…
                  </>
                ) : (
                  'Confirm Lock'
                )}
              </button>
            </div>
          )}
        </div>

        {/* Confirmation warning */}
        {showConfirm && (
          <div className="mt-4 flex items-start gap-2 p-3 bg-vault-danger-glow border border-vault-danger/15 rounded-xl animate-slide-in">
            <svg className="w-3.5 h-3.5 text-vault-danger mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <p className="text-vault-danger/80 text-[11px] font-body leading-relaxed">
              This will freeze <strong className="text-vault-danger">all withdrawals</strong> for
              the next <strong className="text-vault-danger">2 minutes</strong> (24h in production).
              Any pending withdrawal will be cancelled. Deposits remain unaffected.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
