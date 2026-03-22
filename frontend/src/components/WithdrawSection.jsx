import React, { useState } from 'react'
import { useVault } from '../context/VaultContext.jsx'

export default function WithdrawSection({ disabled, emergencyLocked, postLockBlocked }) {
  const { withdraw, vaultBalance } = useVault()
  const [amount, setAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleWithdraw = async () => {
    if (!amount || parseFloat(amount) <= 0) return
    setIsLoading(true)
    await new Promise(r => setTimeout(r, 600))
    withdraw(amount)
    setAmount('')
    setIsLoading(false)
  }

  const numAmount = parseFloat(amount) || 0
  const isAboveLimit = numAmount > vaultBalance * 0.6 && numAmount > 0
  const isOverBalance = numAmount > vaultBalance

  return (
    <div className={`card h-full flex flex-col transition-opacity duration-300 ${disabled ? 'opacity-50' : ''}`}>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-vault-accent/10 flex items-center justify-center">
          <svg className="w-4 h-4 text-vault-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="19" x2="12" y2="5" />
            <polyline points="5 12 12 5 19 12" />
          </svg>
        </div>
        <h3 className="font-display font-600 text-sm text-vault-text tracking-wide">
          Withdraw MON
        </h3>
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

          {/* Warning messages */}
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

          {disabled && !emergencyLocked && !postLockBlocked && (
            <p className="text-vault-warning text-[11px] font-body px-1">
              Withdrawals disabled while a pending request exists.
            </p>
          )}

          {postLockBlocked && (
            <div className="flex items-start gap-2 px-3 py-2 bg-vault-danger-glow border border-vault-danger/20 rounded-lg">
              <svg className="w-3.5 h-3.5 text-vault-danger mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <p className="text-vault-danger text-[11px] font-body leading-relaxed">
                Withdrawals remain blocked after Emergency Lock expired.
              </p>
            </div>
          )}

          {emergencyLocked && (
            <div className="flex items-start gap-2 px-3 py-2 bg-vault-danger-glow border border-vault-danger/20 rounded-lg">
              <svg className="w-3.5 h-3.5 text-vault-danger mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <p className="text-vault-danger text-[11px] font-body leading-relaxed">
                Emergency Lock is active — all withdrawals are frozen.
              </p>
            </div>
          )}
        </div>

        <button
          onClick={handleWithdraw}
          disabled={disabled || !amount || numAmount <= 0 || isOverBalance || isLoading}
          className="btn-secondary w-full flex items-center justify-center gap-2"
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
