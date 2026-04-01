import React from 'react'
import { useVault } from '../context/VaultContext.jsx'

export default function VaultInfo() {
  const { vaultBalance, instantWithdrawLimit, pendingWithdrawal, isEmergencyLocked } = useVault()
  const locked = isEmergencyLocked()

  return (
    <div className="card relative overflow-hidden">
      {/* Corner accent */}
      <div className="absolute top-0 right-0 w-32 h-32 pointer-events-none"
        style={{ background: 'radial-gradient(circle at top right, rgba(255,107,43,0.06), transparent 70%)' }} />

      <div className="relative">
        {/* Section label */}
        <p className="font-body text-[10px] tracking-[0.2em] uppercase mb-3" style={{ color: '#FF6B2B' }}>
          // Vault Balance
        </p>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          {/* Big balance */}
          <div>
            <div className="flex items-baseline gap-3">
              <span className="font-display tabular-nums" style={{ fontSize: 'clamp(2.8rem, 8vw, 4.5rem)', lineHeight: 1, color: '#E8E8E8', letterSpacing: '-2px' }}>
                {vaultBalance.toFixed(2)}
              </span>
              <span className="font-body text-sm tracking-widest uppercase" style={{ color: '#CAFF00' }}>MON</span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-8">
            <div>
              <p className="font-body text-[10px] tracking-[0.15em] uppercase mb-1" style={{ color: '#888' }}>
                Instant Limit
              </p>
              <p className="font-display text-xl tabular-nums" style={{ color: '#ccc', letterSpacing: '-1px' }}>
                {instantWithdrawLimit.toFixed(2)}
                <span className="font-body text-xs ml-1" style={{ color: '#888' }}>MON</span>
              </p>
            </div>

            <div>
              <p className="font-body text-[10px] tracking-[0.15em] uppercase mb-1" style={{ color: '#888' }}>
                Status
              </p>
              {locked ? (
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#ef4444' }} />
                  <span className="font-body text-xs tracking-widest uppercase" style={{ color: '#ef4444' }}>Locked</span>
                </div>
              ) : pendingWithdrawal ? (
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#f59e0b' }} />
                  <span className="font-body text-xs tracking-widest uppercase" style={{ color: '#f59e0b' }}>Pending</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#CAFF00' }} />
                  <span className="font-body text-xs tracking-widest uppercase" style={{ color: '#CAFF00' }}>Secure</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-6 space-y-2">
          {(() => {
            const thresholdPct = vaultBalance > 0 ? Math.min((instantWithdrawLimit / vaultBalance) * 100, 100) : 0
            return (
              <>
                <div className="flex justify-between font-body text-[10px] tracking-widest uppercase" style={{ color: '#666' }}>
                  <span>0%</span>
                  <span>Instant Threshold — {thresholdPct.toFixed(0)}%</span>
                  <span>100%</span>
                </div>
                <div className="h-px w-full" style={{ background: '#1a1a1a' }}>
                  <div className="h-full transition-all duration-700" style={{ width: `${thresholdPct}%`, background: 'linear-gradient(90deg, #FF6B2B, #CAFF00)' }} />
                </div>
              </>
            )
          })()}
        </div>
      </div>
    </div>
  )
}
