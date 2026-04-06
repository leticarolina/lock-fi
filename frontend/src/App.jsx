import React from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { useVault } from './context/VaultContext.jsx'
import LandingScreen from './components/LandingScreen.jsx'
import Dashboard from './components/Dashboard.jsx'

function VaultPage() {
  const navigate = useNavigate()
  return (
    <>
      <div className="noise-overlay" />
      <div className="fixed inset-0 grid-bg pointer-events-none" />
      <div className="gradient-blob w-[500px] h-[500px] top-[-150px] left-[-150px] fixed"
        style={{ background: 'rgba(236,99,44,0.05)' }} />
      <div className="gradient-blob w-[400px] h-[400px] bottom-[-100px] right-[-100px] fixed"
        style={{ background: 'rgba(105,127,66,0.04)' }} />
      <div className="relative z-10">
        <Dashboard onGoHome={() => navigate('/')} />
      </div>
    </>
  )
}

function LandingPage() {
  const navigate = useNavigate()
  return (
    <div className="relative z-10">
      <LandingScreen onLaunch={() => navigate('/vault')} />
    </div>
  )
}

export default function App() {
  return (
    <div className="min-h-screen relative">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/vault" element={<VaultPage />} />
      </Routes>
    </div>
  )
}
