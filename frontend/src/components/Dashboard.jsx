import React from 'react'
import { useVault } from '../context/VaultContext.jsx'
import Header from './Header.jsx'
import VaultInfo from './VaultInfo.jsx'
import DepositSection from './DepositSection.jsx'
import WithdrawSection from './WithdrawSection.jsx'
import PendingCard from './PendingCard.jsx'
import EmergencyLockCard from './EmergencyLockCard.jsx'

export default function Dashboard({ onGoHome }) {
  const { pendingWithdrawal, isEmergencyLocked, withdrawBlockedPostLock } = useVault()
  const hasPending = pendingWithdrawal !== null
  const locked = isEmergencyLocked()

  return (
    <div className="min-h-screen pb-12">
      <Header onGoHome={onGoHome} />

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

        {/* Footer */}
        <div className="animate-fade-up text-center pt-4 space-y-1" style={{ animationDelay: '0.4s', opacity: 0 }}>
          <p className="text-vault-muted/40 text-[10px] font-body tracking-widest uppercase">
            Monad Testnet
          </p>
          <p className="text-vault-muted/40 text-[10px] font-body tracking-widest uppercase">
            Created by Leticia Azevedo and Shaiane Viana
          </p>
        </div>
      </main>
    </div>
  )
}
