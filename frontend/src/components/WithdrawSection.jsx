import React, { useState } from 'react'
import { useVault } from '../context/VaultContext.jsx'
import { useCountdown } from '../hooks/useCountdown.js'

export default function WithdrawSection({ disabled, emergencyLocked, postLockBlocked }) {
  const { withdraw, vaultBalance, emergencyLock } = useVault()
  const [amount, setAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { formatted } = useCountdown(emergencyLock?.unlockTimestamp)

  const handleWithdraw = async () => {
    if (!amount || parseFloat(amount) <= 0) return
    setIsLoading(true)
    try {
      await withdraw(amount)
      setAmount('')
    } catch (err) {
      console.error('Withdraw failed:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const numAmount = parseFloat(amount) || 0
  const isAboveLimit = numAmount > vaultBalance * 0.6 && numAmount > 0
  const isOverBalance = numAmount > vaultBalance

  if (emergencyLocked) {
    return (
      <div className="card h-full flex flex-col justify-center items-center gap-3 pointer-events-none" style={{ opacity: 0.7 }}>
        <div style={{ width: 40, height: 40, borderRadius: 4, backgroundColor: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg style={{ width: 20, height: 20, color: '#ef4444' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <p style={{ color: '#ef4444', fontSize: 10, fontFamily: 'Space Mono', letterSpacing: '0.15em', textTransform: 'uppercase', textAlign: 'center', margin: 0 }}>
          // Withdrawals Frozen
        </p>
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          padding: '12px 24px', backgroundColor: 'var(--clr-deep)',
          border: '1px solid var(--clr-border-soft)', marginTop: 4,
        }}>
          <p style={{ color: 'var(--clr-muted)', fontSize: 10, fontFamily: 'Space Mono', letterSpacing: '0.15em', textTransform: 'uppercase', margin: 0, marginBottom: 4 }}>
            Unlocks In
          </p>
          <p style={{ color: '#ef4444', fontSize: 28, fontFamily: 'Archivo Black', letterSpacing: '0.05em', fontVariantNumeric: 'tabular-nums', margin: 0 }}>
            {formatted}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      className="card h-full flex flex-col transition-all duration-300"
      style={{ opacity: disabled ? 0.5 : 1, pointerEvents: disabled ? 'none' : 'auto' }}
    >
      <div className="mb-5">
        <p className="font-body text-[10px] tracking-[0.2em] uppercase mb-1" style={{ color: '#FF6B2B' }}>// Action</p>
        <h3 className="font-display text-lg text-vault-text tracking-tight">Withdraw MON</h3>
      </div>

      <div className="flex-1 flex flex-col justify-between gap-4">
        <div className="space-y-2">
          <div className="relative">
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={disabled}
              className={`input-field pr-14 ${isAboveLimit && !isOverBalance ? 'border-vault-warning/50' : ''} ${isOverBalance ? 'border-vault-danger/50' : ''}`}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-vault-muted text-xs font-body">
              MON
            </span>
          </div>

          {isAboveLimit && !isOverBalance && (
            <div className="flex items-start gap-2 px-3 py-2 bg-vault-warning-glow border border-vault-warning/20 rounded-lg">
              <svg className="w-3.5 h-3.5 text-vault-warning mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <p className="text-vault-warning text-[11px] font-body leading-relaxed">
                Exceeds 60% instant limit — this withdrawal will be time-locked.
              </p>
            </div>
          )}

          {isOverBalance && (
            <p className="text-vault-danger text-[11px] font-body px-1">
              Amount exceeds your vault balance.
            </p>
          )}

          {disabled && !postLockBlocked && (
            <p className="text-vault-warning text-[11px] font-body px-1">
              Withdrawals disabled while a pending request exists.
            </p>
          )}
        </div>

        <button
          onClick={handleWithdraw}
          disabled={disabled || !amount || numAmount <= 0 || isOverBalance || isLoading}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.3" />
                <path d="M12 2C6.48 2 2 6.48 2 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              Processing…
            </>
          ) : (
            'Withdraw'
          )}
        </button>
      </div>
    </div>
  )
}
