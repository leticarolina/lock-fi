import React, { useState } from 'react'
import { useVault } from '../context/VaultContext.jsx'
import ShieldIcon from './ShieldIcon.jsx'

export default function LandingScreen() {
  const { connectWallet } = useVault()
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnect = async () => {
    setIsConnecting(true)
    try {
      await connectWallet()
    } finally {
      setIsConnecting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      {/* Main content */}
      <div className="max-w-lg w-full text-center space-y-8">
        {/* Shield icon */}
        <div className="flex justify-center">
          <div className="relative animate-float">
            <div className="absolute inset-0 bg-vault-accent/20 rounded-full blur-3xl scale-150" />
            <ShieldIcon
              size={72}
              className="relative text-vault-accent drop-shadow-[0_0_24px_rgba(0,229,160,0.4)]"
            />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-3 animate-fade-up" style={{ animationDelay: '0.1s', opacity: 0 }}>
          <h1 className="font-display font-800 text-5xl sm:text-6xl tracking-tight text-vault-text leading-none">
            Lock<span className="text-vault-accent">Fi</span>
          </h1>
          <div className="flex items-center justify-center gap-2 text-vault-muted font-body text-xs tracking-[0.2em] uppercase">
            <span className="w-8 h-px bg-vault-border" />
            Secure Withdrawal Protocol
            <span className="w-8 h-px bg-vault-border" />
          </div>
        </div>

        {/* Description */}
        <p
          className="font-body text-sm text-vault-text-dim leading-relaxed max-w-sm mx-auto animate-fade-up"
          style={{ animationDelay: '0.25s', opacity: 0 }}
        >
          Delay suspicious withdrawals and protect your funds.
          <br />
          <span className="text-vault-muted text-xs">
            On-chain risk detection with time-locked execution.
          </span>
        </p>

        {/* Connect button */}
        <div className="animate-fade-up" style={{ animationDelay: '0.4s', opacity: 0 }}>
          <button
            onClick={handleConnect}
            disabled={isConnecting}
            className="group relative inline-flex items-center gap-3 btn-primary text-base px-10 py-4 rounded-xl"
          >
            {/* Animated border glow */}
            <span className="absolute inset-0 rounded-xl animate-pulse-glow" />

            {isConnecting ? (
              <>
                <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.3" />
                  <path d="M12 2C6.48 2 2 6.48 2 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <span>Connecting…</span>
              </>
            ) : (
              <>
                {/* Wallet icon */}
                <svg className="w-5 h-5 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                  <path d="M1 10h22" />
                </svg>
                <span>Connect Wallet</span>
              </>
            )}
          </button>
        </div>

        {/* Protocol features */}
        <div
          className="grid grid-cols-4 gap-4 pt-4 animate-fade-up"
          style={{ animationDelay: '0.55s', opacity: 0 }}
        >
          {[
            { label: 'Risk Detection', icon: '◈' },
            { label: 'Time-Locked', icon: '◷' },
            { label: 'Cancellable', icon: '↩' },
            { label: 'Emergency Lock', icon: '⛨' },
          ].map((feat) => (
            <div key={feat.label} className="flex flex-col items-center gap-2">
              <span className="text-vault-accent text-lg">{feat.icon}</span>
              <span className="text-vault-muted text-[11px] tracking-wider uppercase font-body">
                {feat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="absolute bottom-6 left-0 right-0 text-center">
        <p className="text-vault-muted/40 text-[10px] font-body tracking-widest uppercase">
          Monad Testnet · Chain ID 10143
        </p>
      </div>
    </div>
  )
}
