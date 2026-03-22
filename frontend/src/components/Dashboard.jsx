import React from 'react'
import { useVault } from '../context/VaultContext.jsx'
import Header from './Header.jsx'
import VaultInfo from './VaultInfo.jsx'
import DepositSection from './DepositSection.jsx'
import WithdrawSection from './WithdrawSection.jsx'
import PendingCard from './PendingCard.jsx'
import EmergencyLockCard from './EmergencyLockCard.jsx'

export default function Dashboard() {
  const { pendingWithdrawal, isEmergencyLocked, withdrawBlockedPostLock } = useVault()
  const hasPending = pendingWithdrawal !== null
  const locked = isEmergencyLocked()

  return (
    <div className="min-h-screen pb-12">
      <Header />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 pt-8 space-y-6">
        {/* Vault balance info */}
        <div className="animate-fade-up" style={{ animationDelay: '0.05s', opacity: 0 }}>
          <VaultInfo />
        </div>

        {/* Pending withdrawal card — Mode B */}
        {hasPending && !locked && (
          <div className="animate-fade-up" style={{ animationDelay: '0.1s', opacity: 0 }}>
            <PendingCard />
          </div>
        )}

        {/* Action sections */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="animate-fade-up" style={{ animationDelay: '0.15s', opacity: 0 }}>
            <DepositSection />
          </div>
          <div className="animate-fade-up" style={{ animationDelay: '0.25s', opacity: 0 }}>
            <WithdrawSection disabled={hasPending || locked || withdrawBlockedPostLock} emergencyLocked={locked} postLockBlocked={withdrawBlockedPostLock} />
          </div>
        </div>

        {/* Emergency Lock section */}
        <div className="animate-fade-up" style={{ animationDelay: '0.35s', opacity: 0 }}>
          <EmergencyLockCard />
        </div>

        {/* Protocol info footer */}
        <div className="animate-fade-up" style={{ animationDelay: '0.4s', opacity: 0 }}>
          <div className="text-center pt-4 space-y-2">
            <div className="flex items-center justify-center gap-3 text-vault-muted/50 text-[10px] font-body tracking-widest uppercase">
              <span className="w-12 h-px bg-vault-border/40" />
              Protocol Rules
              <span className="w-12 h-px bg-vault-border/40" />
            </div>
            <p className="text-vault-muted/60 text-[11px] font-body leading-relaxed max-w-md mx-auto">
              Withdrawals above 60% of your balance are flagged as high-risk and require a time-locked
              delay before execution. Emergency Lock freezes all withdrawals instantly for 24 hours.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
