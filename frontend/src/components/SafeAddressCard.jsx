import React, { useState } from 'react'
import { useVault } from '../context/VaultContext.jsx'
import { ethers } from 'ethers'

export default function SafeAddressCard() {
  const {
    safeAddress,
    pendingSafeAddress,
    requestSafeAddress,
    withdrawToSafeAddress,
    isEmergencyLocked,
    pendingWithdrawal,
  } = useVault()

  const [inputAddress, setInputAddress] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [showChangeForm, setShowChangeForm] = useState(false)

  const locked = isEmergencyLocked()
  const hasPending = pendingSafeAddress !== null
  const hasPendingWithdraw = pendingWithdrawal !== null
  const withdrawToSafeDisabled = locked || hasPendingWithdraw

  const isValidAddress = (addr) => {
    try { ethers.getAddress(addr); return true } catch { return false }
  }

  const handleSubmit = async () => {
    setError('')
    if (!isValidAddress(inputAddress)) { setError('Invalid Ethereum address.'); return }
    setIsSubmitting(true)
    try {
      await requestSafeAddress(inputAddress)
      setInputAddress('')
      setShowChangeForm(false)
    } catch (err) {
      console.error('requestSafeAddress failed:', err)
      setError('Transaction failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const truncate = (addr) => addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : ''

  const card = {
    background: '#FFFFFF',
    border: '1px solid #E0DCD8',
    borderRadius: 4,
    padding: '20px 22px',
    marginBottom: 16,
  }

  const label = {
    fontFamily: "'Space Mono', monospace",
    fontSize: '0.58rem',
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: '#A89880',
    marginBottom: 14,
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

      {/* ── What is a Safe Address? ── */}
      <div style={{ ...card, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
        <span style={{
          width: 28, height: 28, borderRadius: '50%',
          border: '1.5px solid #697f42',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, color: '#697f42', fontSize: '0.75rem', fontWeight: 700,
        }}>i</span>
        <div>
          <p style={{ fontFamily: 'Archivo Black', fontSize: '0.85rem', color: '#111111', marginBottom: 6 }}>
            What is a Safe Address?
          </p>
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', color: '#6A6055', lineHeight: 1.7 }}>
            A safe address is a trusted wallet you control separately. In an emergency, your vault can withdraw directly
            to this address — bypassing the normal timelock. Changes to this address require a 24-hour security delay.
          </p>
        </div>
      </div>

      {/* ── Current Safe Address ── */}
      <div style={{ ...card }}>
        <p style={label}>Current Safe Address</p>

        {safeAddress ? (
          <>
            {/* Address row */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              background: '#F8F6F3', border: '1px solid #E0DCD8',
              borderRadius: 4, padding: '12px 14px', marginBottom: 12,
            }}>
              <span style={{
                width: 32, height: 32, borderRadius: '50%',
                background: 'rgba(105,127,66,0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                color: '#697f42',
              }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontFamily: 'Archivo Black', fontSize: '0.88rem', color: '#111111', margin: 0 }}>
                  {truncate(safeAddress)}
                </p>
                <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: '#A89880', margin: 0 }}>
                  Verified safe address
                </p>
              </div>
              <span style={{
                padding: '4px 10px', borderRadius: 4,
                background: 'rgba(105,127,66,0.10)',
                border: '1px solid rgba(105,127,66,0.25)',
                fontFamily: "'Space Mono', monospace", fontSize: '0.58rem',
                color: '#697f42', letterSpacing: '0.05em',
                display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#697f42', display: 'inline-block' }} />
                Active
              </span>
            </div>

            {/* Full address */}
            <p style={{
              fontFamily: "'Space Mono', monospace", fontSize: '0.62rem',
              color: '#6A6055', wordBreak: 'break-all', marginBottom: 14,
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#697f42" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span><span style={{ color: '#A89880' }}>Full address: </span>{safeAddress}</span>
            </p>

            {/* Change button or form */}
            {!hasPending && !showChangeForm && (
              <button
                onClick={() => !locked && setShowChangeForm(true)}
                disabled={locked}
                style={{
                  width: '100%', padding: '11px 0',
                  background: 'transparent',
                  border: `1.5px solid ${locked ? 'rgba(239,68,68,0.25)' : '#E0DCD8'}`,
                  borderRadius: 4, cursor: locked ? 'not-allowed' : 'pointer',
                  fontFamily: "'Space Mono', monospace", fontSize: '0.7rem',
                  letterSpacing: '0.08em',
                  color: locked ? '#ef4444' : '#444444',
                  opacity: locked ? 0.6 : 1,
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { if (!locked) { e.currentTarget.style.borderColor = '#697f42'; e.currentTarget.style.color = '#697f42' } }}
                onMouseLeave={e => { if (!locked) { e.currentTarget.style.borderColor = '#E0DCD8'; e.currentTarget.style.color = '#444444' } }}
              >
                {locked ? '🔒 Locked — Emergency active' : 'Change Safe Address'}
              </button>
            )}

            {locked && (
              <p style={{
                fontFamily: "'Space Mono', monospace", fontSize: '0.6rem',
                color: '#ef4444', textAlign: 'center', marginTop: 8,
                opacity: 0.8,
              }}>
                Safe address changes are blocked while emergency lock is active.
              </p>
            )}

            {showChangeForm && !hasPending && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <input
                  type="text"
                  value={inputAddress}
                  onChange={e => { setInputAddress(e.target.value); setError('') }}
                  placeholder="0x..."
                  style={{
                    width: '100%', padding: '10px 12px', boxSizing: 'border-box',
                    border: '1.5px solid #E0DCD8', borderRadius: 4,
                    fontFamily: "'Space Mono', monospace", fontSize: '0.72rem',
                    color: '#111111', background: '#FAFAF8', outline: 'none',
                  }}
                />
                {error && <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.62rem', color: '#ef4444' }}>{error}</p>}
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => { setShowChangeForm(false); setInputAddress(''); setError('') }}
                    style={{
                      flex: 1, padding: '10px 0',
                      background: 'transparent', border: '1.5px solid #E0DCD8',
                      borderRadius: 4, cursor: 'pointer',
                      fontFamily: "'Space Mono', monospace", fontSize: '0.68rem', color: '#888888',
                    }}
                  >Cancel</button>
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !inputAddress}
                    style={{
                      flex: 2, padding: '10px 0',
                      background: '#697f42', border: 'none',
                      borderRadius: 4, cursor: isSubmitting || !inputAddress ? 'not-allowed' : 'pointer',
                      opacity: isSubmitting || !inputAddress ? 0.5 : 1,
                      fontFamily: "'Space Mono', monospace", fontSize: '0.68rem',
                      color: '#F5F0EB', letterSpacing: '0.08em',
                    }}
                  >
                    {isSubmitting ? 'Submitting…' : 'Request Change'}
                  </button>
                </div>
                <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: '#A89880', textAlign: 'center' }}>
                  Address change requires a <strong style={{ color: '#6A6055' }}>24h timelock</strong> before activation.
                </p>
              </div>
            )}
          </>
        ) : !hasPending ? (
          /* No safe address yet */
          locked ? (
            <div style={{
              padding: '14px', background: 'rgba(239,68,68,0.05)',
              border: '1px solid rgba(239,68,68,0.2)', borderRadius: 4,
              textAlign: 'center',
            }}>
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', color: '#ef4444', marginBottom: 4 }}>
                🔒 Emergency lock active
              </p>
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: '#A89880' }}>
                Safe address cannot be set while the vault is locked.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input
                type="text"
                value={inputAddress}
                onChange={e => { setInputAddress(e.target.value); setError('') }}
                placeholder="0x..."
                style={{
                  width: '100%', padding: '10px 12px', boxSizing: 'border-box',
                  border: '1.5px solid #E0DCD8', borderRadius: 4,
                  fontFamily: "'Space Mono', monospace", fontSize: '0.72rem',
                  color: '#111111', background: '#FAFAF8', outline: 'none',
                }}
              />
              {error && <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.62rem', color: '#ef4444' }}>{error}</p>}
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !inputAddress}
                style={{
                  width: '100%', padding: '11px 0',
                  background: '#697f42', border: 'none', borderRadius: 4,
                  cursor: isSubmitting || !inputAddress ? 'not-allowed' : 'pointer',
                  opacity: isSubmitting || !inputAddress ? 0.5 : 1,
                  fontFamily: "'Space Mono', monospace", fontSize: '0.7rem',
                  color: '#F5F0EB', letterSpacing: '0.08em',
                }}
              >
                {isSubmitting ? 'Submitting…' : 'Set Safe Address'}
              </button>
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: '#A89880', textAlign: 'center' }}>
                Set once — future changes require a <strong style={{ color: '#6A6055' }}>24h timelock</strong>.
              </p>
            </div>
          )
        ) : null}

        {/* Pending change notice */}
        {hasPending && (
          <div style={{
            padding: '12px 14px', background: 'rgba(245,158,11,0.06)',
            border: '1px solid rgba(245,158,11,0.25)', borderRadius: 4,
          }}>
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#A89880', marginBottom: 4 }}>
              Pending Change
            </p>
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', color: '#6A6055', wordBreak: 'break-all', marginBottom: 4 }}>
              {pendingSafeAddress.address}
            </p>
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: '#A89880' }}>
              See the pending card below to confirm or cancel.
            </p>
          </div>
        )}
      </div>

      {/* ── Security Tips ── */}
      <div style={{ ...card, marginBottom: 0 }}>
        <p style={label}>Security Tips</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            'Use a hardware wallet address you control independently',
            'Never reuse your main vault address as your safe address',
            'Test a small transfer to verify you have access before relying on it',
          ].map((tip, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#A89880" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', color: '#6A6055', lineHeight: 1.6 }}>
                {tip}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
