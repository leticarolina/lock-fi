import React, { useState } from 'react'
import { useVault } from './context/VaultContext.jsx'
import LandingScreen from './components/LandingScreen.jsx'
import Dashboard from './components/Dashboard.jsx'

export default function App() {
  const { isConnected, ready } = useVault()
  const [showVault, setShowVault] = useState(false)
  const [forceLanding, setForceLanding] = useState(false)

  const goHome = () => setForceLanding(true)
  const launch = () => { setShowVault(true); setForceLanding(false) }

  return (
    <div className="min-h-screen relative">
      {/* Noise overlay */}
      <div className="noise-overlay" />

      {/* Gradient blobs */}
      <div className="gradient-blob w-[600px] h-[600px] bg-vault-accent/5 top-[-200px] left-[-200px] fixed" />
      <div className="gradient-blob w-[500px] h-[500px] bg-vault-accent/3 bottom-[-150px] right-[-150px] fixed" />

      {/* Grid background */}
      <div className="fixed inset-0 grid-bg opacity-40 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10">
        {!ready ? null : (!forceLanding && (isConnected || showVault))
          ? <Dashboard onGoHome={goHome} />
          : <LandingScreen onLaunch={launch} />
        }
      </div>
    </div>
  )
}
