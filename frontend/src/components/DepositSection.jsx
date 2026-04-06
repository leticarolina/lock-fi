import React, { useState } from 'react'
import { useVault } from '../context/VaultContext.jsx'

export default function DepositSection() {
  const { deposit } = useVault()
  const [amount, setAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleDeposit = async () => {
    if (!amount || parseFloat(amount) <= 0) return
    setIsLoading(true)
    try {
      await deposit(amount)
      setAmount('')
    } catch (err) {
      console.error('Deposit failed:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="card h-full flex flex-col">
      <div className="mb-5">
        <p className="font-body text-[10px] tracking-[0.2em] uppercase mb-1" style={{ color: '#ec632c' }}>// Action</p>
        <h3 className="font-display text-lg text-vault-text tracking-tight">Deposit MON</h3>
      </div>

      <div className="flex-1 flex flex-col justify-between gap-4">
        <div className="relative">
          <input
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="input-field pr-14"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-vault-muted text-xs font-body">
            MON
          </span>
        </div>

        <button
          onClick={handleDeposit}
          disabled={!amount || parseFloat(amount) <= 0 || isLoading}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.3" />
                <path d="M12 2C6.48 2 2 6.48 2 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              Processing…
            </>
          ) : (
            'Deposit'
          )}
        </button>
      </div>
    </div>
  )
}
