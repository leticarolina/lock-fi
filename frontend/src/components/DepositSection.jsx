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
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-vault-accent/10 flex items-center justify-center">
          <svg className="w-4 h-4 text-vault-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <polyline points="19 12 12 19 5 12" />
          </svg>
        </div>
        <h3 className="font-display font-600 text-sm text-vault-text tracking-wide">
          Deposit MON
        </h3>
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
