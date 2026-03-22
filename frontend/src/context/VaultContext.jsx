import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { usePrivy, useWallets, useLogout } from '@privy-io/react-auth'

const VaultContext = createContext(null)

// Emergency lock duration: 24 hours in production, 2 minutes for demo
const EMERGENCY_LOCK_DURATION = 120 // seconds (2 min demo — change to 86400 for 24h)

const VAULT_INITIAL_STATE = {
  vaultBalance: 1.0,
  instantWithdrawLimit: 0.4,
  pendingWithdrawal: null,
  emergencyLock: null,
  withdrawBlockedPostLock: false,
}

export function VaultProvider({ children }) {
  const { login, authenticated, ready } = usePrivy()
  const { logout } = useLogout()
  const { wallets } = useWallets()

  // Pick the best available wallet: embedded first, then any external
  const activeWallet =
    wallets.find(w => w.walletClientType === 'privy') ?? wallets[0] ?? null

  const rawAddress = activeWallet?.address ?? null
  const walletAddress = rawAddress
    ? `${rawAddress.slice(0, 6)}...${rawAddress.slice(-4)}`
    : null

  const isConnected = authenticated

  const [state, setState] = useState(VAULT_INITIAL_STATE)

  // Reset vault state on logout
  useEffect(() => {
    if (!authenticated) {
      setState(VAULT_INITIAL_STATE)
    }
  }, [authenticated])

  // Helper: check if emergency lock is currently active
  const isEmergencyLocked = useCallback(() => {
    if (!state.emergencyLock) return false
    return Date.now() < state.emergencyLock.unlockTimestamp.getTime()
  }, [state.emergencyLock])

  const connectWallet = useCallback(() => login(), [login])

  const disconnectWallet = useCallback(() => logout(), [logout])

  const deposit = useCallback((amount) => {
    const numAmount = parseFloat(amount)
    if (isNaN(numAmount) || numAmount <= 0) return
    setState(prev => {
      const newBalance = prev.vaultBalance + numAmount
      return {
        ...prev,
        vaultBalance: parseFloat(newBalance.toFixed(6)),
        instantWithdrawLimit: parseFloat((newBalance * 0.6).toFixed(6)),
      }
    })
  }, [])

  const withdraw = useCallback((amount) => {
    const numAmount = parseFloat(amount)
    if (isNaN(numAmount) || numAmount <= 0) return
    if (isEmergencyLocked()) return
    if (state.withdrawBlockedPostLock) return

    const balance = state.vaultBalance
    if (numAmount > balance) return

    const isLargeWithdrawal = numAmount > balance * 0.6

    if (isLargeWithdrawal) {
      const now = new Date()
      const unlockDuration = 60
      const unlockTimestamp = new Date(now.getTime() + unlockDuration * 1000)
      setState(prev => ({
        ...prev,
        pendingWithdrawal: { amount: numAmount, requestedAt: now, unlockDuration, unlockTimestamp },
      }))
    } else {
      setState(prev => {
        const newBalance = prev.vaultBalance - numAmount
        return {
          ...prev,
          vaultBalance: parseFloat(newBalance.toFixed(6)),
          instantWithdrawLimit: parseFloat((newBalance * 0.6).toFixed(6)),
        }
      })
    }
  }, [state.vaultBalance, state.withdrawBlockedPostLock, isEmergencyLocked])

  const executeWithdraw = useCallback(() => {
    if (!state.pendingWithdrawal || isEmergencyLocked()) return
    setState(prev => {
      const newBalance = Math.max(0, prev.vaultBalance - prev.pendingWithdrawal.amount)
      return {
        ...prev,
        vaultBalance: parseFloat(newBalance.toFixed(6)),
        instantWithdrawLimit: parseFloat((newBalance * 0.6).toFixed(6)),
        pendingWithdrawal: null,
      }
    })
  }, [state.pendingWithdrawal, isEmergencyLocked])

  const cancelWithdraw = useCallback(() => {
    setState(prev => ({ ...prev, pendingWithdrawal: null }))
  }, [])

  const activateEmergencyLock = useCallback(() => {
    const now = new Date()
    const unlockTimestamp = new Date(now.getTime() + EMERGENCY_LOCK_DURATION * 1000)
    setState(prev => ({
      ...prev,
      emergencyLock: { activatedAt: now, unlockTimestamp, duration: EMERGENCY_LOCK_DURATION },
      pendingWithdrawal: null,
    }))
  }, [])

  const deactivateEmergencyLock = useCallback(() => {
    setState(prev => ({ ...prev, emergencyLock: null, withdrawBlockedPostLock: false }))
  }, [])

  // Auto-expire emergency lock when timer runs out
  useEffect(() => {
    if (!state.emergencyLock) return
    const msUntilUnlock = state.emergencyLock.unlockTimestamp.getTime() - Date.now()
    if (msUntilUnlock <= 0) {
      setState(prev => ({ ...prev, emergencyLock: null, withdrawBlockedPostLock: true }))
      return
    }
    const timer = setTimeout(() => {
      setState(prev => ({ ...prev, emergencyLock: null, withdrawBlockedPostLock: true }))
    }, msUntilUnlock)
    return () => clearTimeout(timer)
  }, [state.emergencyLock])

  const value = {
    ...state,
    isConnected,
    walletAddress,
    ready,
    isEmergencyLocked,
    connectWallet,
    disconnectWallet,
    deposit,
    withdraw,
    executeWithdraw,
    cancelWithdraw,
    activateEmergencyLock,
    deactivateEmergencyLock,
  }

  return (
    <VaultContext.Provider value={value}>
      {children}
    </VaultContext.Provider>
  )
}

export function useVault() {
  const context = useContext(VaultContext)
  if (!context) throw new Error('useVault must be used within VaultProvider')
  return context
}
