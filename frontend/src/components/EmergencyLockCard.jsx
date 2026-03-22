import React, { useState } from 'react'
import { useVault } from '../context/VaultContext.jsx'
import { useCountdown } from '../hooks/useCountdown.js'

export default function EmergencyLockCard() {
  const { emergencyLock, isEmergencyLocked, activateEmergencyLock, deactivateEmergencyLock } = useVault()
  const locked = isEmergencyLocked()
  const { formatted } = useCountdown(emergencyLock?.unlockTimestamp)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isActivating, setIsActivating] = useState(false)

  const handleActivate = async () => {
    setIsActivating(true)
    try {
      await activateEmergencyLock()
    } catch (err) {
      console.error('Emergency lock failed:', err)
    } finally {
      setShowConfirm(false)
      setIsActivating(false)
    }
  }

  // If lock is active, show disabled gray card with timer
  if (locked) {
    return (
      <div style={{
        backgroundColor: '#d4d4d4',
        borderColor: '#b8b8b8',
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: 16,
        padding: 24,
        opacity: 0.85,
        position: 'relative',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: '#b8b8b8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg style={{ width: 20, height: 20, color: '#666' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <div>
              <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 14, color: '#555', letterSpacing: '0.05em', margin: 0 }}>
                Emergency Lock Active
              </h3>
              <p style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: '#888', letterSpacing: '0.12em', textTransform: 'uppercase', margin: 0, marginTop: 2 }}>
                All withdrawals are frozen
              </p>
            </div>
          </div>
          <span style={{
            padding: '4px 12px',
            backgroundColor: '#c0c0c0',
            border: '1px solid #aaa',
            borderRadius: 20,
            fontFamily: 'IBM Plex Mono',
            fontSize: 10,
            color: '#666',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}>
            Locked
          </span>
        </div>

        {/* Timer */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px 0',
          marginBottom: 16,
          borderRadius: 12,
          border: '1px solid #bbb',
          backgroundColor: '#c8c8c8',
        }}>
          <p style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: '#888', letterSpacing: '0.15em', textTransform: 'uppercase', margin: 0, marginBottom: 4 }}>
            Unlocks In
          </p>
          <p style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 36, color: '#555', letterSpacing: '0.05em', fontVariantNumeric: 'tabular-nums', margin: 0 }}>
            {formatted}
          </p>
        </div>

        {/* Info message */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 8,
          padding: '10px 12px',
          backgroundColor: '#c4c4c4',
          border: '1px solid #b0b0b0',
          borderRadius: 10,
        }}>
          <svg style={{ width: 14, height: 14, color: '#777', marginTop: 1, flexShrink: 0 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: '#666', lineHeight: 1.6, margin: 0 }}>
            Deposits are still allowed. The vault unlocks automatically when the timer reaches 00:00.
          </p>
        </div>

        {/* Force Unlock — demo only */}
        <button
          onClick={deactivateEmergencyLock}
          style={{
            width: '100%',
            marginTop: 12,
            padding: '10px 0',
            background: 'transparent',
            border: '1px dashed #b0b0b0',
            borderRadius: 8,
            fontFamily: 'IBM Plex Mono',
            fontSize: 10,
            color: '#999',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            cursor: 'pointer',
          }}
        >
          ⚠ Force Unlock (Demo Only)
        </button>
      </div>
    )
  }

  // If lock is NOT active, show the activate button
  return (
    <div className="card border-vault-border/50 relative overflow-hidden">
      {/* Subtle danger tint in corner */}
      <div className="absolute -top-12 -right-12 w-28 h-28 bg-vault-danger/3 rounded-full blur-2xl pointer-events-none" />

      <div className="relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-vault-danger/8 flex items-center justify-center">
              <svg className="w-4.5 h-4.5 text-vault-danger/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <div>
              <h3 className="font-display font-600 text-sm text-vault-text tracking-wide">
                Emergency Lock
              </h3>
              <p className="text-vault-muted text-[10px] font-body mt-0.5">
                Freeze all withdrawals instantly
              </p>
            </div>
          </div>

          {!showConfirm ? (
            <button
              onClick={() => setShowConfirm(true)}
              className="px-4 py-2 bg-vault-danger/10 border border-vault-danger/25 rounded-lg
                         text-vault-danger text-[11px] font-body font-medium tracking-wider uppercase
                         hover:bg-vault-danger/20 hover:border-vault-danger/40
                         transition-all duration-200"
            >
              Activate
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-3 py-2 text-vault-muted text-[11px] font-body tracking-wider uppercase
                           hover:text-vault-text transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleActivate}
                disabled={isActivating}
                className="px-4 py-2 bg-vault-danger border border-vault-danger rounded-lg
                           text-white text-[11px] font-body font-medium tracking-wider uppercase
                           hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]
                           disabled:opacity-60
                           transition-all duration-200 flex items-center gap-2"
              >
                {isActivating ? (
                  <>
                    <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.3" />
                      <path d="M12 2C6.48 2 2 6.48 2 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    Locking…
                  </>
                ) : (
                  'Confirm Lock'
                )}
              </button>
            </div>
          )}
        </div>

        {/* Confirmation warning */}
        {showConfirm && (
          <div className="mt-4 flex items-start gap-2 p-3 bg-vault-danger-glow border border-vault-danger/15 rounded-xl animate-slide-in">
            <svg className="w-3.5 h-3.5 text-vault-danger mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <p className="text-vault-danger/80 text-[11px] font-body leading-relaxed">
              This will freeze <strong className="text-vault-danger">all withdrawals</strong> for
              the next <strong className="text-vault-danger">2 minutes</strong> (24h in production).
              Any pending withdrawal will be cancelled. Deposits remain unaffected.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
