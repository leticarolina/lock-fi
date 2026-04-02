import React from 'react'
import { useVault } from '../context/VaultContext.jsx'
import { useTheme } from '../context/ThemeContext.jsx'

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

export default function Header({ onGoHome }) {
  const { walletAddress, disconnectWallet, connectWallet, isConnected } = useVault()
  const { theme, toggleTheme } = useTheme()

  return (
    <header
      className="border-b border-vault-border/60 backdrop-blur-xl sticky top-0 z-50"
      style={{ background: 'var(--clr-nav-bg)', transition: 'background 0.25s ease' }}
    >
      <div className="w-full px-4 sm:px-10 h-16 flex items-center justify-between gap-3">
        {/* Logo + tag */}
        <div className="flex items-center gap-3 min-w-0">
          <img
            src="/logo_nova.svg"
            alt="LockFi"
            className="h-8 sm:h-9 w-auto cursor-pointer flex-shrink-0"
            onClick={onGoHome}
            style={{  }}
          />
          <span className="hidden md:block font-body text-[10px] tracking-[0.3em] uppercase truncate" style={{ color: 'var(--clr-muted)' }}>
            Secure Withdrawal Protocol
          </span>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-vault-border transition-all duration-200 hover:border-vault-accent/40"
            style={{ color: 'var(--clr-muted)', background: 'transparent' }}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>

          {isConnected ? (
            <>
              {/* Address badge */}
              <div
                className="hidden sm:flex items-center gap-2 rounded-lg px-3 py-1.5 border"
                style={{ background: 'var(--clr-deep)', borderColor: 'var(--clr-border-soft)' }}
              >
                <span className="w-2 h-2 rounded-full bg-vault-accent animate-pulse flex-shrink-0" />
                <span className="font-body text-xs tracking-wide" style={{ color: 'var(--clr-text-dim)' }}>
                  {walletAddress}
                </span>
              </div>
              {/* Mobile: just the dot */}
              <span className="sm:hidden w-2 h-2 rounded-full bg-vault-accent animate-pulse" />

              {/* Disconnect */}
              <button
                onClick={disconnectWallet}
                className="p-2 rounded-lg border border-vault-border hover:border-vault-danger/40 hover:text-vault-danger transition-all duration-200"
                style={{ color: 'var(--clr-muted)' }}
                title="Disconnect Wallet"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </button>
            </>
          ) : (
            <button onClick={connectWallet} className="btn-primary text-xs px-4 py-2">
              Connect
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
