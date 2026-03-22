import React from 'react'
import ShieldIcon from './ShieldIcon.jsx'

export default function LandingScreen({ onLaunch }) {

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
          <div className="flex justify-center">
            <img src="/logo.svg" alt="LockFi" className="h-24 w-auto" />
          </div>
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
          Delay suspicious withdrawals and protect your funds on Monad.
          <br />
          <span className="text-vault-muted text-xs">
            On-chain risk detection with time-locked execution.
          </span>
        </p>

        {/* Launch App button */}
        <div className="animate-fade-up" style={{ animationDelay: '0.4s', opacity: 0 }}>
          <button
            onClick={onLaunch}
            className="group relative inline-flex items-center gap-2 btn-primary text-sm px-7 py-3 rounded-xl"
          >
            <span className="absolute inset-0 rounded-xl animate-pulse-glow" />
            <span>LAUNCH APP</span>
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
      <div className="absolute bottom-6 left-0 right-0 text-center space-y-1">
        <p className="text-vault-muted/40 text-[10px] font-body tracking-widest uppercase">
          Monad Testnet
        </p>
        <p className="text-vault-muted/40 text-[10px] font-body tracking-widest uppercase">
          Created by Leticia Azevedo and Shaiane Viana
        </p>
      </div>
    </div>
  )
}
