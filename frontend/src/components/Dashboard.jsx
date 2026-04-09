import React, { useState } from 'react'
import { useVault } from '../context/VaultContext.jsx'
import DepositSection from './DepositSection.jsx'
import WithdrawSection from './WithdrawSection.jsx'
import PendingCard from './PendingCard.jsx'
import EmergencyLockCard from './EmergencyLockCard.jsx'
import SafeAddressCard from './SafeAddressCard.jsx'
import PendingSafeAddressCard from './PendingSafeAddressCard.jsx'

/* ── SIDEBAR ICONS ──────────────────────────────────── */
function IconDashboard() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
    </svg>
  )
}
function IconLock() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}
function IconShield() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )
}


/* ── STAT CARD ──────────────────────────────────────── */
function StatCard({ label, children }) {
  return (
    <div style={{
      background: '#FFFFFF',
      border: '1px solid #E0DCD8',
      borderRadius: 4,
      padding: '18px 20px',
      flex: 1,
    }}>
      <p style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: '0.58rem',
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: '#A89880',
        marginBottom: 10,
      }}>
        {label}
      </p>
      {children}
    </div>
  )
}

/* ── OVERVIEW PAGE ──────────────────────────────────── */
function OverviewPage({ onNavigateEmergency }) {
  const {
    vaultBalance, instantWithdrawLimit, pendingWithdrawal,
    isEmergencyLocked, withdrawBlockedPostLock,
  } = useVault()
  const [activeAction, setActiveAction] = useState(null) // 'deposit' | 'withdraw'
  const hasPending = pendingWithdrawal !== null
  const locked = isEmergencyLocked()
  const thresholdPct = vaultBalance > 0 ? Math.min((instantWithdrawLimit / vaultBalance) * 100, 100) : 0

  const toggleAction = (action) => setActiveAction(prev => prev === action ? null : action)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Page title */}
      <div>
        <h1 style={{ fontFamily: 'Archivo Black', fontSize: '1.6rem', color: '#111111', letterSpacing: '-0.5px', margin: 0 }}>
          Vault Overview
        </h1>
        <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', color: '#A89880', marginTop: 4 }}>
          All values are simulated for demonstration
        </p>
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: 14 }}>
        <StatCard label="Vault Balance">
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 4 }}>
            <span style={{ fontFamily: 'Archivo Black', fontSize: '1.8rem', color: '#111111', letterSpacing: '-1px', lineHeight: 1 }}>
              {vaultBalance.toFixed(2)}
            </span>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.7rem', color: '#A89880', letterSpacing: '0.1em' }}>MON</span>
          </div>
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: '#A89880' }}>
            ≈ ${(vaultBalance * 2784).toFixed(2)} USD
          </p>
        </StatCard>

        <StatCard label="Instant Limit">
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 4 }}>
            <span style={{ fontFamily: 'Archivo Black', fontSize: '1.8rem', color: '#111111', letterSpacing: '-1px', lineHeight: 1 }}>
              {instantWithdrawLimit.toFixed(2)}
            </span>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.7rem', color: '#A89880', letterSpacing: '0.1em' }}>MON</span>
          </div>
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: '#A89880' }}>
            {thresholdPct.toFixed(0)}% of balance
          </p>
        </StatCard>

        <StatCard label="Vault Status">
          {locked ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} />
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.75rem', color: '#ef4444', letterSpacing: '0.08em' }}>Locked</span>
              </div>
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: '#A89880' }}>Emergency lock active</p>
            </>
          ) : hasPending ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }} />
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.75rem', color: '#f59e0b', letterSpacing: '0.08em' }}>Pending</span>
              </div>
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: '#A89880' }}>Withdrawal in queue</p>
            </>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#697f42', display: 'inline-block' }} />
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.75rem', color: '#697f42', letterSpacing: '0.08em' }}>Safe</span>
              </div>
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: '#A89880' }}>No active restrictions</p>
            </>
          )}
        </StatCard>
      </div>

      {/* Quick Actions */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid #E0DCD8',
        borderRadius: 4,
        padding: '18px 20px',
      }}>
        <p style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: '0.58rem',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: '#A89880',
          marginBottom: 14,
        }}>
          Quick Actions
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          {/* Deposit */}
          <button
            onClick={() => toggleAction('deposit')}
            style={{
              flex: 1, padding: '11px 0',
              border: activeAction === 'deposit' ? '1.5px solid #697f42' : '1.5px solid #E0DCD8',
              borderRadius: 4,
              background: activeAction === 'deposit' ? 'rgba(105,127,66,0.06)' : 'transparent',
              color: activeAction === 'deposit' ? '#697f42' : '#444444',
              fontFamily: "'Space Mono', monospace",
              fontSize: '0.72rem',
              letterSpacing: '0.08em',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
              transition: 'all 0.15s',
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Deposit
          </button>

          {/* Withdraw */}
          <button
            onClick={() => toggleAction('withdraw')}
            disabled={hasPending || locked || withdrawBlockedPostLock}
            style={{
              flex: 1, padding: '11px 0',
              border: activeAction === 'withdraw' ? '1.5px solid #697f42' : '1.5px solid #E0DCD8',
              borderRadius: 4,
              background: activeAction === 'withdraw' ? 'rgba(105,127,66,0.06)' : 'transparent',
              color: activeAction === 'withdraw' ? '#697f42' : '#444444',
              fontFamily: "'Space Mono', monospace",
              fontSize: '0.72rem',
              letterSpacing: '0.08em',
              cursor: hasPending || locked || withdrawBlockedPostLock ? 'not-allowed' : 'pointer',
              opacity: hasPending || locked || withdrawBlockedPostLock ? 0.45 : 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
              transition: 'all 0.15s',
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" /><polyline points="5 12 12 19 19 12" />
            </svg>
            Withdraw
          </button>

          {/* Emergency Lock */}
          <button
            onClick={onNavigateEmergency}
            style={{
              flex: 1, padding: '11px 0',
              border: '1.5px solid rgba(239,68,68,0.35)',
              borderRadius: 4,
              background: locked ? 'rgba(239,68,68,0.08)' : 'transparent',
              color: '#ef4444',
              fontFamily: "'Space Mono', monospace",
              fontSize: '0.72rem',
              letterSpacing: '0.08em',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
              transition: 'all 0.15s',
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            {locked ? 'Locked' : 'Emergency Lock'}
          </button>
        </div>

      </div>

      {/* Expandable action forms — shown below Quick Actions */}
      {activeAction === 'deposit' && (
        <div className="animate-fade-up" style={{ animationDelay: '0.05s', opacity: 0 }}>
          <DepositSection />
        </div>
      )}
      {activeAction === 'withdraw' && (
        <div className="animate-fade-up" style={{ animationDelay: '0.05s', opacity: 0 }}>
          <WithdrawSection
            disabled={hasPending || locked || withdrawBlockedPostLock}
            emergencyLocked={locked}
            postLockBlocked={withdrawBlockedPostLock}
          />
        </div>
      )}

      {/* Pending withdrawal card */}
      {hasPending && !locked && (
        <div className="animate-fade-up">
          <PendingCard />
        </div>
      )}
    </div>
  )
}

/* ── EMERGENCY LOCK PAGE ────────────────────────────── */
function EmergencyPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h1 style={{ fontFamily: 'Archivo Black', fontSize: '1.6rem', color: '#111111', letterSpacing: '-0.5px', margin: 0 }}>
          Emergency Lock
        </h1>
        <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', color: '#A89880', marginTop: 4 }}>
          Freeze all vault withdrawals immediately
        </p>
      </div>
      <EmergencyLockCard />
    </div>
  )
}

/* ── SAFE ADDRESS PAGE ──────────────────────────────── */
function SafeAddressPage() {
  const { pendingSafeAddress } = useVault()
  const hasPendingSafe = pendingSafeAddress !== null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h1 style={{ fontFamily: 'Archivo Black', fontSize: '1.6rem', color: '#111111', letterSpacing: '-0.5px', margin: 0 }}>
          Safe Address
        </h1>
        <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', color: '#A89880', marginTop: 4 }}>
          Designate a recovery address for emergency withdrawals
        </p>
      </div>

      {hasPendingSafe && (
        <div className="animate-fade-up">
          <PendingSafeAddressCard />
        </div>
      )}

      <SafeAddressCard />
    </div>
  )
}

/* ── NAV CARD ───────────────────────────────────────── */
function NavCard({ icon: Icon, label, description, active, onClick, badge }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        minWidth: 160,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        padding: '14px 18px',
        borderRadius: 4,
        border: active ? '2px solid #697f42' : '1.5px solid #E0DCD8',
        background: active ? 'rgba(105,127,66,0.07)' : '#FFFFFF',
        color: active ? '#697f42' : '#888888',
        fontFamily: "'Space Mono', monospace",
        fontSize: '0.72rem',
        letterSpacing: '0.08em',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'all 0.2s',
        position: 'relative',
        boxShadow: active ? '0 4px 16px rgba(105,127,66,0.12)' : '0 1px 4px rgba(0,0,0,0.04)',
      }}
      onMouseEnter={e => { if (!active) { e.currentTarget.style.borderColor = '#697f42'; e.currentTarget.style.color = '#697f42'; e.currentTarget.style.background = 'rgba(105,127,66,0.04)' } }}
      onMouseLeave={e => { if (!active) { e.currentTarget.style.borderColor = '#E0DCD8'; e.currentTarget.style.color = '#888888'; e.currentTarget.style.background = '#FFFFFF' } }}
    >
      {badge && (
        <span style={{
          position: 'absolute',
          top: 10, right: 10,
          width: 7, height: 7, borderRadius: '50%',
          background: '#ef4444',
          animation: 'pulse 2s infinite',
        }} />
      )}
      <span style={{
        width: 34, height: 34, borderRadius: 4, flexShrink: 0,
        background: active ? 'rgba(105,127,66,0.15)' : 'rgba(160,120,80,0.08)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: active ? '#697f42' : '#A89880',
      }}>
        <Icon />
      </span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span style={{ fontFamily: 'Archivo Black', fontSize: '0.8rem', color: active ? '#697f42' : '#333333', letterSpacing: '0.02em' }}>
          {label}
        </span>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.56rem', color: '#A89880', letterSpacing: '0.04em' }}>
          {description}
        </span>
      </div>
    </button>
  )
}

/* ── MAIN DASHBOARD ─────────────────────────────────── */
export default function Dashboard({ onGoHome }) {
  const [activeTab, setActiveTab] = useState('overview')
  const {
    isEmergencyLocked,
    walletAddress,
    isConnected,
    connectWallet,
    disconnectWallet,
  } = useVault()
  const locked = isEmergencyLocked()

  return (
    <div style={{ minHeight: '100vh', background: '#F5F0EB', position: 'relative' }}>
      {/* ── TOP NAV (igual landing page) ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '16px 28px',
        background: 'rgba(245,240,235,0.90)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(160,120,80,0.15)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }} onClick={onGoHome}>
          <img src="/logo.svg" alt="LockFi" style={{ height: 'clamp(26px, 3.5vw, 34px)', width: 'auto' }} />
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#A89880' }}>
            Secure Withdrawal Protocol
          </span>
        </div>
        {isConnected ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'linear-gradient(135deg, #697f42, #ec632c)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.62rem', color: '#444444', letterSpacing: '0.02em' }}>My Vault</span>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: '#A89880', letterSpacing: '0.02em' }}>{walletAddress}</span>
            </div>
            <button
              onClick={disconnectWallet}
              title="Disconnect"
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#A89880', padding: 4, marginLeft: 4,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
              onMouseLeave={e => e.currentTarget.style.color = '#A89880'}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </div>
        ) : (
          <button
            onClick={connectWallet}
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '0.7rem',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              padding: '9px 20px',
              background: '#697f42',
              color: '#F5F0EB',
              border: '1.5px solid #697f42',
              cursor: 'pointer',
              borderRadius: 4,
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#4e6030'; e.currentTarget.style.borderColor = '#4e6030' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#697f42'; e.currentTarget.style.borderColor = '#697f42' }}
          >
            Connect Wallet
          </button>
        )}
      </nav>

      {/* ── PAGE CONTENT ── */}
      <div style={{ position: 'relative', zIndex: 1, paddingTop: 80 }}>

        {/* ── NAV CARDS GROUP (centered below header) ── */}
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '40px 24px 32px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'stretch',
          alignItems: 'stretch',
          gap: 20,
          flexWrap: 'wrap',
        }}>
          <NavCard
            icon={IconDashboard}
            label="Dashboard"
            description="Vault overview & actions"
            active={activeTab === 'overview'}
            onClick={() => setActiveTab('overview')}
          />
          <NavCard
            icon={IconLock}
            label="Emergency Lock"
            description="Freeze all withdrawals"
            active={activeTab === 'emergency'}
            onClick={() => setActiveTab('emergency')}
            badge={locked}
          />
          <NavCard
            icon={IconShield}
            label="Safe Address"
            description="Recovery wallet setup"
            active={activeTab === 'safe'}
            onClick={() => setActiveTab('safe')}
          />
        </div>
        </div>

        {/* ── MAIN CONTENT ── */}
        <main style={{ padding: '0 24px 100px', maxWidth: 860, margin: '0 auto' }}>
          {activeTab === 'overview' && (
            <OverviewPage onNavigateEmergency={() => setActiveTab('emergency')} />
          )}
          {activeTab === 'emergency' && <EmergencyPage />}
          {activeTab === 'safe' && <SafeAddressPage />}
        </main>
      </div>

      {/* ── FOOTER ── */}
      <footer style={{
        position: 'fixed',
        bottom: 0, left: 0, right: 0,
        borderTop: '1px solid rgba(160,120,80,0.15)',
        padding: '12px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 12,
        background: 'rgba(245,240,235,0.97)',
        backdropFilter: 'blur(12px)',
        zIndex: 40,
      }}>
        <span style={{ fontSize: '0.6rem', letterSpacing: '2px', color: '#A89880', textTransform: 'uppercase', fontFamily: "'Space Mono', monospace" }}>
          © 2026 LockFi Protocol
        </span>
        <span style={{ color: '#ec632c', fontSize: '0.65rem', letterSpacing: '3px', fontFamily: "'Space Mono', monospace" }}>
          ◆ Built on Monad
        </span>
        <span style={{ fontSize: '0.6rem', letterSpacing: '2px', color: '#A89880', textTransform: 'uppercase', fontFamily: "'Space Mono', monospace" }}>
          <a href="https://x.com/letiweb3" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>Leticia Azevedo</a>
          {' & '}
          <a href="https://x.com/shaianeviana" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>Shaiane Viana</a>
        </span>
      </footer>
    </div>
  )
}
