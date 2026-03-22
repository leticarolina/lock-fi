import React from 'react'
import { useVault } from '../context/VaultContext.jsx'

export default function VaultInfo() {
  const { vaultBalance, instantWithdrawLimit, pendingWithdrawal, isEmergencyLocked } = useVault()
  const locked = isEmergencyLocked()

  return (
    <div className="card relative overflow-hidden">
      {/* Subtle accent glow top-left */}
      <div className="absolute -top-16 -left-16 w-40 h-40 bg-vault-accent/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        {/* Balance */}
        <div className="space-y-1">
          <p className="text-vault-muted text-[11px] font-body tracking-[0.15em] uppercase">
            Vault Balance
          </p>
          <div className="flex items-baseline gap-2">
            <span className="font-display font-700 text-4xl text-vault-text tabular-nums">
              {vaultBalance.toFixed(2)}
            </span>
            <span className="font-body text-sm text-vault-accent tracking-wider">MON</span>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-6">
          {/* Instant limit */}
          <div className="space-y-1">
            <p className="text-vault-muted text-[10px] font-body tracking-[0.15em] uppercase">
              Instant Limit
            </p>
            <p className="font-body text-lg text-vault-text-dim tabular-nums">
              {instantWithdrawLimit.toFixed(2)} <span className="text-xs text-vault-muted">MON</span>
            </p>
          </div>

          {/* Status indicator */}
          <div className="space-y-1">
            <p className="text-vault-muted text-[10px] font-body tracking-[0.15em] uppercase">
              Status
            </p>
            {locked ? (
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-vault-danger animate-pulse" />
                <span className="font-body text-xs text-vault-danger tracking-wide uppercase">
                  Locked
                </span>
              </div>
            ) : pendingWithdrawal ? (
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-vault-warning animate-pulse" />
                <span className="font-body text-xs text-vault-warning tracking-wide uppercase">
                  Pending
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-vault-accent" />
                <span className="font-body text-xs text-vault-accent tracking-wide uppercase">
                  Secure
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Progress bar showing instant limit ratio */}
      <div className="mt-5 space-y-1.5">
        <div className="flex justify-between text-[10px] font-body text-vault-muted tracking-wider uppercase">
          <span>0%</span>
          <span>Instant Threshold — 60%</span>
          <span>100%</span>
        </div>
        <div className="h-1.5 bg-vault-surface rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-vault-accent to-vault-accent-dim transition-all duration-700"
            style={{ width: '60%' }}
          />
        </div>
      </div>
    </div>
  )
}
