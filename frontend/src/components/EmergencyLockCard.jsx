import React, { useState, useCallback } from 'react'
import { useVault } from '../context/VaultContext.jsx'
import { useCountdown } from '../hooks/useCountdown.js'

const PRESETS = [
  { label: '1h',  seconds: 3600 },
  { label: '6h',  seconds: 21600 },
  { label: '24h', seconds: 86400 },
  { label: '3d',  seconds: 259200 },
  { label: '7d',  seconds: 604800 },
  { label: '30d', seconds: 2592000 },
]

const MIN_LOG = Math.log(3600)
const MAX_LOG = Math.log(2592000)

function secondsToSlider(s) {
  return ((Math.log(Math.max(s, 3600)) - MIN_LOG) / (MAX_LOG - MIN_LOG)) * 100
}

function sliderToSeconds(v) {
  const raw = Math.round(Math.exp(MIN_LOG + (v / 100) * (MAX_LOG - MIN_LOG)))
  // Snap to preset if within 4% of it
  for (const p of PRESETS) {
    if (Math.abs(p.seconds - raw) / p.seconds < 0.04) return p.seconds
  }
  return raw
}

function formatDuration(seconds) {
  if (seconds < 86400) {
    const h = Math.round(seconds / 3600)
    return `${h} ${h === 1 ? 'hour' : 'hours'}`
  }
  const d = Math.round(seconds / 86400)
  return `${d} ${d === 1 ? 'day' : 'days'}`
}

function DurationSelector({ value, onChange }) {
  const sliderVal = secondsToSlider(value)
  const label = formatDuration(value)

  const handleSlider = (e) => {
    onChange(sliderToSeconds(Number(e.target.value)))
  }

  const handlePreset = (seconds) => {
    onChange(seconds)
  }

  const filledPercent = sliderVal

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Label row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ fontFamily: 'Space Mono', fontSize: 10, color: 'var(--clr-muted)', letterSpacing: '0.15em', textTransform: 'uppercase', margin: 0 }}>
          Lock Duration
        </p>
        <span style={{
          fontFamily: 'Archivo Black',
          fontSize: 14,
          color: '#ec632c',
          letterSpacing: '0.03em',
        }}>
          {label}
        </span>
      </div>

      {/* Slider with gradient fill */}
      <div style={{ position: 'relative' }}>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          transform: 'translateY(-50%)',
          width: `${filledPercent}%`,
          height: 4,
          borderRadius: 2,
          background: 'linear-gradient(90deg, #ec632c, #697f42)',
          pointerEvents: 'none',
          zIndex: 1,
        }} />
        <input
          type="range"
          className="lock-slider"
          min={0}
          max={100}
          step={0.1}
          value={sliderVal}
          onChange={handleSlider}
          style={{ position: 'relative', zIndex: 2 }}
        />
      </div>

      {/* Quick-select buttons */}
      <div style={{ display: 'flex', gap: 6 }}>
        {PRESETS.map(p => {
          const active = p.seconds === value
          return (
            <button
              key={p.seconds}
              onClick={() => handlePreset(p.seconds)}
              style={{
                flex: 1,
                padding: '6px 0',
                fontSize: '0.62rem',
                fontFamily: 'Space Mono',
                letterSpacing: '0.06em',
                background: active ? 'rgba(236,99,44,0.15)' : 'transparent',
                border: active ? '1px solid rgba(236,99,44,0.55)' : '1px solid var(--clr-border-soft)',
                borderRadius: 4,
                color: active ? '#ec632c' : 'var(--clr-muted)',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {p.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function EmergencyLockCard() {
  const { emergencyLock, isEmergencyLocked, activateEmergencyLock } = useVault()
  const locked = isEmergencyLocked()
  const { formatted } = useCountdown(emergencyLock?.unlockTimestamp)

  // Activate state
  const [duration, setDuration] = useState(86400)
  const [acknowledged, setAcknowledged] = useState(false)
  const [isActivating, setIsActivating] = useState(false)
  const [txSuccess, setTxSuccess] = useState(false)

  // Extend lock state
  const [showExtend, setShowExtend] = useState(false)
  const [extendDuration, setExtendDuration] = useState(86400)
  const [isExtending, setIsExtending] = useState(false)

  const handleActivate = async () => {
    if (!acknowledged) return
    setIsActivating(true)
    try {
      await activateEmergencyLock(duration)
      setTxSuccess(true)
      setAcknowledged(false)
    } catch (err) {
      console.error('Emergency lock failed:', err)
    } finally {
      setIsActivating(false)
    }
  }

  const handleExtend = async () => {
    setIsExtending(true)
    try {
      await activateEmergencyLock(extendDuration)
      setShowExtend(false)
    } catch (err) {
      console.error('Extend lock failed:', err)
    } finally {
      setIsExtending(false)
    }
  }

  const durationLabel = formatDuration(duration)

  // ── LOCKED STATE ────────────────────────────────────────────────
  if (locked) {
    return (
      <div style={{
        backgroundColor: 'var(--clr-surface)',
        border: '1px solid var(--clr-border-soft)',
        borderRadius: 4,
        padding: 24,
        transition: 'background-color 0.25s ease',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 4, backgroundColor: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg style={{ width: 20, height: 20, color: '#ef4444' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <div>
              <h3 style={{ fontFamily: 'Archivo Black', fontSize: 14, color: '#ef4444', letterSpacing: '0.05em', margin: 0 }}>
                Emergency Lock Active
              </h3>
              <p style={{ fontFamily: 'Space Mono', fontSize: 10, color: 'var(--clr-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', margin: 0, marginTop: 2 }}>
                All withdrawals are frozen
              </p>
            </div>
          </div>
          <span style={{
            padding: '4px 12px',
            backgroundColor: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: 4,
            fontFamily: 'Space Mono',
            fontSize: 10,
            color: '#ef4444',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            flexShrink: 0,
          }}>
            Locked
          </span>
        </div>

        {/* Countdown */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '16px 0',
          marginBottom: 16,
          borderRadius: 4,
          border: '1px solid var(--clr-border-soft)',
          backgroundColor: 'var(--clr-deep)',
        }}>
          <p style={{ fontFamily: 'Space Mono', fontSize: 10, color: 'var(--clr-muted)', letterSpacing: '0.15em', textTransform: 'uppercase', margin: 0, marginBottom: 6 }}>
            Unlocks In
          </p>
          <p style={{ fontFamily: 'Archivo Black', fontSize: 38, color: '#ef4444', letterSpacing: '0.04em', fontVariantNumeric: 'tabular-nums', margin: 0 }}>
            {formatted}
          </p>
        </div>

        {/* Info */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 8,
          padding: '10px 12px',
          backgroundColor: 'rgba(239,68,68,0.05)',
          border: '1px solid rgba(239,68,68,0.12)',
          borderRadius: 4,
          marginBottom: 14,
        }}>
          <svg style={{ width: 13, height: 13, color: '#ef4444', marginTop: 1, flexShrink: 0 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p style={{ fontFamily: 'Space Mono', fontSize: 10, color: 'var(--clr-muted-mid)', lineHeight: 1.7, margin: 0 }}>
            Deposits remain open. Vault unlocks automatically at 00:00. The lock can be extended but never shortened early.
          </p>
        </div>

        {/* Extend Lock */}
        {!showExtend ? (
          <button
            onClick={() => setShowExtend(true)}
            style={{
              width: '100%',
              padding: '10px 0',
              background: 'transparent',
              border: '1px solid var(--clr-border-soft)',
              borderRadius: 4,
              fontFamily: 'Space Mono',
              fontSize: 10,
              color: 'var(--clr-muted)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'border-color 0.15s, color 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#444'; e.currentTarget.style.color = '#aaa'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--clr-border-soft)'; e.currentTarget.style.color = 'var(--clr-muted)'; }}
          >
            Extend Lock
          </button>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: '16px', border: '1px solid var(--clr-border-soft)', borderRadius: 4, backgroundColor: 'var(--clr-deep)' }}>
            <p style={{ fontFamily: 'Archivo Black', fontSize: 12, color: 'var(--clr-text-dim)', margin: 0, letterSpacing: '0.04em' }}>
              Extend Lock Duration
            </p>
            <DurationSelector value={extendDuration} onChange={setExtendDuration} />
            <p style={{ fontFamily: 'Space Mono', fontSize: 9, color: 'var(--clr-muted)', margin: 0, lineHeight: 1.6 }}>
              The new duration must result in a later unlock time than the current lock. The contract will reject if not.
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => setShowExtend(false)}
                style={{
                  flex: 1,
                  padding: '9px 0',
                  background: 'transparent',
                  border: '1px solid var(--clr-border)',
                  borderRadius: 4,
                  fontFamily: 'Space Mono',
                  fontSize: 10,
                  color: 'var(--clr-muted)',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleExtend}
                disabled={isExtending}
                style={{
                  flex: 2,
                  padding: '9px 0',
                  background: isExtending ? 'transparent' : 'rgba(239,68,68,0.12)',
                  border: '1px solid rgba(239,68,68,0.35)',
                  borderRadius: 4,
                  fontFamily: 'Space Mono',
                  fontSize: 10,
                  color: '#ef4444',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  cursor: isExtending ? 'not-allowed' : 'pointer',
                  opacity: isExtending ? 0.5 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                }}
              >
                {isExtending ? (
                  <>
                    <svg style={{ width: 12, height: 12, animation: 'spin 1s linear infinite' }} viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.3" />
                      <path d="M12 2C6.48 2 2 6.48 2 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    Extending…
                  </>
                ) : (
                  `Confirm — ${formatDuration(extendDuration)}`
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  // ── NOT LOCKED STATE ─────────────────────────────────────────────
  return (
    <div className="card relative overflow-hidden">
      <div className="absolute -top-12 -right-12 w-28 h-28 bg-vault-danger/3 rounded-full blur-2xl pointer-events-none" />

      <div className="relative space-y-5">
        {/* Section label + title */}
        <div>
          <p className="font-body text-[10px] tracking-[0.2em] uppercase mb-1" style={{ color: '#ef4444' }}>// Security</p>
          <h3 className="font-display text-lg text-vault-text tracking-tight">Emergency Lock</h3>
        </div>

        {/* Warning banner — always visible */}
        <div style={{
          padding: '12px 14px',
          backgroundColor: 'rgba(239,68,68,0.06)',
          border: '1px solid rgba(239,68,68,0.18)',
          borderRadius: 4,
          display: 'flex',
          gap: 10,
          alignItems: 'flex-start',
        }}>
          <svg style={{ width: 14, height: 14, color: '#ef4444', flexShrink: 0, marginTop: 1 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <p style={{ fontFamily: 'Archivo Black', fontSize: 11, color: '#ef4444', margin: 0, letterSpacing: '0.04em' }}>
              This action cannot be undone early
            </p>
            <p style={{ fontFamily: 'Space Mono', fontSize: 10, color: 'var(--clr-muted)', lineHeight: 1.7, margin: 0 }}>
              Activating an emergency lock will immediately block all withdrawals (including pending ones) for the selected duration. Use this if you suspect unauthorized access or key compromise.
            </p>
          </div>
        </div>

        {/* Duration selector */}
        <DurationSelector value={duration} onChange={setDuration} />

        {/* Acknowledgement checkbox */}
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
          <div
            onClick={() => setAcknowledged(v => !v)}
            style={{
              width: 18,
              height: 18,
              borderRadius: 4,
              border: acknowledged ? '1.5px solid #ec632c' : '1.5px solid #444',
              backgroundColor: acknowledged ? 'rgba(236,99,44,0.15)' : 'transparent',
              flexShrink: 0,
              marginTop: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s',
              cursor: 'pointer',
            }}
          >
            {acknowledged && (
              <svg style={{ width: 10, height: 10, color: '#ec632c' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </div>
          <p
            onClick={() => setAcknowledged(v => !v)}
            style={{ fontFamily: 'Space Mono', fontSize: 10, color: 'var(--clr-muted)', lineHeight: 1.7, margin: 0, userSelect: 'none' }}
          >
            I understand that activating an emergency lock will block all vault withdrawals for{' '}
            <strong style={{ color: 'var(--clr-text-dim)' }}>{durationLabel}</strong> and cannot be reversed early.
          </p>
        </label>

        {/* Confirm button */}
        <button
          onClick={handleActivate}
          disabled={!acknowledged || isActivating}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          {isActivating ? (
            <>
              <svg style={{ width: 14, height: 14, animation: 'spin 1s linear infinite' }} viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.3" />
                <path d="M12 2C6.48 2 2 6.48 2 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              Activating…
            </>
          ) : (
            `Activate Emergency Lock — ${durationLabel}`
          )}
        </button>
      </div>
    </div>
  )
}
