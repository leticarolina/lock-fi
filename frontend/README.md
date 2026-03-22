# LockFi — Secure Withdrawal Protocol

A Web3 security protocol frontend built with **React + Tailwind CSS**.

![LockFi](https://img.shields.io/badge/LockFi-Protocol-00e5a0?style=for-the-badge)

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open in browser
# → http://localhost:5173
```

## Project Structure

```
lockfi/
├── public/
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx        # Main dashboard (Mode A & B)
│   │   ├── DepositSection.jsx   # Deposit ETH input + button
│   │   ├── Header.jsx           # Top bar with wallet info
│   │   ├── LandingScreen.jsx    # Pre-connect landing page
│   │   ├── PendingCard.jsx      # Pending withdrawal card + countdown
│   │   ├── ShieldIcon.jsx       # SVG shield logo
│   │   ├── VaultInfo.jsx        # Balance + instant limit display
│   │   └── WithdrawSection.jsx  # Withdraw input + risk warnings
│   ├── context/
│   │   └── VaultContext.jsx     # Global state (mock data + logic)
│   ├── hooks/
│   │   └── useCountdown.js      # Countdown timer hook
│   ├── App.jsx                  # Root component (routing)
│   ├── index.css                # Tailwind + custom styles
│   └── main.jsx                 # Entry point
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
```

## UI States

| State | What Shows |
|-------|-----------|
| Wallet NOT connected | Landing screen with Connect Wallet button |
| Connected, no pending | Dashboard Mode A — balance, deposit, withdraw |
| Connected, pending exists | Dashboard Mode B — balance, deposit, pending card (withdraw disabled) |

## Mock Behavior

The app uses mock data for now. Smart contract integration comes later.

- **Deposits**: Always instant, increases balance
- **Withdrawals ≤ 60%**: Instant, decreases balance
- **Withdrawals > 60%**: Flagged → creates pending withdrawal with 60s countdown
- **Execute**: Enabled after countdown ends
- **Cancel**: Always available, returns funds to balance

## Smart Contract Integration (Next Phase)

Replace mock logic in `VaultContext.jsx` with real calls:

```
deposit()           → DepositSection button
withdraw(amount)    → WithdrawSection button
executeWithdraw()   → PendingCard execute button
cancelWithdraw()    → PendingCard cancel button
```

Events to listen:
```
Deposited
WithdrawalRequested
WithdrawalExecuted
WithdrawalCancelled
```

## Tech Stack

- React 18
- Tailwind CSS 3.4
- Vite 5
- IBM Plex Mono + Syne fonts (Google Fonts)
