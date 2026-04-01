import React from 'react'

const neon = '#FF6B2B'
const acid = '#CAFF00'
const bg = '#0A0A0A'
const bgCard = '#111111'
const textDim = '#666'
const border = '#222'

const styles = {
  wrapper: {
    position: 'relative',
    minHeight: '100vh',
    background: bg,
    color: '#E8E8E8',
    fontFamily: "'Space Mono', monospace",
    overflowX: 'hidden',
    cursor: 'crosshair',
  },
  gridBg: {
    position: 'fixed',
    inset: 0,
    backgroundImage:
      'linear-gradient(rgba(255,107,43,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,107,43,0.03) 1px, transparent 1px)',
    backgroundSize: '60px 60px',
    pointerEvents: 'none',
    zIndex: 0,
  },
  noise: {
    position: 'fixed',
    inset: 0,
    pointerEvents: 'none',
    zIndex: 999,
    opacity: 0.035,
    backgroundImage:
      "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
    backgroundRepeat: 'repeat',
    backgroundSize: '128px 128px',
  },
  hero: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    padding: '120px 20px 80px',
    textAlign: 'center',
    zIndex: 1,
  },
  shieldIcon: {
    width: 80,
    height: 80,
    marginBottom: 40,
    animation: 'floatIcon 3s ease-in-out infinite',
  },
  logoImg: {
    height: 160,
    width: 'auto',
    marginBottom: 8,
    filter: 'none',
  },
  subtitle: {
    fontSize: '0.65rem',
    textTransform: 'uppercase',
    letterSpacing: '8px',
    color: '#aaa',
    marginBottom: 50,
  },
  desc: {
    fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
    maxWidth: 540,
    lineHeight: 1.6,
    color: '#E8E8E8',
    marginBottom: 8,
  },
  descSmall: {
    fontSize: '0.75rem',
    color: textDim,
    marginBottom: 50,
    letterSpacing: '1px',
  },
  launchBtn: {
    fontFamily: "'Archivo Black', sans-serif",
    fontSize: '1rem',
    letterSpacing: '4px',
    textTransform: 'uppercase',
    background: neon,
    color: bg,
    border: 'none',
    padding: '20px 60px',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',
    clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))',
    transition: 'all 0.3s',
  },
  featuresBar: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '1px',
    background: border,
    borderTop: `1px solid ${border}`,
    borderBottom: `1px solid ${border}`,
    position: 'relative',
    zIndex: 1,
  },
  featureItem: {
    background: bg,
    padding: '36px 20px',
    textAlign: 'center',
    transition: 'background 0.3s',
  },
  featureIcon: {
    fontSize: '1.8rem',
    marginBottom: 12,
    display: 'block',
    filter: `drop-shadow(0 0 8px ${neon}88)`,
  },
  featureLabel: {
    fontSize: '0.6rem',
    textTransform: 'uppercase',
    letterSpacing: '4px',
    color: textDim,
  },
  marqueeWrap: {
    overflow: 'hidden',
    borderBottom: `1px solid ${border}`,
    padding: '18px 0',
    position: 'relative',
    zIndex: 1,
    background: bg,
  },
  marquee: {
    display: 'flex',
    gap: 60,
    animation: 'marquee 22s linear infinite',
    whiteSpace: 'nowrap',
    width: 'max-content',
  },
  marqueeSpan: {
    fontFamily: "'Archivo Black', sans-serif",
    fontSize: '0.8rem',
    letterSpacing: '6px',
    textTransform: 'uppercase',
    color: textDim,
  },
  marqueeAccent: {
    color: neon,
  },
  stepsSection: {
    padding: '100px 40px',
    background: '#f0ede9',
    position: 'relative',
    zIndex: 1,
  },
  stepsSectionLabel: {
    fontSize: '0.6rem',
    textTransform: 'uppercase',
    letterSpacing: '6px',
    color: neon,
    marginBottom: 16,
    fontFamily: "'Space Mono', monospace",
  },
  stepsSectionTitle: {
    fontFamily: "'Archivo Black', sans-serif",
    fontSize: 'clamp(2rem, 5vw, 3.5rem)',
    letterSpacing: '-2px',
    lineHeight: 1,
    marginBottom: 56,
    color: '#111',
  },
  stepsSectionTitleAccent: {
    color: neon,
  },
  stepsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: 2,
    maxWidth: 1200,
  },
  stepCard: {
    background: '#efefef',
    border: '1px solid #d9d9d9',
    padding: '36px 28px',
    position: 'relative',
    transition: 'all 0.3s',
    cursor: 'default',
  },
  stepNum: {
    fontFamily: "'Archivo Black', sans-serif",
    fontSize: '3.5rem',
    color: neon,
    opacity: 0.2,
    lineHeight: 1,
    marginBottom: 16,
  },
  stepTitle: {
    fontFamily: "'Archivo Black', sans-serif",
    fontSize: '0.95rem',
    marginBottom: 10,
    color: '#111',
    letterSpacing: '-0.5px',
  },
  stepDesc: {
    fontSize: '0.75rem',
    color: '#666',
    lineHeight: 1.7,
    fontFamily: "'Space Mono', monospace",
  },
  bottomBar: {
    padding: '20px 40px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: `1px solid ${border}`,
    position: 'relative',
    zIndex: 1,
    flexWrap: 'wrap',
    gap: 12,
  },
  bottomText: {
    fontSize: '0.6rem',
    letterSpacing: '2px',
    color: textDim,
    textTransform: 'uppercase',
  },
  chainText: {
    color: acid,
    fontSize: '0.65rem',
    letterSpacing: '3px',
  },
}

export default function LandingScreen({ onLaunch }) {
  return (
    <>
      <style>{`
        @keyframes floatIcon {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes fadeUp {
          to { opacity: 1; transform: translateY(0); }
        }
        .nav-btn {
          font-family: 'Space Mono', monospace;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 2px;
          border: 1px solid #666;
          color: #E8E8E8;
          background: transparent;
          padding: 10px 24px;
          cursor: pointer;
          transition: all 0.3s;
          position: relative;
          overflow: hidden;
        }
        .nav-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: ${neon};
          transform: translateX(-101%);
          transition: transform 0.3s;
        }
        .nav-btn:hover {
          border-color: ${acid};
          color: #0A0A0A;
        }
        .nav-btn:hover::before {
          transform: translateX(0);
          background: ${acid};
        }
        .nav-btn span {
          position: relative;
          z-index: 1;
        }
        .landing-launch-btn:hover {
          box-shadow: 0 0 40px ${acid}66, 0 0 80px ${acid}33;
          background: ${acid} !important;
        }
        .landing-feature-item:hover {
          background: ${bgCard} !important;
        }
        .landing-feature-item:hover .feat-label {
          color: ${neon} !important;
        }
        .fade-in {
          opacity: 0;
          transform: translateY(24px);
          animation: fadeUp 0.8s forwards;
        }
        .landing-step-card:hover {
          border-color: ${neon} !important;
          transform: translateY(-4px);
        }
        .landing-step-card:hover > div:first-child {
          opacity: 0.5 !important;
        }
      `}</style>

      <div style={styles.wrapper}>

        {/* NAV */}
        <nav style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
          display: 'flex', justifyContent: 'flex-end', alignItems: 'center',
          padding: '20px 40px',
          backdropFilter: 'blur(20px)',
          background: 'rgba(10,10,10,0.7)',
          borderBottom: `1px solid ${border}`,
        }}>
          <button className="nav-btn" onClick={() => document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' })}>
            <span>Explore</span>
          </button>
        </nav>

        {/* Grid */}
        <div style={styles.gridBg} />
        {/* Noise */}
        <div style={styles.noise} />

        {/* HERO */}
        <section style={styles.hero}>
          {/* Floating side labels */}
          <span style={{
            position: 'absolute', top: '30%', left: '5%',
            fontFamily: "'Space Mono', monospace", fontSize: '0.65rem',
            color: acid, opacity: 0.4, letterSpacing: 3,
            transform: 'rotate(-90deg)', pointerEvents: 'none',
          }}>{'{SECURE_PROTOCOL}'}</span>
          <span style={{
            position: 'absolute', bottom: '25%', right: '5%',
            fontFamily: "'Space Mono', monospace", fontSize: '0.65rem',
            color: neon, opacity: 0.3, letterSpacing: 3,
            pointerEvents: 'none',
          }}>◆ 0xLOCK</span>

          {/* Shield */}
          <div className="fade-in" style={{ ...styles.shieldIcon, animationDelay: '0.1s' }}>
            <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg"
              style={{ width: '100%', height: '100%', filter: `drop-shadow(0 0 20px ${neon}88)` }}>
              <path d="M40 8L12 22V38C12 56 24 68 40 74C56 68 68 56 68 38V22L40 8Z"
                stroke={neon} strokeWidth="2" fill="none" />
              <circle cx="40" cy="38" r="8" stroke={acid} strokeWidth="2" fill="none" />
              <line x1="40" y1="46" x2="40" y2="54" stroke={acid} strokeWidth="2" />
            </svg>
          </div>

          {/* Logo */}
          <img
            className="fade-in"
            src="/logo_nova.svg"
            alt="LockFi"
            style={{ ...styles.logoImg, animationDelay: '0.3s' }}
          />

          {/* Subtitle */}
          <p className="fade-in" style={{ ...styles.subtitle, animationDelay: '0.45s' }}>
            <span style={{ color: neon, opacity: 0.5 }}>——</span>
            {' '}SECURE WITHDRAWAL PROTOCOL{' '}
            <span style={{ color: neon, opacity: 0.5 }}>——</span>
          </p>

          {/* Desc */}
          <p className="fade-in" style={{ ...styles.desc, animationDelay: '0.6s' }}>
            Delay suspicious withdrawals and protect your funds on Monad.
          </p>
          <p className="fade-in" style={{ ...styles.descSmall, animationDelay: '0.7s' }}>
            On-chain risk detection with time-locked execution.
          </p>

          {/* Button */}
          <button
            className="fade-in landing-launch-btn"
            style={{ ...styles.launchBtn, animationDelay: '0.85s' }}
            onClick={onLaunch}
          >
            LAUNCH APP
          </button>
        </section>

        {/* FEATURES BAR */}
        <div style={styles.featuresBar}>
          {[
            { icon: '◇', label: 'Risk Detection' },
            { icon: '⏱', label: 'Time-Locked' },
            { icon: '↩', label: 'Cancellable' },
            { icon: '⊕', label: 'Emergency Lock' },
          ].map((f) => (
            <div key={f.label} className="landing-feature-item" style={styles.featureItem}>
              <span style={styles.featureIcon}>{f.icon}</span>
              <span className="feat-label" style={styles.featureLabel}>{f.label}</span>
            </div>
          ))}
        </div>

        {/* MARQUEE */}
        <div style={styles.marqueeWrap}>
          <div style={styles.marquee}>
            {['PROTECT YOUR ASSETS', 'ON-CHAIN SECURITY', 'MONAD NATIVE', 'TIME-LOCKED EXECUTION', 'RISK DETECTION',
              'PROTECT YOUR ASSETS', 'ON-CHAIN SECURITY', 'MONAD NATIVE', 'TIME-LOCKED EXECUTION', 'RISK DETECTION'].map((t, i) => (
              <React.Fragment key={i}>
                <span style={styles.marqueeSpan}>{t}</span>
                <span style={{ ...styles.marqueeSpan, ...styles.marqueeAccent }}>◆</span>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* HOW IT WORKS */}
        <section id="how-it-works" style={styles.stepsSection}>
          <p style={styles.stepsSectionLabel}>// How it works</p>
          <h2 style={styles.stepsSectionTitle}>
            PROTECT<br />
            <span style={styles.stepsSectionTitleAccent}>IN 5 STEPS</span>
          </h2>
          <div style={styles.stepsGrid}>
            {[
              { n: '01', title: 'DEPOSIT YOUR MONS', desc: 'Deposit your MON tokens into the LockFi vault. Your funds are secured on-chain from the moment they enter.' },
              { n: '02', title: 'REGISTER RECOVERY WALLET', desc: 'Set up a secondary wallet as your rescue address. This backup wallet adds an extra layer of protection for fund recovery.' },
              { n: '03', title: 'INITIATE WITHDRAWAL', desc: "Submit your withdrawal request. LockFi's on-chain engine scans the transaction for risk signals in real time." },
              { n: '04', title: 'TIME-LOCK PERIOD', desc: 'Suspicious transactions enter a configurable delay window. Cancel at any time if something looks wrong.' },
              { n: '05', title: 'SECURE RELEASE', desc: 'Once the lock expires and all checks pass, funds are released securely to the destination address.' },
            ].map((s) => (
              <div
                key={s.n}
                className="landing-step-card"
                style={styles.stepCard}
              >
                <div style={styles.stepNum}>{s.n}</div>
                <h3 style={styles.stepTitle}>{s.title}</h3>
                <p style={styles.stepDesc}>{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FOOTER */}
        <footer style={styles.bottomBar}>
          <span style={styles.bottomText}>© 2026 LockFi Protocol</span>
          <span style={styles.chainText}>◆ Built on Monad</span>
          <span style={styles.bottomText}>Leticia Azevedo & Shaiane Viana</span>
        </footer>
      </div>
    </>
  )
}
