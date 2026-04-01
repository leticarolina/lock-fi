import React from 'react'
import { useVault } from '../context/VaultContext.jsx'
import Header from './Header.jsx'
import VaultInfo from './VaultInfo.jsx'
import DepositSection from './DepositSection.jsx'
import WithdrawSection from './WithdrawSection.jsx'
import PendingCard from './PendingCard.jsx'
import EmergencyLockCard from './EmergencyLockCard.jsx'
import SafeAddressCard from './SafeAddressCard.jsx'
import PendingSafeAddressCard from './PendingSafeAddressCard.jsx'

export default function Dashboard({ onGoHome }) {
  const { pendingWithdrawal, isEmergencyLocked, withdrawBlockedPostLock, pendingSafeAddress } = useVault()
  const hasPending = pendingWithdrawal !== null
  const locked = isEmergencyLocked()
  const hasPendingSafe = pendingSafeAddress !== null

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

        {/* Pending safe address card */}
        {hasPendingSafe && (
          <div className="animate-fade-up" style={{ animationDelay: '0.4s', opacity: 0 }}>
            <PendingSafeAddressCard />
          </div>
        )}

        {/* Safe Address section */}
        <div className="animate-fade-up" style={{ animationDelay: '0.45s', opacity: 0 }}>
          <SafeAddressCard />
        </div>

        {/* Footer */}
        <footer className="animate-fade-up" style={{
          animationDelay: '0.55s', opacity: 0,
          borderTop: '1px solid #222',
          marginTop: 16,
          padding: '20px 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
        }}>
          <span style={{ fontSize: '0.6rem', letterSpacing: '2px', color: '#555', textTransform: 'uppercase', fontFamily: "'Space Mono', monospace" }}>
            © 2026 LockFi Protocol
          </span>
          <span style={{ color: '#CAFF00', fontSize: '0.65rem', letterSpacing: '3px', fontFamily: "'Space Mono', monospace" }}>
            ◆ Built on Monad
          </span>
          <span style={{ fontSize: '0.6rem', letterSpacing: '2px', color: '#555', textTransform: 'uppercase', fontFamily: "'Space Mono', monospace" }}>
            Leticia Azevedo &amp; Shaiane Viana
          </span>
        </footer>
      </main>
    </div>
  )
}
