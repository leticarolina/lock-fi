import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react'
import { usePrivy, useWallets, useLogout } from '@privy-io/react-auth'
import { ethers } from 'ethers'
import LockFiABI from '../LockFiABI.json'

const VaultContext = createContext(null)

const CONTRACT_ADDRESS = '0x31b36930BdFe07f4366379De4CFeAEF528Ce8e70'
const RPC_URL = 'https://testnet-rpc.monad.xyz'

const provider = new ethers.JsonRpcProvider(RPC_URL)
const readContract = new ethers.Contract(CONTRACT_ADDRESS, LockFiABI, provider)

const INITIAL_STATE = {
  vaultBalance: 0,
  instantWithdrawLimit: 0,
  pendingWithdrawal: null,
  emergencyLock: null,
  withdrawBlockedPostLock: false,
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
  const pollingRef = useRef(null)

  // Get ethers signer from Privy wallet
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

  // Fetch user state from contract using getUserState()
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
        const lockDuration = Number(await readContract.LOCK_DURATION())
        const unlockAt = new Date(Date.now() + remainingSeconds * 1000)
        emergencyLock = {
          unlockTimestamp: unlockAt,
          activatedAt: new Date(unlockAt.getTime() - lockDuration * 1000),
          duration: lockDuration,
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

  // Fetch on wallet connect/change
  useEffect(() => {
    if (authenticated && rawAddress) {
      fetchUserState(rawAddress)
    } else {
      setState(INITIAL_STATE)
    }
  }, [authenticated, rawAddress, fetchUserState])

  // Poll every 10 seconds
  useEffect(() => {
    if (!authenticated || !rawAddress) {
      if (pollingRef.current) clearInterval(pollingRef.current)
      return
    }
    pollingRef.current = setInterval(() => fetchUserState(rawAddress), 10000)
    return () => clearInterval(pollingRef.current)
  }, [authenticated, rawAddress, fetchUserState])

  // Contract event listeners — refetch on any relevant event
  useEffect(() => {
    if (!rawAddress) return

    const onEvent = () => fetchUserState(rawAddress)

    readContract.on('Deposited', onEvent)
    readContract.on('WithdrawalRequested', onEvent)
    readContract.on('WithdrawalExecuted', onEvent)
    readContract.on('WithdrawalCancelled', onEvent)
    readContract.on('EmergencyLockActivated', onEvent)

    return () => {
      readContract.off('Deposited', onEvent)
      readContract.off('WithdrawalRequested', onEvent)
      readContract.off('WithdrawalExecuted', onEvent)
      readContract.off('WithdrawalCancelled', onEvent)
      readContract.off('EmergencyLockActivated', onEvent)
    }
  }, [rawAddress, fetchUserState])

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

  const activateEmergencyLock = useCallback(async () => {
    const signerContract = await getSignerContract()
    const tx = await signerContract.emergencyLock()
    await tx.wait()
    await fetchUserState(rawAddress)
  }, [getSignerContract, fetchUserState, rawAddress])

  // Lock expires automatically on-chain; no manual deactivation
  const deactivateEmergencyLock = useCallback(() => {}, [])

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
    refreshState: () => fetchUserState(rawAddress),
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
