import React, { useState } from 'react'
import { useVault } from '../context/VaultContext.jsx'
import { useCountdown } from '../hooks/useCountdown.js'

export default function PendingCard() {
  const { pendingWithdrawal, executeWithdraw, cancelWithdraw } = useVault()
  const { formatted, isComplete, secondsLeft } = useCountdown(pendingWithdrawal?.unlockTimestamp)
  const [executingAction, setExecutingAction] = useState(null) // 'execute' | 'cancel'

  if (!pendingWithdrawal) return null

  const requestedDate = pendingWithdrawal.requestedAt.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  const requestedTime = pendingWithdrawal.requestedAt.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })

  const handleExecute = async () => {
    if (!isComplete) return
    setExecutingAction('execute')
    try {
      await executeWithdraw()
    } catch (err) {
      console.error('Execute withdraw failed:', err)
    } finally {
      setExecutingAction(null)
    }
  }

  const handleCancel = async () => {
    setExecutingAction('cancel')
    try {
      await cancelWithdraw()
    } catch (err) {
      console.error('Cancel withdraw failed:', err)
    } finally {
      setExecutingAction(null)
    }
  }

  return (
    <div className="relative rounded-2xl overflow-hidden">
      {/* Warning border glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-vault-warning/20 via-transparent to-transparent pointer-events-none" />

      <div className="card border-vault-warning/25 relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-vault-warning/10 flex items-center justify-center">
              <svg className="w-4 h-4 text-vault-warning" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div>
              <h3 className="font-display font-600 text-sm text-vault-text tracking-wide">
                Pending Withdrawal
              </h3>
              <p className="text-vault-muted text-[10px] font-body tracking-wider uppercase mt-0.5">
                Time-locked for security
              </p>
            </div>
          </div>

          {/* Status badge */}
          {isComplete ? (
            <span className="px-3 py-1 bg-vault-accent/10 border border-vault-accent/30 rounded-full text-vault-accent text-[10px] font-body tracking-wider uppercase">
              Ready
            </span>
          ) : (
            <span className="px-3 py-1 bg-vault-warning/10 border border-vault-warning/30 rounded-full text-vault-warning text-[10px] font-body tracking-wider uppercase animate-pulse">
              Locked
            </span>
          )}
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {/* Date */}
          <div className="space-y-1">
            <p className="text-vault-muted text-[10px] font-body tracking-[0.12em] uppercase">
              Date Requested
            </p>
            <p className="font-body text-xs text-vault-text-dim">
              {requestedDate}
            </p>
            <p className="font-body text-[11px] text-vault-muted">
              {requestedTime}
            </p>
          </div>

          {/* Amount */}
          <div className="space-y-1">
            <p className="text-vault-muted text-[10px] font-body tracking-[0.12em] uppercase">
              Amount
            </p>
            <p className="font-display font-700 text-xl text-vault-text tabular-nums">
              {pendingWithdrawal.amount.toFixed(2)}
            </p>
            <p className="font-body text-[11px] text-vault-accent">MON</p>
          </div>

          {/* Timer */}
          <div className="space-y-1">
            <p className="text-vault-muted text-[10px] font-body tracking-[0.12em] uppercase">
              Unlocks In
            </p>
            <p className={`font-display font-700 text-xl tabular-nums ${
              isComplete ? 'text-vault-accent' : 'text-vault-warning'
            }`}>
              {isComplete ? '00:00' : formatted}
            </p>
            <p className="font-body text-[11px] text-vault-muted">
              {isComplete ? 'Unlocked' : 'Remaining'}
            </p>
          </div>
        </div>

        {/* Timer progress bar */}
        <div className="mb-6">
          <div className="h-1 bg-vault-surface rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                isComplete
                  ? 'bg-vault-accent w-full'
                  : 'bg-gradient-to-r from-vault-warning to-vault-warning/60'
              }`}
              style={{
                width: isComplete
                  ? '100%'
                  : `${(secondsLeft / pendingWithdrawal.unlockDuration) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleExecute}
            disabled={!isComplete || executingAction === 'execute'}
            className="btn-primary flex-1 flex items-center justify-center gap-2"
          >
            {executingAction === 'execute' ? (
              <>
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.3" />
                  <path d="M12 2C6.48 2 2 6.48 2 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                Executing…
              </>
            ) : (
              <>
                {!isComplete && (
                  <svg className="w-3.5 h-3.5 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                )}
                Execute Withdrawal
              </>
            )}
          </button>

          <button
            onClick={handleCancel}
            disabled={executingAction === 'cancel'}
            className="btn-danger flex-shrink-0 flex items-center justify-center gap-2"
          >
            {executingAction === 'cancel' ? (
              <>
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.3" />
                  <path d="M12 2C6.48 2 2 6.48 2 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </>
            ) : (
              'Cancel'
            )}
          </button>
        </div>

        {/* Helper text */}
        {!isComplete && (
          <p className="text-vault-muted text-[10px] font-body mt-3 text-center">
            Execute button will unlock when the countdown reaches 00:00
          </p>
        )}
      </div>
    </div>
  )
}
