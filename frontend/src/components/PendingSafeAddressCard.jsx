import React, { useState } from 'react'
import { useVault } from '../context/VaultContext.jsx'
import { useCountdown } from '../hooks/useCountdown.js'

export default function PendingSafeAddressCard() {
  const { pendingSafeAddress, confirmSafeAddress, cancelSafeAddressChange, isEmergencyLocked } = useVault()
  const locked = isEmergencyLocked()
  const { formatted, isComplete, secondsLeft } = useCountdown(pendingSafeAddress?.unlockTimestamp)
  const [executingAction, setExecutingAction] = useState(null) // 'confirm' | 'cancel'

  if (!pendingSafeAddress) return null

  const requestedDate = pendingSafeAddress.requestedAt.toLocaleDateString('en-US', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
  const requestedTime = pendingSafeAddress.requestedAt.toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', hour12: true,
  })

  const handleConfirm = async () => {
    if (!isComplete) return
    setExecutingAction('confirm')
    try {
      await confirmSafeAddress()
    } catch (err) {
      console.error('confirmSafeAddress failed:', err)
    } finally {
      setExecutingAction(null)
    }
  }

  const handleCancel = async () => {
    setExecutingAction('cancel')
    try {
      await cancelSafeAddressChange()
    } catch (err) {
      console.error('cancelSafeAddressChange failed:', err)
    } finally {
      setExecutingAction(null)
    }
  }

  return (
    <div className="relative rounded overflow-hidden">
      <div className="absolute inset-0 rounded bg-gradient-to-b from-vault-warning/20 via-transparent to-transparent pointer-events-none" />

      <div className="card border-vault-warning/25 relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="font-body text-[10px] tracking-[0.2em] uppercase mb-1" style={{ color: '#f59e0b' }}>// Pending</p>
            <h3 className="font-display text-lg text-vault-text tracking-tight">Safe Address</h3>
            <p className="text-vault-muted text-[10px] font-body tracking-wider uppercase mt-0.5">
              Time-locked for security
            </p>
          </div>

          {isComplete ? (
            <span className="px-3 py-1 bg-vault-accent/10 border border-vault-accent/30 rounded text-vault-accent text-[10px] font-body tracking-wider uppercase">
              Ready
            </span>
          ) : (
            <span className="px-3 py-1 bg-vault-warning/10 border border-vault-warning/30 rounded text-vault-warning text-[10px] font-body tracking-wider uppercase animate-pulse">
              Locked
            </span>
          )}
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="space-y-1">
            <p className="text-vault-muted text-[10px] font-body tracking-[0.12em] uppercase">Date Requested</p>
            <p className="font-body text-xs text-vault-text-dim">{requestedDate}</p>
            <p className="font-body text-[11px] text-vault-muted">{requestedTime}</p>
          </div>
          <div className="space-y-1">
            <p className="text-vault-muted text-[10px] font-body tracking-[0.12em] uppercase">Unlocks In</p>
            <p className="font-display tabular-nums" style={{ fontSize: '1.8rem', letterSpacing: '-1px', color: isComplete ? 'var(--clr-accent-label)' : '#f59e0b' }}>
              {isComplete ? '00:00' : formatted}
            </p>
            <p className="font-body text-[11px] text-vault-muted">{isComplete ? 'Unlocked' : 'Remaining'}</p>
          </div>
        </div>

        {/* Pending address */}
        <div className="mb-5 p-3 bg-vault-surface border border-vault-border/50 rounded">
          <p className="text-vault-muted text-[10px] font-body tracking-[0.12em] uppercase mb-1">New Address</p>
          <p className="font-body text-xs text-vault-text-dim break-all">{pendingSafeAddress.address}</p>
        </div>

        {/* Progress bar */}
        <div className="mb-5">
          <div className="h-1 bg-vault-surface rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                isComplete ? 'bg-vault-accent w-full' : 'bg-gradient-to-r from-vault-warning to-vault-warning/60'
              }`}
              style={{
                width: isComplete ? '100%' : `${(secondsLeft / pendingSafeAddress.unlockDuration) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleConfirm}
            disabled={!isComplete || locked || executingAction === 'confirm'}
            className="btn-primary flex-1 flex items-center justify-center gap-2"
          >
            {executingAction === 'confirm' ? (
              <>
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.3" />
                  <path d="M12 2C6.48 2 2 6.48 2 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                Setting…
              </>
            ) : (
              <>
                {!isComplete && (
                  <svg className="w-3.5 h-3.5 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                )}
                Set Address
              </>
            )}
          </button>

          <button
            onClick={handleCancel}
            disabled={executingAction === 'cancel'}
            className="btn-danger flex-shrink-0 flex items-center justify-center gap-2"
          >
            {executingAction === 'cancel' ? (
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.3" />
                <path d="M12 2C6.48 2 2 6.48 2 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            ) : 'Cancel'}
          </button>
        </div>

        {(!isComplete || locked) && (
          <p className="text-vault-muted text-[10px] font-body mt-3 text-center">
            {locked
              ? '"Set Address" is unavailable while vault is emergency locked.'
              : '"Set Address" will unlock when the countdown reaches 00:00'
            }
          </p>
        )}
      </div>
    </div>
  )
}
