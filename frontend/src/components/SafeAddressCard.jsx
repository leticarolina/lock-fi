import React, { useState } from 'react'
import { useVault } from '../context/VaultContext.jsx'
import { ethers } from 'ethers'

export default function SafeAddressCard() {
  const {
    safeAddress,
    pendingSafeAddress,
    requestSafeAddress,
    withdrawToSafeAddress,
    vaultBalance,
    isEmergencyLocked,
    pendingWithdrawal,
  } = useVault()

  const [inputAddress, setInputAddress] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isWithdrawing, setIsWithdrawing] = useState(false)
  const [error, setError] = useState('')

  const locked = isEmergencyLocked()
  const hasPending = pendingSafeAddress !== null
  const hasPendingWithdraw = pendingWithdrawal !== null
  const withdrawToSafeDisabled = locked || hasPendingWithdraw

  const isValidAddress = (addr) => {
    try {
      ethers.getAddress(addr)
      return true
    } catch {
      return false
    }
  }

  const handleSubmit = async () => {
    setError('')
    if (!isValidAddress(inputAddress)) {
      setError('Invalid Ethereum address.')
      return
    }
    setIsSubmitting(true)
    try {
      await requestSafeAddress(inputAddress)
      setInputAddress('')
    } catch (err) {
      console.error('requestSafeAddress failed:', err)
      setError('Transaction failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleWithdrawToSafe = async () => {
    setIsWithdrawing(true)
    try {
      await withdrawToSafeAddress()
    } catch (err) {
      console.error('withdrawToSafeAddress failed:', err)
    } finally {
      setIsWithdrawing(false)
    }
  }

  return (
    <div className="card relative overflow-hidden">
      <div className="absolute -top-12 -right-12 w-28 h-28 bg-vault-accent/3 rounded-full blur-2xl pointer-events-none" />

      <div className="relative">
        {/* Header */}
        <div className="mb-5">
          <p className="font-body text-[10px] tracking-[0.2em] uppercase mb-1" style={{ color: '#ec632c' }}>// Trusted Destination</p>
          <h3 className="font-display text-lg text-vault-text tracking-tight">Safe Address</h3>
          <p className="text-vault-muted text-[10px] font-body mt-0.5 tracking-wider">
            Instant withdrawal to trusted wallet
          </p>
        </div>

        {/* Current safe address display */}
        {safeAddress && (
          <div className="mb-4 p-3 bg-vault-surface border border-vault-accent/20 rounded-xl">
            <p className="text-vault-muted text-[10px] font-body tracking-[0.12em] uppercase mb-1">
              Active Safe Address
            </p>
            <p className="font-body text-xs text-vault-accent break-all">
              {safeAddress}
            </p>
          </div>
        )}

        {/* Input — only show if no pending safe change */}
        {!hasPending && (
          <div className="space-y-3">
            <div>
              <input
                type="text"
                value={inputAddress}
                onChange={(e) => { setInputAddress(e.target.value); setError('') }}
                placeholder="0x..."
                className="input-field font-body text-xs"
              />
              {error && (
                <p className="text-vault-danger text-[10px] font-body mt-1">{error}</p>
              )}
            </div>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !inputAddress}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.3" />
                    <path d="M12 2C6.48 2 2 6.48 2 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  Submitting…
                </>
              ) : (
                safeAddress ? 'Request Address Change' : 'Set Safe Address'
              )}
            </button>

            <p className="text-vault-muted text-[10px] font-body text-center leading-relaxed">
              {safeAddress
                ? <>Address change requires a <strong className="text-vault-text-dim">24h timelock</strong> before activation.</>
                : <>Set once — future changes require a <strong className="text-vault-text-dim">24h timelock</strong>.</>
              }
            </p>
          </div>
        )}

        {/* Pending change notice */}
        {hasPending && (
          <div className="p-3 bg-vault-surface border border-vault-warning/20 rounded-xl">
            <p className="text-vault-muted text-[10px] font-body tracking-[0.12em] uppercase mb-1">
              Pending Change
            </p>
            <p className="font-body text-xs text-vault-text-dim break-all">
              {pendingSafeAddress.address}
            </p>
            <p className="font-body text-[10px] text-vault-muted mt-1">
              See the pending card below to confirm or cancel.
            </p>
          </div>
        )}

        {/* Withdraw to safe — only when address is set and no pending safe change */}
        {safeAddress && !hasPending && (
          <div className="mt-4 pt-4 border-t border-vault-border/40">
            <button
              onClick={handleWithdrawToSafe}
              disabled={isWithdrawing || withdrawToSafeDisabled}
              className="btn-secondary w-full flex items-center justify-center gap-2"
              title={locked ? 'Vault is emergency locked' : hasPendingWithdraw ? 'Cancel pending withdrawal first' : ''}
            >
              {isWithdrawing ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.3" />
                    <path d="M12 2C6.48 2 2 6.48 2 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  Withdrawing…
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 12 11 14 15 10" />
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  Withdraw to Safe Address
                </>
              )}
            </button>
            {withdrawToSafeDisabled && !isWithdrawing && (
              <p className="text-vault-danger text-[10px] font-body mt-2 text-center">
                {locked ? 'Unavailable while vault is locked.' : 'Cancel pending withdrawal first.'}
              </p>
            )}
            {!withdrawToSafeDisabled && (
              <p className="text-vault-muted text-[10px] font-body mt-2 text-center">
                Sends full vault balance to trusted address — bypasses timelock.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
