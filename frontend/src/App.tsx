import { useEffect, useState } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi'
import { decodeEventLog, formatEther, parseEther, zeroAddress, type TransactionReceipt } from 'viem'
import { watcherAbi, watcherContract } from './lib/contract'

// Matches the ABI's getUserState output order exactly:
// balance, instantLimit, hasPending, pendingAmount, remainingPendingTime, isLocked, remainingLockTime
type UserState = readonly [bigint, bigint, boolean, bigint, bigint, boolean, bigint]

// Seconds -> "1d 2h 30m" style string. Good enough for status text, not a
// polished countdown widget.
function formatDuration(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds) || totalSeconds <= 0) return '0s'
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = Math.floor(totalSeconds % 60)
  const parts: string[] = []
  if (days) parts.push(`${days}d`)
  if (hours) parts.push(`${hours}h`)
  if (minutes) parts.push(`${minutes}m`)
  if (!days && !hours && seconds) parts.push(`${seconds}s`)
  return parts.length ? parts.join(' ') : '0s'
}

// Wei -> a rounded, human-readable ETH string (default 6 decimals, trailing
// zeros trimmed). Display only — inputs still parse with parseEther as wei.
function formatEth(value: bigint | undefined, maxDecimals = 6): string {
  if (value === undefined) return '—'
  return Number(formatEther(value)).toLocaleString(undefined, { maximumFractionDigits: maxDecimals })
}

type DurationUnit = 'minutes' | 'hours' | 'days'
const DURATION_UNIT_SECONDS: Record<DurationUnit, number> = { minutes: 60, hours: 3600, days: 86400 }

// "0x0944...06C6" — first 6 chars + last 4. Display only; pair with a
// title="" of the full address so it's still verifiable on hover.
function maskAddress(address: string | undefined): string {
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

/* ---------------------------------------------------------------------- */
/* Dashboard tab — UserStateDisplay, DepositForm, WithdrawForm            */
/* Logic unchanged from the previous step, styling only.                  */
/* ---------------------------------------------------------------------- */

function UserStateDisplay({ data }: { data: UserState | undefined }) {
  if (!data) return <p className="text-sm text-cloud/50">No data returned from getUserState.</p>

  const [balance, instantLimit, hasPending, pendingAmount, remainingPendingTime, isLocked, remainingLockTime] = data

  return (
    <div className="space-y-1 rounded-lg border border-cloud/10 bg-cloud/5 px-4 py-3 font-mono text-sm text-cloud/80">
      <p>balance: {formatEth(balance)} ETH</p>
      <p>instantLimit: {formatEth(instantLimit)} ETH</p>
      <p>hasPending: {String(hasPending)}</p>
      <p>pendingAmount: {formatEth(pendingAmount)} ETH</p>
      <p>remainingPendingTime: {String(remainingPendingTime)}</p>
      <p>isLocked: {String(isLocked)}</p>
      <p>remainingLockTime: {String(remainingLockTime)}</p>
    </div>
  )
}

function DepositForm({ onConfirmed }: { onConfirmed: () => void }) {
  const [amount, setAmount] = useState('')

  const { writeContract, data: hash, isPending: isWaitingForWallet, error: writeError } = useWriteContract()

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    isError: isReceiptError,
  } = useWaitForTransactionReceipt({ hash })

  useEffect(() => {
    if (isConfirmed) {
      onConfirmed()
      setAmount('')
    }
  }, [isConfirmed, onConfirmed])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    writeContract({
      ...watcherContract,
      functionName: 'deposit',
      value: parseEther(amount),
    })
  }

  let status = ''
  if (isWaitingForWallet) status = 'waiting for wallet confirmation'
  else if (isConfirming) status = 'transaction pending'
  else if (isConfirmed) status = 'confirmed'
  else if (isReceiptError || writeError) status = 'failed'

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="ETH amount"
          className="flex-1 rounded border border-cloud/20 bg-cloud/5 px-3 py-2 text-sm text-cloud placeholder:text-cloud/40"
        />
        <button
          type="submit"
          disabled={isWaitingForWallet || isConfirming}
          className="rounded bg-teal px-4 py-2 text-sm font-medium text-cloud disabled:opacity-40"
        >
          Deposit
        </button>
      </div>
      {status && <p className="text-sm text-cloud/70">status: {status}</p>}
      {hash && <p className="break-all text-xs text-cloud/50">tx hash: {hash}</p>}
      {writeError && <p className="text-xs text-red">error: {writeError.message}</p>}
    </form>
  )
}

// withdraw() doesn't tell us which path was taken — that's only known by checking
// which event the tx receipt emitted.
type WithdrawOutcome = { kind: 'instant' } | { kind: 'queued'; unlockTime: bigint }

// Decode a tx receipt's logs against the Watcher ABI to find which of the two
// withdraw outcomes happened for this address.
function findWithdrawOutcome(
  receipt: TransactionReceipt | undefined,
  address: `0x${string}`,
): WithdrawOutcome | null {
  if (!receipt) return null

  for (const log of receipt.logs) {
    let decoded
    try {
      decoded = decodeEventLog({ abi: watcherAbi, data: log.data, topics: log.topics })
    } catch {
      continue // not an event this ABI recognizes, skip
    }

    if (decoded.eventName === 'WithdrawalExecuted') {
      const args = decoded.args as unknown as { user: `0x${string}`; amount: bigint }
      if (args.user.toLowerCase() === address.toLowerCase()) {
        return { kind: 'instant' }
      }
    } else if (decoded.eventName === 'WithdrawalRequested') {
      const args = decoded.args as unknown as {
        user: `0x${string}`
        amount: bigint
        unlockTime: bigint
        requestTime: bigint
      }
      if (args.user.toLowerCase() === address.toLowerCase()) {
        return { kind: 'queued', unlockTime: args.unlockTime }
      }
    }
  }

  return null
}

function WithdrawForm({
  address,
  instantLimit,
  isLocked,
  lockCountdown,
  onConfirmed,
}: {
  address: `0x${string}`
  instantLimit: bigint | undefined
  isLocked: boolean | undefined
  lockCountdown: number | undefined
  onConfirmed: () => void
}) {
  const [amount, setAmount] = useState('')

  const { writeContract, data: hash, isPending: isWaitingForWallet, error: writeError } = useWriteContract()

  const {
    data: receipt,
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    isError: isReceiptError,
  } = useWaitForTransactionReceipt({ hash })

  // Pure function of receipt/address — derived directly during render, no
  // effect or memoization needed for a handful of logs.
  const outcome = findWithdrawOutcome(receipt, address)

  useEffect(() => {
    if (isConfirmed) {
      onConfirmed()
      setAmount('')
    }
  }, [isConfirmed, onConfirmed])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    writeContract({
      ...watcherContract,
      functionName: 'withdraw',
      args: [parseEther(amount)],
    })
  }

  let status = ''
  if (isWaitingForWallet) status = 'waiting for wallet confirmation'
  else if (isConfirming) status = 'transaction pending'
  else if (isConfirmed) status = 'confirmed'
  else if (isReceiptError || writeError) status = 'failed'

  // Hint only, not a guarantee: this only reflects the 60%-of-balance instant
  // limit. Actual outcome also depends on withdrawal history rules (e.g. an
  // existing pending withdrawal) that this preview can't see.
  let preview: string | null = null
  if (amount && instantLimit !== undefined) {
    try {
      const parsedAmount = parseEther(amount)
      preview =
        parsedAmount < instantLimit
          ? `up to ${formatEth(instantLimit)} ETH is instant under normal conditions (this is a hint based on the 60%-of-balance rule only — actual outcome also depends on withdrawal history rules this preview can't predict).`
          : `this amount will likely be queued (at or over the ${formatEth(instantLimit)} ETH instant limit) — this is a hint based on the 60%-of-balance rule only, not a guarantee.`
    } catch {
      preview = null
    }
  }

  // withdraw() reverts with EmergencyLockOngoing while locked — block it
  // client-side too, with the reason visible instead of a silent revert.
  const lockedReason = isLocked
    ? `vault is in Containment Mode — unlocks in ${lockCountdown !== undefined ? formatDuration(lockCountdown) : '…'}`
    : null

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="ETH amount"
          className="flex-1 rounded border border-cloud/20 bg-cloud/5 px-3 py-2 text-sm text-cloud placeholder:text-cloud/40"
        />
        <button
          type="submit"
          disabled={isWaitingForWallet || isConfirming || Boolean(isLocked)}
          className="rounded bg-teal px-4 py-2 text-sm font-medium text-cloud disabled:opacity-40"
        >
          Withdraw
        </button>
      </div>
      {lockedReason && <p className="text-xs text-red">{lockedReason}</p>}
      {preview && <p className="text-xs text-cloud/60">{preview}</p>}
      {status && <p className="text-sm text-cloud/70">status: {status}</p>}
      {hash && <p className="break-all text-xs text-cloud/50">tx hash: {hash}</p>}
      {writeError && <p className="text-xs text-red">error: {writeError.message}</p>}
      {outcome?.kind === 'instant' && <p className="text-sm text-teal">Sent instantly</p>}
      {outcome?.kind === 'queued' && (
        <p className="text-sm text-amber">
          Queued — unlocks at {new Date(Number(outcome.unlockTime) * 1000).toLocaleString()}
        </p>
      )}
    </form>
  )
}

// Cancel Withdrawal + Authorize Withdrawal — two independent write flows,
// each with its own wallet→pending→confirmed/failed lifecycle. Unlike
// withdraw() (which can resolve two different ways, requiring receipt-log
// decoding), executeWithdraw() either succeeds or reverts — isConfirmed
// alone tells us it worked.
function SecurityQueueSection({
  hasPending,
  pendingAmount,
  remainingPendingTime,
  isLocked,
  lockCountdown,
  onConfirmed,
}: {
  hasPending: boolean | undefined
  pendingAmount: bigint | undefined
  remainingPendingTime: bigint | undefined
  isLocked: boolean | undefined
  lockCountdown: number | undefined
  onConfirmed: () => void
}) {
  // Reuses the same live countdown the RecoveryTab pending-change view uses.
  const countdown = useCountdownSeconds(hasPending ? remainingPendingTime : undefined)
  const isReady = countdown !== undefined && countdown <= 0

  const {
    writeContract: writeCancel,
    data: cancelHash,
    isPending: isCancelWaitingForWallet,
    error: cancelError,
  } = useWriteContract()
  const {
    isLoading: isCancelConfirming,
    isSuccess: isCancelConfirmed,
    isError: isCancelReceiptError,
  } = useWaitForTransactionReceipt({ hash: cancelHash })

  useEffect(() => {
    if (isCancelConfirmed) onConfirmed()
  }, [isCancelConfirmed, onConfirmed])

  let cancelStatus = ''
  if (isCancelWaitingForWallet) cancelStatus = 'waiting for wallet confirmation'
  else if (isCancelConfirming) cancelStatus = 'transaction pending'
  else if (isCancelConfirmed) cancelStatus = 'confirmed'
  else if (isCancelReceiptError || cancelError) cancelStatus = 'failed'

  const handleCancel = () => {
    writeCancel({ ...watcherContract, functionName: 'cancelWithdraw', args: [] })
  }

  const {
    writeContract: writeExecute,
    data: executeHash,
    isPending: isExecuteWaitingForWallet,
    error: executeError,
  } = useWriteContract()
  const {
    isLoading: isExecuteConfirming,
    isSuccess: isExecuteConfirmed,
    isError: isExecuteReceiptError,
  } = useWaitForTransactionReceipt({ hash: executeHash })

  useEffect(() => {
    if (isExecuteConfirmed) onConfirmed()
  }, [isExecuteConfirmed, onConfirmed])

  let executeStatus = ''
  if (isExecuteWaitingForWallet) executeStatus = 'waiting for wallet confirmation'
  else if (isExecuteConfirming) executeStatus = 'transaction pending'
  else if (isExecuteConfirmed) executeStatus = 'confirmed'
  else if (isExecuteReceiptError || executeError) executeStatus = 'failed'

  const handleExecute = () => {
    // No Ledger signer is registered for anyone yet, so the contract skips
    // signature verification — "0x" is the correct call until that's built.
    writeExecute({ ...watcherContract, functionName: 'executeWithdraw', args: ['0x'] })
  }

  const isCancelBusy = isCancelWaitingForWallet || isCancelConfirming
  const isExecuteBusy = isExecuteWaitingForWallet || isExecuteConfirming
  const countdownText = countdown !== undefined ? formatDuration(countdown) : '…'

  // executeWithdraw() reverts with EmergencyLockOngoing while locked — block
  // it client-side too, with the reason visible next to the button. Cancel
  // is never blocked by the lock per the contract, so it's unaffected.
  const executeDisabled = !isReady || isExecuteBusy || Boolean(isLocked)
  const executeDisabledReason = isLocked
    ? `vault is in Containment Mode — unlocks in ${lockCountdown !== undefined ? formatDuration(lockCountdown) : '…'}`
    : !isReady
      ? `unlocks in ${countdownText}`
      : null

  return (
    <div className="space-y-2">
      <h3 className="font-manrope text-sm font-semibold text-cloud/80">Security Queue</h3>
      <div
        className={`space-y-3 rounded-lg border px-4 py-3 text-sm ${
          hasPending ? 'border-amber/40 bg-amber/10 text-amber' : 'border-teal/40 bg-teal/10 text-teal'
        }`}
      >
        {hasPending ? (
          <>
            <div>
              <p className="font-manrope font-semibold">Pending</p>
              <p>{formatEth(pendingAmount)} ETH queued</p>
              <p>{isReady ? 'ready to authorize' : `unlocks in ${countdownText}`}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isCancelBusy}
                className="rounded border border-cloud/20 bg-cloud/10 px-4 py-2 text-sm font-medium text-cloud disabled:opacity-40"
              >
                Cancel Withdrawal
              </button>
              <button
                type="button"
                onClick={handleExecute}
                disabled={executeDisabled}
                className="rounded bg-teal px-4 py-2 text-sm font-medium text-cloud disabled:opacity-40"
              >
                Authorize Withdrawal
              </button>
              {executeDisabledReason && <span className="text-xs opacity-80">{executeDisabledReason}</span>}
            </div>

            {cancelStatus && <p className="text-xs opacity-90">cancel status: {cancelStatus}</p>}
            {cancelHash && <p className="break-all text-xs opacity-70">cancel tx hash: {cancelHash}</p>}
            {cancelError && <p className="text-xs text-red">cancel error: {cancelError.message}</p>}

            {executeStatus && <p className="text-xs opacity-90">authorize status: {executeStatus}</p>}
            {executeHash && <p className="break-all text-xs opacity-70">authorize tx hash: {executeHash}</p>}
            {executeError && <p className="text-xs text-red">authorize error: {executeError.message}</p>}
          </>
        ) : (
          <p className="font-manrope font-semibold">No pending withdrawal</p>
        )}
      </div>
    </div>
  )
}

function DashboardTab({
  address,
  userState,
  isLoading,
  isError,
  error,
  refetch,
  setActiveTab,
}: {
  address: `0x${string}`
  userState: UserState | undefined
  isLoading: boolean
  isError: boolean
  error: Error | null | undefined
  refetch: () => void
  setActiveTab: (tab: TabId) => void
}) {
  // Dashboard content unmounts/remounts when the tab is switched away and
  // back (App only keeps the getUserState *read* lifted, not this view) —
  // refetch on activation so a queue state that changed while this tab was
  // hidden is reflected immediately rather than waiting on a stale cache hit.
  useEffect(() => {
    refetch()
  }, [refetch])

  const hasPending = userState?.[2]
  const pendingAmount = userState?.[3]
  const remainingPendingTime = userState?.[4]
  const isLocked = userState?.[5]
  const remainingLockTime = userState?.[6]

  // Shared with WithdrawForm/SecurityQueueSection below so all three show
  // the exact same ticking number rather than three independently-anchored
  // (and thus slightly drifting) countdowns.
  const lockCountdown = useCountdownSeconds(isLocked ? remainingLockTime : undefined)

  return (
    <div className="max-w-xl space-y-8">
      {isLocked && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-red/40 bg-red/10 px-4 py-3 text-sm text-red">
          <div>
            <p className="font-manrope font-semibold">Containment Mode is ACTIVE</p>
            <p>Withdrawals are frozen — unlocks in {lockCountdown !== undefined ? formatDuration(lockCountdown) : '…'}</p>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('containment')}
            className="rounded border border-red/40 bg-red/10 px-3 py-1.5 text-xs font-medium text-red hover:bg-red/20"
          >
            View Containment Mode
          </button>
        </div>
      )}

      <div className="space-y-2">
        <h2 className="font-manrope text-lg font-semibold">Dashboard</h2>
        {isLoading && <p className="text-sm text-cloud/70">Loading getUserState...</p>}
        {isError && <p className="text-sm text-red">Error calling getUserState: {error?.message}</p>}
        <UserStateDisplay data={userState} />
      </div>

      <SecurityQueueSection
        hasPending={hasPending}
        pendingAmount={pendingAmount}
        remainingPendingTime={remainingPendingTime}
        isLocked={isLocked}
        lockCountdown={lockCountdown}
        onConfirmed={refetch}
      />

      <div className="grid gap-8 sm:grid-cols-2">
        <div className="space-y-2">
          <h3 className="font-manrope text-sm font-semibold text-cloud/80">Deposit</h3>
          <DepositForm onConfirmed={refetch} />
        </div>
        <div className="space-y-2">
          <h3 className="font-manrope text-sm font-semibold text-cloud/80">Withdraw</h3>
          <WithdrawForm
            address={address}
            instantLimit={userState?.[1]}
            isLocked={isLocked}
            lockCountdown={lockCountdown}
            onConfirmed={refetch}
          />
        </div>
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------------- */
/* Containment Mode tab — emergencyLock flow                              */
/* ---------------------------------------------------------------------- */

function ContainmentModeTab({
  address,
  isLocked,
  remainingLockTime,
  onConfirmed,
}: {
  address: `0x${string}`
  isLocked: boolean | undefined
  remainingLockTime: bigint | undefined
  onConfirmed: () => void
}) {
  void address // not needed for reads/writes here (msg.sender is implicit), kept for symmetry with other tabs

  // Live-ticking countdown, independent of the next getUserState refetch.
  const lockCountdown = useCountdownSeconds(isLocked ? remainingLockTime : undefined)

  const { data: minLockDurationData } = useReadContract({
    ...watcherContract,
    functionName: 'MIN_LOCK_DURATION',
  })
  const { data: maxLockDurationData } = useReadContract({
    ...watcherContract,
    functionName: 'MAX_LOCK_DURATION',
  })
  const minLockDuration = minLockDurationData as bigint | undefined
  const maxLockDuration = maxLockDurationData as bigint | undefined

  const [amountInput, setAmountInput] = useState('')
  const [unit, setUnit] = useState<DurationUnit>('hours')

  // Slider bounds in whichever unit is currently selected, recomputed
  // whenever the unit or the live MIN_LOCK_DURATION/MAX_LOCK_DURATION change.
  const sliderMin =
    minLockDuration !== undefined ? Math.ceil(Number(minLockDuration) / DURATION_UNIT_SECONDS[unit]) : undefined
  const sliderMax =
    maxLockDuration !== undefined
      ? Math.max(sliderMin ?? 0, Math.floor(Number(maxLockDuration) / DURATION_UNIT_SECONDS[unit]))
      : undefined

  // Default to the minimum allowed value whenever the unit changes (a raw
  // number doesn't carry over meaningfully across units — "5" means
  // something very different as hours vs. days) or once bounds first load.
  useEffect(() => {
    if (sliderMin !== undefined) setAmountInput(String(sliderMin))
  }, [unit, sliderMin])

  const { writeContract, data: hash, isPending: isWaitingForWallet, error: writeError } = useWriteContract()

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    isError: isReceiptError,
  } = useWaitForTransactionReceipt({ hash })

  useEffect(() => {
    if (isConfirmed) {
      onConfirmed()
      setAmountInput('')
    }
  }, [isConfirmed, onConfirmed])

  let status = ''
  if (isWaitingForWallet) status = 'waiting for wallet confirmation'
  else if (isConfirming) status = 'transaction pending'
  else if (isConfirmed) status = 'confirmed'
  else if (isReceiptError || writeError) status = 'failed'

  const parsedAmount = Number(amountInput)
  const durationSeconds =
    amountInput.trim() && Number.isFinite(parsedAmount) && parsedAmount > 0
      ? BigInt(Math.round(parsedAmount * DURATION_UNIT_SECONDS[unit]))
      : undefined

  let validationError: string | null = null
  if (durationSeconds !== undefined && minLockDuration !== undefined && maxLockDuration !== undefined) {
    if (durationSeconds < minLockDuration) {
      validationError = `Duration must be at least ${formatDuration(Number(minLockDuration))}.`
    } else if (durationSeconds > maxLockDuration) {
      validationError = `Duration must be at most ${formatDuration(Number(maxLockDuration))}.`
    }
  }

  const canSubmit = durationSeconds !== undefined && !validationError && !isWaitingForWallet && !isConfirming

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (durationSeconds === undefined) return
    writeContract({
      ...watcherContract,
      functionName: 'emergencyLock',
      args: [durationSeconds],
    })
  }

  // Anchor "now" via an effect rather than calling Date.now() during render
  // (an impure call — render must stay a pure function of props/state).
  const [lockAnchorNow, setLockAnchorNow] = useState<number | null>(null)
  useEffect(() => {
    setLockAnchorNow(remainingLockTime !== undefined ? Date.now() : null)
  }, [remainingLockTime])

  const unlockDate =
    isLocked && remainingLockTime !== undefined && lockAnchorNow !== null
      ? new Date(lockAnchorNow + Number(remainingLockTime) * 1000).toLocaleString()
      : null

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h2 className="font-manrope text-lg font-semibold">Containment Mode</h2>
        <p className="text-sm text-cloud/70">
          Freeze all withdrawals for a fixed duration if you suspect your wallet has been compromised.
        </p>
      </div>

      <div
        className={`rounded-lg border px-4 py-3 ${
          isLocked ? 'border-red/40 bg-red/10 text-red' : 'border-teal/40 bg-teal/10 text-teal'
        }`}
      >
        {isLocked ? (
          <>
            <p className="font-manrope font-semibold">ACTIVE</p>
            <p className="text-sm">Unlocks at {unlockDate}</p>
            <p className="text-xs opacity-80">
              remaining: {lockCountdown !== undefined ? formatDuration(lockCountdown) : '…'}
            </p>
          </>
        ) : (
          <p className="font-manrope font-semibold">Inactive</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="font-manrope text-sm font-semibold text-cloud">
              {amountInput || sliderMin} {unit}
            </span>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value as DurationUnit)}
              className="rounded border border-cloud/20 bg-cloud/5 px-3 py-2 text-sm text-cloud"
            >
              <option value="minutes">minutes</option>
              <option value="hours">hours</option>
              <option value="days">days</option>
            </select>
          </div>

          {sliderMin !== undefined && sliderMax !== undefined ? (
            <input
              type="range"
              min={sliderMin}
              max={sliderMax}
              step={1}
              value={amountInput || sliderMin}
              onChange={(e) => setAmountInput(e.target.value)}
              className="w-full accent-red"
            />
          ) : (
            <p className="text-sm text-cloud/50">Loading duration limits…</p>
          )}
        </div>

        {minLockDuration !== undefined && maxLockDuration !== undefined && (
          <p className="text-xs text-cloud/50">
            Allowed range: {formatDuration(Number(minLockDuration))} – {formatDuration(Number(maxLockDuration))}
          </p>
        )}
        {validationError && <p className="text-xs text-red">{validationError}</p>}

        <p className="rounded border border-amber/30 bg-amber/10 px-3 py-2 text-xs text-amber">
          Activating Containment Mode auto-cancels any pending Security Queue withdrawal and refunds it to your
          vault balance.
        </p>

        <button
          type="submit"
          disabled={!canSubmit}
          className="rounded bg-red px-4 py-2 text-sm font-medium text-cloud disabled:opacity-40"
        >
          Activate Containment Mode
        </button>

        {status && <p className="text-sm text-cloud/70">status: {status}</p>}
        {hash && <p className="break-all text-xs text-cloud/50">tx hash: {hash}</p>}
        {writeError && <p className="text-xs text-red">error: {writeError.message}</p>}
      </form>
    </div>
  )
}

/* ---------------------------------------------------------------------- */
/* Trusted Recovery Address tab                                           */
/* ---------------------------------------------------------------------- */

// Ticks down to zero once per second from an absolute target timestamp,
// captured once (Date.now() + remainingSeconds * 1000) whenever a fresh
// value comes in from a read. From there it counts down on its own clock,
// independent of the read's refetch cadence — the number moves live in the
// UI instead of only jumping on the next refetch. "Now" is tracked as state
// (updated by an effect/interval) rather than read via Date.now() during
// render — the passage of time is exactly the kind of external system an
// effect exists to synchronize with.
function useCountdownSeconds(remainingSeconds: bigint | undefined): number | undefined {
  const [target, setTarget] = useState<number | null>(null)
  const [now, setNow] = useState<number | null>(null)

  useEffect(() => {
    if (remainingSeconds === undefined) {
      setTarget(null)
      setNow(null)
      return
    }
    const start = Date.now()
    setTarget(start + Number(remainingSeconds) * 1000)
    setNow(start)
  }, [remainingSeconds])

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  if (target === null || now === null) return undefined
  return Math.max(0, Math.round((target - now) / 1000))
}

function RecoveryTab({ address }: { address: `0x${string}` }) {
  const { data: safeAddressData, refetch: refetchSafeAddress } = useReadContract({
    ...watcherContract,
    functionName: 'safeAddress',
    args: [address],
  })
  const { data: pendingChangeData, refetch: refetchPendingChange } = useReadContract({
    ...watcherContract,
    functionName: 'getPendingSafeChange',
    args: [address],
  })

  const currentSafe = safeAddressData as `0x${string}` | undefined
  const pending = pendingChangeData as readonly [`0x${string}`, bigint] | undefined
  const pendingSafe = pending?.[0]
  const pendingRemaining = pending?.[1]

  const hasPendingChange = pendingSafe !== undefined && pendingSafe !== zeroAddress
  const hasSafeSet = currentSafe !== undefined && currentSafe !== zeroAddress

  const countdown = useCountdownSeconds(hasPendingChange ? pendingRemaining : undefined)

  const [inputAddress, setInputAddress] = useState('')

  const { writeContract, data: hash, isPending: isWaitingForWallet, error: writeError } = useWriteContract()

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    isError: isReceiptError,
  } = useWaitForTransactionReceipt({ hash })

  useEffect(() => {
    if (isConfirmed) {
      refetchSafeAddress()
      refetchPendingChange()
      setInputAddress('')
    }
  }, [isConfirmed, refetchSafeAddress, refetchPendingChange])

  let status = ''
  if (isWaitingForWallet) status = 'waiting for wallet confirmation'
  else if (isConfirming) status = 'transaction pending'
  else if (isConfirmed) status = 'confirmed'
  else if (isReceiptError || writeError) status = 'failed'

  const isValidAddress = /^0x[a-fA-F0-9]{40}$/.test(inputAddress)
  const isBusy = isWaitingForWallet || isConfirming

  const handleSet = (e: React.FormEvent) => {
    e.preventDefault()
    writeContract({ ...watcherContract, functionName: 'setSafeAddress', args: [inputAddress] })
  }

  const handleRequestChange = (e: React.FormEvent) => {
    e.preventDefault()
    writeContract({ ...watcherContract, functionName: 'requestSafeAddressChange', args: [inputAddress] })
  }

  const handleConfirm = () => {
    writeContract({ ...watcherContract, functionName: 'confirmSafeAddressChange', args: [] })
  }

  const handleCancel = () => {
    writeContract({ ...watcherContract, functionName: 'cancelSafeAddressChange', args: [] })
  }

  const statusBlock = (
    <>
      {status && <p className="text-sm text-cloud/70">status: {status}</p>}
      {hash && <p className="break-all text-xs text-cloud/50">tx hash: {hash}</p>}
      {writeError && <p className="text-xs text-red">error: {writeError.message}</p>}
    </>
  )

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h2 className="font-manrope text-lg font-semibold">Trusted Recovery Address</h2>
        <p className="text-sm text-cloud/70">
          A backup address that can help recover your account. Changing it after the first time takes a 24-hour
          delay.
        </p>
      </div>

      {hasPendingChange ? (
        <div className="space-y-3">
          <p className="text-sm">
            Pending change to:{' '}
            <span className="font-mono" title={pendingSafe}>
              {maskAddress(pendingSafe)}
            </span>
          </p>
          <p className="text-sm text-amber">
            Unlocks in {countdown !== undefined ? formatDuration(countdown) : '…'}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleConfirm}
              disabled={countdown === undefined || countdown > 0 || isBusy}
              className="rounded bg-teal px-4 py-2 text-sm font-medium text-cloud disabled:opacity-40"
            >
              Confirm Change
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={isBusy}
              className="rounded border border-cloud/20 bg-cloud/10 px-4 py-2 text-sm font-medium text-cloud disabled:opacity-40"
            >
              Cancel Change
            </button>
          </div>
          {countdown !== undefined && countdown > 0 && (
            <p className="text-xs text-cloud/50">Confirm Change unlocks once the 24h delay finishes.</p>
          )}
          {statusBlock}
        </div>
      ) : hasSafeSet ? (
        <div className="space-y-3">
          <p className="text-sm">
            Current recovery address:{' '}
            <span className="font-mono" title={currentSafe}>
              {maskAddress(currentSafe)}
            </span>
          </p>
          <form onSubmit={handleRequestChange} className="flex gap-2">
            <input
              type="text"
              value={inputAddress}
              onChange={(e) => setInputAddress(e.target.value)}
              placeholder="0x..."
              className="flex-1 rounded border border-cloud/20 bg-cloud/5 px-3 py-2 font-mono text-sm text-cloud placeholder:text-cloud/40"
            />
            <button
              type="submit"
              disabled={!isValidAddress || isBusy}
              className="rounded bg-teal px-4 py-2 text-sm font-medium text-cloud disabled:opacity-40"
            >
              Request Change
            </button>
          </form>
          <p className="text-xs text-cloud/50">Changes take effect 24 hours after being requested.</p>
          {statusBlock}
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-cloud/70">No trusted recovery address set yet.</p>
          <form onSubmit={handleSet} className="flex gap-2">
            <input
              type="text"
              value={inputAddress}
              onChange={(e) => setInputAddress(e.target.value)}
              placeholder="0x..."
              className="flex-1 rounded border border-cloud/20 bg-cloud/5 px-3 py-2 font-mono text-sm text-cloud placeholder:text-cloud/40"
            />
            <button
              type="submit"
              disabled={!isValidAddress || isBusy}
              className="rounded bg-teal px-4 py-2 text-sm font-medium text-cloud disabled:opacity-40"
            >
              Set Trusted Recovery Address
            </button>
          </form>
          {statusBlock}
        </div>
      )}
    </div>
  )
}

/* ---------------------------------------------------------------------- */
/* App shell — tab bar + always-visible connect/status                    */
/* ---------------------------------------------------------------------- */

const TABS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'containment', label: 'Containment Mode' },
  { id: 'recovery', label: 'Trusted Recovery Address' },
] as const

type TabId = (typeof TABS)[number]['id']

function App() {
  const { address, isConnected } = useAccount()
  const [activeTab, setActiveTab] = useState<TabId>('dashboard')

  const { data, isLoading, isError, error, refetch } = useReadContract({
    ...watcherContract,
    functionName: 'getUserState',
    args: address ? [address] : undefined,
    query: { enabled: Boolean(address) },
  })

  const userState = data as UserState | undefined

  return (
    <div className="min-h-screen bg-navy font-inter text-cloud">
      <header className="flex items-center justify-between border-b border-cloud/10 px-6 py-4">
        <span className="font-manrope text-lg font-semibold tracking-tight">Watcher</span>
        <ConnectButton />
      </header>

      <div className="px-6 py-3 font-mono text-xs text-cloud/60">
        {isConnected && address ? <p>connected: {address}</p> : <p>not connected</p>}
      </div>

      <nav className="flex gap-1 border-b border-cloud/10 px-6 pb-3">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
              activeTab === tab.id ? 'bg-cloud font-medium text-navy' : 'text-cloud/50 hover:text-cloud/80'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main className="px-6 py-6">
        {!isConnected || !address ? (
          <p className="text-sm text-cloud/60">Connect a wallet to continue.</p>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <DashboardTab
                address={address}
                userState={userState}
                isLoading={isLoading}
                isError={isError}
                error={error}
                refetch={refetch}
                setActiveTab={setActiveTab}
              />
            )}
            {activeTab === 'containment' && (
              <ContainmentModeTab
                address={address}
                isLocked={userState?.[5]}
                remainingLockTime={userState?.[6]}
                onConfirmed={refetch}
              />
            )}
            {activeTab === 'recovery' && <RecoveryTab address={address} />}
          </>
        )}
      </main>
    </div>
  )
}

export default App
