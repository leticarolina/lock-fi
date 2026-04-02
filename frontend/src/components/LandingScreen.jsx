import React from 'react'
import { useTheme } from '../context/ThemeContext.jsx'

export default function LandingScreen({ onLaunch }) {
  const { theme, toggleTheme } = useTheme()
  const isLight = theme === 'light'

  return (
    <>
      <style>{`
        @keyframes floatIcon {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-10px); }
        }
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes fadeUp {
          to { opacity: 1; transform: translateY(0); }
        }

        .landing-wrap {
          position: relative;
          min-height: 100vh;
          background: var(--clr-bg);
          color: var(--clr-text);
          font-family: 'Space Mono', monospace;
          overflow-x: hidden;
          cursor: crosshair;
          transition: background 0.25s ease, color 0.25s ease;
        }

        /* ── NAV ── */
        .landing-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 50;
          display: flex; justify-content: space-between; align-items: center;
          padding: 16px 20px;
          backdrop-filter: blur(20px);
          background: var(--clr-nav-bg);
          border-bottom: 1px solid var(--clr-border);
          transition: background 0.25s ease;
        }
        @media (min-width: 640px) {
          .landing-nav { padding: 20px 40px; }
        }

        .nav-theme-btn {
          padding: 8px 12px;
          font-family: 'Space Mono', monospace;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 2px;
          border: 1px solid var(--clr-border);
          color: var(--clr-text);
          background: transparent;
          cursor: pointer;
          transition: all 0.2s;
          border-radius: 4px;
          display: flex; align-items: center; gap: 6px;
        }
        .nav-theme-btn:hover {
          border-color: #FF6B2B;
          color: #FF6B2B;
        }
        .nav-explore-btn {
          font-family: 'Space Mono', monospace;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 2px;
          border: 1px solid var(--clr-border);
          color: var(--clr-text);
          background: transparent;
          padding: 8px 20px;
          cursor: pointer;
          transition: all 0.3s;
          position: relative;
          overflow: hidden;
        }
        .nav-explore-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: #CAFF00;
          transform: translateX(-101%);
          transition: transform 0.3s;
        }
        .nav-explore-btn:hover { border-color: #CAFF00; color: #0A0A0A; }
        .nav-explore-btn:hover::before { transform: translateX(0); }
        .nav-explore-btn span { position: relative; z-index: 1; }

        /* ── HERO ── */
        .landing-hero {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          position: relative;
          padding: clamp(80px, 14vh, 120px) 20px clamp(40px, 7vh, 80px);
          text-align: center;
          z-index: 1;
        }

        .landing-side-label {
          position: absolute;
          font-family: 'Space Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 3px;
          pointer-events: none;
          opacity: 0.35;
          display: none;
        }
        @media (min-width: 768px) {
          .landing-side-label { display: block; }
        }

        .landing-logo {
          height: clamp(90px, 18vw, 160px);
          width: auto;
          margin-bottom: 8px;
          filter: none;
          transition: filter 0.25s;
        }


        .landing-subtitle {
          font-size: clamp(0.55rem, 1.5vw, 0.65rem);
          text-transform: uppercase;
          letter-spacing: clamp(3px, 1.5vw, 8px);
          color: var(--clr-text-dim);
          margin-bottom: clamp(28px, 5vh, 50px);
          text-align: center;
          padding: 0 10px;
        }

        .landing-desc {
          font-size: clamp(0.95rem, 2.5vw, 1.2rem);
          max-width: 540px;
          line-height: 1.6;
          color: var(--clr-text);
          margin-bottom: 8px;
          padding: 0 16px;
        }

        .landing-desc-small {
          font-size: 0.75rem;
          color: var(--clr-muted);
          margin-bottom: clamp(32px, 5vh, 50px);
          letter-spacing: 1px;
        }

        .landing-launch-btn {
          font-family: 'Archivo Black', sans-serif;
          font-size: clamp(0.8rem, 2.5vw, 1rem);
          letter-spacing: clamp(2px, 0.8vw, 4px);
          text-transform: uppercase;
          background: #FF6B2B;
          color: #0A0A0A;
          border: none;
          padding: clamp(14px, 2.5vw, 20px) clamp(32px, 6vw, 60px);
          cursor: pointer;
          position: relative;
          overflow: hidden;
          clip-path: polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px));
          transition: all 0.3s;
        }
        .landing-launch-btn:hover {
          box-shadow: 0 0 40px rgba(202,255,0,0.55), 0 0 80px rgba(202,255,0,0.25);
          background: #CAFF00 !important;
        }

        /* ── FEATURES BAR ── */
        .features-bar {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1px;
          background: var(--clr-border);
          border-top: 1px solid var(--clr-border);
          border-bottom: 1px solid var(--clr-border);
          position: relative;
          z-index: 1;
        }
        @media (min-width: 640px) {
          .features-bar { grid-template-columns: repeat(4, 1fr); }
        }

        .feature-item {
          background: var(--clr-bg);
          padding: clamp(22px, 4vw, 36px) 20px;
          text-align: center;
          transition: background 0.3s;
        }
        .feature-item:hover { background: var(--clr-surface) !important; }
        .feature-item:hover .feat-label { color: #FF6B2B !important; }

        .feat-icon {
          font-size: clamp(1.4rem, 3vw, 1.8rem);
          margin-bottom: 10px;
          display: block;
          filter: drop-shadow(0 0 8px rgba(255,107,43,0.5));
        }
        .feat-label {
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 4px;
          color: var(--clr-muted);
          transition: color 0.2s;
        }

        /* ── MARQUEE ── */
        .marquee-wrap {
          overflow: hidden;
          border-bottom: 1px solid var(--clr-border);
          padding: 18px 0;
          position: relative;
          z-index: 1;
          background: var(--clr-bg);
          transition: background 0.25s;
        }
        .marquee-track {
          display: flex;
          gap: 60px;
          animation: marquee 22s linear infinite;
          white-space: nowrap;
          width: max-content;
        }
        .marquee-text {
          font-family: 'Archivo Black', sans-serif;
          font-size: 0.8rem;
          letter-spacing: 6px;
          text-transform: uppercase;
          color: var(--clr-muted);
        }
        .marquee-accent { color: #FF6B2B; }

        /* ── HOW IT WORKS ── */
        .steps-section {
          padding: clamp(60px, 8vh, 100px) clamp(16px, 5vw, 64px);
          background: var(--clr-steps-bg);
          position: relative;
          z-index: 1;
          transition: background 0.25s;
        }
        .steps-label {
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 6px;
          color: #FF6B2B;
          margin-bottom: 16px;
          font-family: 'Space Mono', monospace;
        }
        .steps-title {
          font-family: 'Archivo Black', sans-serif;
          font-size: clamp(2rem, 5vw, 3.5rem);
          letter-spacing: -2px;
          line-height: 1;
          margin-bottom: clamp(32px, 5vh, 56px);
          color: var(--clr-steps-text);
        }
        .steps-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 180px), 1fr));
          gap: 2px;
        }
        .step-card {
          background: var(--clr-steps-card);
          border: 1px solid var(--clr-steps-border);
          padding: clamp(24px, 3vw, 36px) clamp(18px, 3vw, 28px);
          position: relative;
          transition: all 0.3s;
          cursor: default;
        }
        .step-card:hover {
          border-color: #FF6B2B !important;
          transform: translateY(-4px);
        }
        .step-num {
          font-family: 'Archivo Black', sans-serif;
          font-size: clamp(2.5rem, 5vw, 3.5rem);
          color: #FF6B2B;
          opacity: 0.2;
          line-height: 1;
          margin-bottom: 16px;
          transition: opacity 0.3s;
        }
        .step-card:hover .step-num { opacity: 0.5; }
        .step-card-title {
          font-family: 'Archivo Black', sans-serif;
          font-size: 0.95rem;
          margin-bottom: 10px;
          color: var(--clr-steps-text);
          letter-spacing: -0.5px;
        }
        .step-card-desc {
          font-size: 0.75rem;
          color: var(--clr-steps-desc);
          line-height: 1.7;
          font-family: 'Space Mono', monospace;
        }

        /* ── FOOTER ── */
        .landing-footer {
          padding: clamp(14px, 2vw, 20px) clamp(16px, 4vw, 40px);
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid var(--clr-border);
          position: relative;
          z-index: 1;
          flex-wrap: wrap;
          gap: 10px;
          background: var(--clr-bg);
          transition: background 0.25s;
        }
        .footer-text {
          font-size: 0.6rem;
          letter-spacing: 2px;
          color: var(--clr-muted);
          text-transform: uppercase;
        }
        .footer-chain {
          color: var(--clr-accent-label);
          font-size: 0.65rem;
          letter-spacing: 3px;
        }

        /* ── GRID BG (landing) ── */
        .landing-grid {
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(var(--clr-grid) 1px, transparent 1px),
            linear-gradient(90deg, var(--clr-grid) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
          z-index: 0;
        }

        /* ── NOISE ── */
        .landing-noise {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 999;
          opacity: 0.025;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-repeat: repeat;
          background-size: 128px 128px;
        }

        .fade-in {
          opacity: 0;
          transform: translateY(24px);
          animation: fadeUp 0.8s forwards;
        }
      `}</style>

      <div className="landing-wrap">
        {/* NAV */}
        <nav className="landing-nav">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <img
              src="/logo_nova.svg"
              alt="LockFi"
              style={{ height: 'clamp(28px,4vw,36px)', width: 'auto' }}
            />
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button className="nav-theme-btn" onClick={toggleTheme} aria-label="Toggle theme">
              {isLight ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              )}
              <span className="hidden sm:inline">{isLight ? 'Dark' : 'Light'}</span>
            </button>
            <button className="nav-explore-btn" onClick={() => document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' })}>
              <span>Explore</span>
            </button>
          </div>
        </nav>

        {/* Grid + noise */}
        <div className="landing-grid" />
        <div className="landing-noise" />

        {/* HERO */}
        <section className="landing-hero">
          {/* Floating decorative labels — hidden on mobile */}
          <span className="landing-side-label" style={{
            top: '30%', left: '4%',
            color: '#CAFF00',
            transform: 'rotate(-90deg)',
          }}>{'{SECURE_PROTOCOL}'}</span>
          <span className="landing-side-label" style={{
            bottom: '25%', right: '4%',
            color: '#FF6B2B',
          }}>◆ 0xLOCK</span>

          {/* Shield icon */}
          <div className="fade-in" style={{ width: 'clamp(56px,10vw,80px)', height: 'clamp(56px,10vw,80px)', marginBottom: 'clamp(24px,4vh,40px)', animation: 'floatIcon 3s ease-in-out infinite, fadeUp 0.8s forwards', animationDelay: '0.1s' }}>
            <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg"
              style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 0 20px rgba(255,107,43,0.55))' }}>
              <path d="M40 8L12 22V38C12 56 24 68 40 74C56 68 68 56 68 38V22L40 8Z"
                stroke="#FF6B2B" strokeWidth="2" fill="none" />
              <circle cx="40" cy="38" r="8" stroke="#CAFF00" strokeWidth="2" fill="none" />
              <line x1="40" y1="46" x2="40" y2="54" stroke="#CAFF00" strokeWidth="2" />
            </svg>
          </div>

          {/* Logo */}
          <img
            className="fade-in landing-logo"
            src="/logo_nova.svg"
            alt="LockFi"
            style={{ animationDelay: '0.3s' }}
          />

          {/* Subtitle */}
          <p className="fade-in landing-subtitle" style={{ animationDelay: '0.45s' }}>
            <span style={{ color: '#FF6B2B', opacity: 0.5 }}>——</span>
            {' '}SECURE WITHDRAWAL PROTOCOL{' '}
            <span style={{ color: '#FF6B2B', opacity: 0.5 }}>——</span>
          </p>

          {/* Desc */}
          <p className="fade-in landing-desc" style={{ animationDelay: '0.6s' }}>
            Delay suspicious withdrawals and protect your funds on Monad.
          </p>
          <p className="fade-in landing-desc-small" style={{ animationDelay: '0.7s' }}>
            On-chain risk detection with time-locked execution.
          </p>

          {/* CTA */}
          <button
            className="fade-in landing-launch-btn"
            style={{ animationDelay: '0.85s' }}
            onClick={onLaunch}
          >
            LAUNCH APP
          </button>
        </section>

        {/* FEATURES BAR */}
        <div className="features-bar">
          {[
            { icon: '◇', label: 'Risk Detection' },
            { icon: '⏱', label: 'Time-Locked' },
            { icon: '↩', label: 'Cancellable' },
            { icon: '⊕', label: 'Emergency Lock' },
          ].map((f) => (
            <div key={f.label} className="feature-item">
              <span className="feat-icon">{f.icon}</span>
              <span className="feat-label">{f.label}</span>
            </div>
          ))}
        </div>

        {/* MARQUEE */}
        <div className="marquee-wrap">
          <div className="marquee-track">
            {['PROTECT YOUR ASSETS', 'ON-CHAIN SECURITY', 'MONAD NATIVE', 'TIME-LOCKED EXECUTION', 'RISK DETECTION',
              'PROTECT YOUR ASSETS', 'ON-CHAIN SECURITY', 'MONAD NATIVE', 'TIME-LOCKED EXECUTION', 'RISK DETECTION'].map((t, i) => (
              <React.Fragment key={i}>
                <span className="marquee-text">{t}</span>
                <span className="marquee-text marquee-accent">◆</span>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="steps-section">
          <p className="steps-label">// How it works</p>
          <h2 className="steps-title">
            PROTECT<br />
            <span style={{ color: '#FF6B2B' }}>IN 5 STEPS</span>
          </h2>
          <div className="steps-grid">
            {[
              { n: '01', title: 'DEPOSIT YOUR MONS', desc: 'Deposit your MON tokens into the LockFi vault. Your funds are secured on-chain from the moment they enter.' },
              { n: '02', title: 'REGISTER RECOVERY WALLET', desc: 'Set up a secondary wallet as your rescue address. This backup wallet adds an extra layer of protection for fund recovery.' },
              { n: '03', title: 'INITIATE WITHDRAWAL', desc: "Submit your withdrawal request. LockFi's on-chain engine scans the transaction for risk signals in real time." },
              { n: '04', title: 'TIME-LOCK PERIOD', desc: 'Suspicious transactions enter a configurable delay window. Cancel at any time if something looks wrong.' },
              { n: '05', title: 'SECURE RELEASE', desc: 'Once the lock expires and all checks pass, funds are released securely to the destination address.' },
            ].map((s) => (
              <div key={s.n} className="step-card">
                <div className="step-num">{s.n}</div>
                <h3 className="step-card-title">{s.title}</h3>
                <p className="step-card-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="landing-footer">
          <span className="footer-text">© 2026 LockFi Protocol</span>
          <span className="footer-chain">◆ Built on Monad</span>
          <span className="footer-text">Leticia Azevedo &amp; Shaiane Viana</span>
        </footer>
      </div>
    </>
  )
}
