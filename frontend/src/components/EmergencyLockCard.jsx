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
        backgroundColor: '#111111',
        borderColor: '#2a2a2a',
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: 16,
        padding: 24,
        position: 'relative',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg style={{ width: 20, height: 20, color: '#ef4444' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <div>
              <h3 style={{ fontFamily: 'Archivo Black', fontSize: 14, color: '#ef4444', letterSpacing: '0.05em', margin: 0 }}>
                Emergency Lock Active
              </h3>
              <p style={{ fontFamily: 'Space Mono', fontSize: 10, color: '#555', letterSpacing: '0.12em', textTransform: 'uppercase', margin: 0, marginTop: 2 }}>
                All withdrawals are frozen
              </p>
            </div>
          </div>
          <span style={{
            padding: '4px 12px',
            backgroundColor: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: 20,
            fontFamily: 'Space Mono',
            fontSize: 10,
            color: '#ef4444',
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
          border: '1px solid #2a2a2a',
          backgroundColor: '#0d0d0d',
        }}>
          <p style={{ fontFamily: 'Space Mono', fontSize: 10, color: '#555', letterSpacing: '0.15em', textTransform: 'uppercase', margin: 0, marginBottom: 4 }}>
            Unlocks In
          </p>
          <p style={{ fontFamily: 'Archivo Black', fontSize: 36, color: '#ef4444', letterSpacing: '0.05em', fontVariantNumeric: 'tabular-nums', margin: 0 }}>
            {formatted}
          </p>
        </div>

        {/* Info message */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 8,
          padding: '10px 12px',
          backgroundColor: 'rgba(239,68,68,0.06)',
          border: '1px solid rgba(239,68,68,0.15)',
          borderRadius: 10,
        }}>
          <svg style={{ width: 14, height: 14, color: '#ef4444', marginTop: 1, flexShrink: 0 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p style={{ fontFamily: 'Space Mono', fontSize: 10, color: '#777', lineHeight: 1.6, margin: 0 }}>
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
            border: '1px dashed #333',
            borderRadius: 8,
            fontFamily: 'Space Mono',
            fontSize: 10,
            color: '#555',
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
    <div className="card relative overflow-hidden">
      {/* Subtle danger tint in corner */}
      <div className="absolute -top-12 -right-12 w-28 h-28 bg-vault-danger/3 rounded-full blur-2xl pointer-events-none" />

      <div className="relative">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-body text-[10px] tracking-[0.2em] uppercase mb-1" style={{ color: '#ef4444' }}>// Security</p>
            <h3 className="font-display text-lg text-vault-text tracking-tight">Emergency Lock</h3>
            <p className="text-vault-muted text-[10px] font-body mt-0.5 tracking-wider">
              Freeze all withdrawals instantly
            </p>
          </div>

          {!showConfirm ? (
            <button
              onClick={() => setShowConfirm(true)}
              className="font-display tracking-wider uppercase transition-all duration-300 active:scale-[0.97] disabled:opacity-40"
              style={{
                padding: '8px 16px',
                fontSize: '0.7rem',
                background: '#FF6B2B',
                color: '#0A0A0A',
                border: 'none',
                clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#CAFF00'; e.currentTarget.style.boxShadow = '0 0 40px rgba(202,255,0,0.4)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#FF6B2B'; e.currentTarget.style.boxShadow = 'none'; }}
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
                className="font-display tracking-wider uppercase transition-all duration-300 active:scale-[0.97] disabled:opacity-60 flex items-center gap-2"
                style={{
                  padding: '8px 16px',
                  fontSize: '0.7rem',
                  background: '#FF6B2B',
                  color: '#0A0A0A',
                  border: 'none',
                  clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
                }}
                onMouseEnter={e => { if (!isActivating) { e.currentTarget.style.background = '#CAFF00'; e.currentTarget.style.boxShadow = '0 0 40px rgba(202,255,0,0.4)'; }}}
                onMouseLeave={e => { e.currentTarget.style.background = '#FF6B2B'; e.currentTarget.style.boxShadow = 'none'; }}
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
