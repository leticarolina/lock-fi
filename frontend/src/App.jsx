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

  const isLanding = !ready || forceLanding || (!isConnected && !showVault)

  return (
    <div className="min-h-screen relative">
      {!isLanding && (
        <>
          <div className="noise-overlay" />
          <div className="fixed inset-0 grid-bg pointer-events-none" />
          <div className="gradient-blob w-[500px] h-[500px] top-[-150px] left-[-150px] fixed"
            style={{ background: 'rgba(255,107,43,0.04)' }} />
          <div className="gradient-blob w-[400px] h-[400px] bottom-[-100px] right-[-100px] fixed"
            style={{ background: 'rgba(202,255,0,0.03)' }} />
        </>
      )}

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
