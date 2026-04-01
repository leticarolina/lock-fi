import React from 'react'
import { useVault } from '../context/VaultContext.jsx'
import ShieldIcon from './ShieldIcon.jsx'

export default function Header({ onGoHome }) {
  const { walletAddress, disconnectWallet, connectWallet, isConnected } = useVault()


  return (
    <header className="border-b border-vault-border/60 backdrop-blur-xl sticky top-0 z-50" style={{ background: 'rgba(10,10,10,0.85)' }}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <img src="/logo_nova.svg" alt="LockFi" className="h-9 w-auto cursor-pointer flex-shrink-0" onClick={onGoHome} />

        {/* Center tag */}
        <span className="hidden sm:block font-body text-[10px] tracking-[0.3em] uppercase flex-1 text-center" style={{ color: '#888' }}>
          Secure Withdrawal Protocol
        </span>

        {/* Wallet info */}
        <div className="flex items-center gap-3">
          {isConnected ? (
            <>
              {/* Address badge */}
              <div className="flex items-center gap-2 bg-vault-surface border border-vault-border rounded-lg px-3 py-1.5">
                <span className="w-2 h-2 rounded-full bg-vault-accent animate-pulse" />
                <span className="font-body text-xs text-vault-text-dim tracking-wide">
                  {walletAddress}
                </span>
              </div>

              {/* Disconnect */}
              <button
                onClick={disconnectWallet}
                className="p-2 rounded-lg border border-vault-border text-vault-muted
                           hover:border-vault-danger/40 hover:text-vault-danger
                           transition-all duration-200"
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
            <button
              onClick={connectWallet}
              className="btn-primary text-xs px-4 py-2"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
