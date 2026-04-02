import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react'
import { usePrivy, useWallets, useLogout } from '@privy-io/react-auth'
import { ethers } from 'ethers'
import LockFiABI from '../LockFiABI.json'

const VaultContext = createContext(null)

const CONTRACT_ADDRESS = '0x0919Df3678039BCe59abdD19D7bf9e7D1b7eb5d8'
const RPC_URL = 'https://testnet-rpc.monad.xyz'
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
const SAFE_CHANGE_DELAY = 24 * 60 * 60 // 24h in seconds

const provider = new ethers.JsonRpcProvider(RPC_URL)
const readContract = new ethers.Contract(CONTRACT_ADDRESS, LockFiABI, provider)

const INITIAL_STATE = {
  vaultBalance: 0,
  instantWithdrawLimit: 0,
  pendingWithdrawal: null,
  emergencyLock: null,
  withdrawBlockedPostLock: false,
}

const INITIAL_SAFE_STATE = {
  safeAddress: null,
  pendingSafeAddress: null,
}

export function VaultProvider({ children }) {
  const { login, authenticated, ready } = usePrivy()
  const { logout } = useLogout()
  const { wallets } = useWallets()

  const activeWallet = wallets.find(w => w.walletClientType === 'privy') ?? wallets[0] ?? null
  const rawAddress = activeWallet?.address ?? null
  const walletAddress = rawAddress
    ? `${rawAddress.slice(0, 6)}...${rawAddress.slice(-4)}`
    : null

  const isConnected = authenticated
  const [state, setState] = useState(INITIAL_STATE)
  const [safeState, setSafeState] = useState(INITIAL_SAFE_STATE)
  const pollingRef = useRef(null)

  const getSigner = useCallback(async () => {
    if (!activeWallet) throw new Error('No wallet connected')
    const ethProvider = await activeWallet.getEthereumProvider()
    const ethersProvider = new ethers.BrowserProvider(ethProvider)
    return ethersProvider.getSigner()
  }, [activeWallet])

  const getSignerContract = useCallback(async () => {
    const signer = await getSigner()
    return readContract.connect(signer)
  }, [getSigner])

  // Fetch vault state from contract using getUserState()
  const fetchUserState = useCallback(async (address) => {
    if (!address) return
    try {
      const userState = await readContract.getUserState(address)

      let pendingWithdrawal = null
      if (userState.hasPending) {
        const pending = await readContract.getPendingWithdraw(address)
        pendingWithdrawal = {
          amount: parseFloat(ethers.formatEther(pending.amount)),
          requestedAt: new Date(Number(pending.requestTime) * 1000),
          unlockTimestamp: new Date(Number(pending.unlockTime) * 1000),
          unlockDuration: Number(pending.unlockTime) - Number(pending.requestTime),
        }
      }

      let emergencyLock = null
      if (userState.isLocked) {
        const remainingSeconds = Number(userState.remainingLockTime)
        emergencyLock = {
          unlockTimestamp: new Date(Date.now() + remainingSeconds * 1000),
        }
      }

      setState({
        vaultBalance: parseFloat(ethers.formatEther(userState.balance)),
        instantWithdrawLimit: parseFloat(ethers.formatEther(userState.instantLimit)),
        pendingWithdrawal,
        emergencyLock,
        withdrawBlockedPostLock: false,
      })
    } catch (err) {
      console.error('Failed to fetch user state:', err)
    }
  }, [])

  // Fetch safe address state from contract
  const fetchSafeAddressState = useCallback(async (address) => {
    if (!address) return
    try {
      const currentSafe = await readContract.safeAddress(address)
      const [pendingSafe, remainingTime] = await readContract.getPendingSafeChange(address)

      const safeAddr = currentSafe === ZERO_ADDRESS ? null : currentSafe
      const hasPendingSafe = pendingSafe !== ZERO_ADDRESS
      const pendingSafeAddress = hasPendingSafe
        ? {
            address: pendingSafe,
            remainingTime: Number(remainingTime),
            unlockTimestamp: new Date(Date.now() + Number(remainingTime) * 1000),
            unlockDuration: SAFE_CHANGE_DELAY,
          }
        : null

      setSafeState({ safeAddress: safeAddr, pendingSafeAddress })
    } catch (err) {
      console.error('Failed to fetch safe address state:', err)
    }
  }, [])

  const fetchAllState = useCallback(async (address) => {
    await Promise.all([fetchUserState(address), fetchSafeAddressState(address)])
  }, [fetchUserState, fetchSafeAddressState])

  // Fetch on wallet connect/change
  useEffect(() => {
    if (authenticated && rawAddress) {
      fetchAllState(rawAddress)
    } else {
      setState(INITIAL_STATE)
      setSafeState(INITIAL_SAFE_STATE)
    }
  }, [authenticated, rawAddress, fetchAllState])

  // Poll every 10 seconds
  useEffect(() => {
    if (!authenticated || !rawAddress) {
      if (pollingRef.current) clearInterval(pollingRef.current)
      return
    }
    pollingRef.current = setInterval(() => fetchAllState(rawAddress), 10000)
    return () => clearInterval(pollingRef.current)
  }, [authenticated, rawAddress, fetchAllState])

  // Contract event listeners
  useEffect(() => {
    if (!rawAddress) return

    const onVaultEvent = () => fetchUserState(rawAddress)
    const onSafeEvent = () => fetchSafeAddressState(rawAddress)
    const onAllEvent = () => fetchAllState(rawAddress)

    readContract.on('Deposited', onVaultEvent)
    readContract.on('WithdrawalRequested', onVaultEvent)
    readContract.on('WithdrawalExecuted', onVaultEvent)
    readContract.on('WithdrawalCancelled', onVaultEvent)
    readContract.on('EmergencyLockActivated', onVaultEvent)
    readContract.on('SafeAddressSet', onSafeEvent)
    readContract.on('SafeAddressChangeRequested', onSafeEvent)
    readContract.on('SafeAddressChangeConfirmed', onSafeEvent)
    readContract.on('SafeAddressChangeCancelled', onSafeEvent)
    readContract.on('EmergencyWithdrawToSafe', onAllEvent)

    return () => {
      readContract.off('Deposited', onVaultEvent)
      readContract.off('WithdrawalRequested', onVaultEvent)
      readContract.off('WithdrawalExecuted', onVaultEvent)
      readContract.off('WithdrawalCancelled', onVaultEvent)
      readContract.off('EmergencyLockActivated', onVaultEvent)
      readContract.off('SafeAddressSet', onSafeEvent)
      readContract.off('SafeAddressChangeRequested', onSafeEvent)
      readContract.off('SafeAddressChangeConfirmed', onSafeEvent)
      readContract.off('SafeAddressChangeCancelled', onSafeEvent)
      readContract.off('EmergencyWithdrawToSafe', onAllEvent)
    }
  }, [rawAddress, fetchUserState, fetchSafeAddressState, fetchAllState])

  const isEmergencyLocked = useCallback(() => {
    if (!state.emergencyLock) return false
    return Date.now() < state.emergencyLock.unlockTimestamp.getTime()
  }, [state.emergencyLock])

  const connectWallet = useCallback(() => login(), [login])
  const disconnectWallet = useCallback(() => logout(), [logout])

  const deposit = useCallback(async (amount) => {
    const signerContract = await getSignerContract()
    const tx = await signerContract.deposit({ value: ethers.parseEther(String(amount)) })
    await tx.wait()
    await fetchUserState(rawAddress)
  }, [getSignerContract, fetchUserState, rawAddress])

  const withdraw = useCallback(async (amount) => {
    const signerContract = await getSignerContract()
    const tx = await signerContract.withdraw(ethers.parseEther(String(amount)))
    await tx.wait()
    await fetchUserState(rawAddress)
  }, [getSignerContract, fetchUserState, rawAddress])

  const executeWithdraw = useCallback(async () => {
    const signerContract = await getSignerContract()
    const tx = await signerContract.executeWithdraw()
    await tx.wait()
    await fetchUserState(rawAddress)
  }, [getSignerContract, fetchUserState, rawAddress])

  const cancelWithdraw = useCallback(async () => {
    const signerContract = await getSignerContract()
    const tx = await signerContract.cancelWithdraw()
    await tx.wait()
    await fetchUserState(rawAddress)
  }, [getSignerContract, fetchUserState, rawAddress])

  // durationSeconds: 3600 = 1h, 21600 = 6h, 86400 = 24h, 604800 = 7d, 2592000 = 30d
  const activateEmergencyLock = useCallback(async (durationSeconds) => {
    const signerContract = await getSignerContract()
    const tx = await signerContract.emergencyLock(durationSeconds)
    await tx.wait()
    await fetchUserState(rawAddress)
  }, [getSignerContract, fetchUserState, rawAddress])

  // Safe address — first time set
  const requestSafeAddress = useCallback(async (address) => {
    const signerContract = await getSignerContract()
    if (!safeState.safeAddress) {
      const tx = await signerContract.setSafeAddress(address)
      await tx.wait()
    } else {
      const tx = await signerContract.requestSafeAddressChange(address)
      await tx.wait()
    }
    await fetchSafeAddressState(rawAddress)
  }, [getSignerContract, safeState.safeAddress, fetchSafeAddressState, rawAddress])

  const confirmSafeAddress = useCallback(async () => {
    const signerContract = await getSignerContract()
    const tx = await signerContract.confirmSafeAddressChange()
    await tx.wait()
    await fetchSafeAddressState(rawAddress)
  }, [getSignerContract, fetchSafeAddressState, rawAddress])

  const cancelSafeAddressChange = useCallback(async () => {
    const signerContract = await getSignerContract()
    const tx = await signerContract.cancelSafeAddressChange()
    await tx.wait()
    await fetchSafeAddressState(rawAddress)
  }, [getSignerContract, fetchSafeAddressState, rawAddress])

  const withdrawToSafeAddress = useCallback(async () => {
    const signerContract = await getSignerContract()
    const tx = await signerContract.withdrawToSafe()
    await tx.wait()
    await fetchAllState(rawAddress)
  }, [getSignerContract, fetchAllState, rawAddress])

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
    safeAddress: safeState.safeAddress,
    pendingSafeAddress: safeState.pendingSafeAddress,
    requestSafeAddress,
    confirmSafeAddress,
    cancelSafeAddressChange,
    withdrawToSafeAddress,
    refreshState: () => fetchAllState(rawAddress),
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
