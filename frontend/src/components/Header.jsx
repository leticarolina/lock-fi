import React from 'react'
import { useVault } from '../context/VaultContext.jsx'

const headerBtnBase = {
  fontFamily: "'Space Mono', monospace",
  fontSize: '0.7rem',
  letterSpacing: '1.5px',
  textTransform: 'uppercase',
  padding: '9px 20px',
  borderRadius: '4px',
  cursor: 'pointer',
  transition: 'all 0.2s',
  whiteSpace: 'nowrap',
}

const outlineBtn = {
  ...headerBtnBase,
  border: '1.5px solid #697f42',
  background: 'transparent',
  color: '#697f42',
}

const filledBtn = {
  ...headerBtnBase,
  border: '1.5px solid #697f42',
  background: '#697f42',
  color: '#F5F0EB',
}

export default function Header({ onGoHome }) {
  const { walletAddress, disconnectWallet, connectWallet, isConnected } = useVault()

  return (
    <header style={{
      borderBottom: '1px solid rgba(160,120,80,0.15)',
      backdropFilter: 'blur(16px)',
      background: 'rgba(245,240,235,0.90)',
      position: 'sticky', top: 0, zIndex: 50,
    }}>
      <div style={{ width: '100%', padding: '0 40px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img
            src="/logo.svg"
            alt="LockFi"
            style={{ height: 32, width: 'auto', cursor: 'pointer' }}
            onClick={onGoHome}
          />
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#A89880' }}>
            Secure Withdrawal Protocol
          </span>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {isConnected ? (
            <>
              {/* Address badge */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                borderRadius: 4, padding: '6px 14px',
                border: '1.5px solid #D5D0CC',
                background: '#F0EDE8',
              }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#8BC34A', flexShrink: 0 }} />
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.68rem', color: '#6A6055', letterSpacing: '0.5px' }}>
                  {walletAddress}
                </span>
              </div>

              {/* Disconnect */}
              <button
                onClick={disconnectWallet}
                title="Disconnect Wallet"
                style={{
                  ...outlineBtn,
                  padding: '9px 14px',
                  borderColor: '#D5D0CC',
                  color: '#6A6055',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#C0392B'; e.currentTarget.style.color = '#C0392B' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#D5D0CC'; e.currentTarget.style.color = '#6A6055' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </button>
            </>
          ) : (
            <button
              onClick={connectWallet}
              style={filledBtn}
              onMouseEnter={e => { e.currentTarget.style.background = '#ec632c'; e.currentTarget.style.borderColor = '#ec632c' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#697f42'; e.currentTarget.style.borderColor = '#697f42' }}
            >
              Connect
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
