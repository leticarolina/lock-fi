import React from 'react'

/* ── Isometric cube helper ─────────────────────────────────────── */
function IsoCube({ cx, cy, s, top, right, left, style = {}, children }) {
  const dx = s * 0.866
  const dy = s * 0.5
  const topPath  = `M${cx},${cy} L${cx+dx},${cy+dy} L${cx},${cy+s} L${cx-dx},${cy+dy} Z`
  const rightPath = `M${cx+dx},${cy+dy} L${cx+dx},${cy+dy+s} L${cx},${cy+2*s} L${cx},${cy+s} Z`
  const leftPath  = `M${cx-dx},${cy+dy} L${cx},${cy+s} L${cx},${cy+2*s} L${cx-dx},${cy+dy+s} Z`
  return (
    <g style={style}>
      <path d={leftPath}  fill={left} />
      <path d={rightPath} fill={right} />
      <path d={topPath}   fill={top} />
      {children}
    </g>
  )
}

/* ── Scene with floating isometric cubes ──────────────────────── */
function CubeScene() {
  return (
    <svg
      viewBox="0 0 640 480"
      style={{ width: '100%', height: '100%', overflow: 'visible' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="glow-green" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="10" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="glow-orange" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="160%">
          <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="rgba(0,0,0,0.12)" />
        </filter>

      </defs>

      {/* — shadow ellipses — */}
      <ellipse cx="400" cy="380" rx="55" ry="14" fill="rgba(0,0,0,0.06)" />
      <ellipse cx="530" cy="310" rx="38" ry="10" fill="rgba(0,0,0,0.05)" />
      <ellipse cx="320" cy="330" rx="35" ry="9"  fill="rgba(0,0,0,0.05)" />
      <ellipse cx="560" cy="210" rx="32" ry="8"  fill="rgba(0,0,0,0.04)" />
      <ellipse cx="180" cy="320" rx="28" ry="7"  fill="rgba(0,0,0,0.04)" />

      {/* — large orange cube (top-center-right) — */}
      <IsoCube cx={400} cy={100} s={70}
        top="#F07048" right="#C04020" left="#D85530"
        style={{ filter: 'url(#shadow)', animation: 'floatA 4s ease-in-out infinite' }}
      />

      {/* — medium orange cube (far right) — */}
      <IsoCube cx={560} cy={60} s={48}
        top="#EC632C" right="#B84020" left="#D25028"
        style={{ filter: 'url(#shadow)', animation: 'floatB 5s ease-in-out infinite' }}
      />

      {/* — small orange cube (bottom-right) — */}
      <IsoCube cx={545} cy={240} s={40}
        top="#F07048" right="#B84020" left="#D25030"
        style={{ filter: 'url(#shadow)', animation: 'floatC 4.5s ease-in-out infinite' }}
      />

      {/* — bottom-center orange cube — */}
      <IsoCube cx={400} cy={265} s={58}
        top="#EC632C" right="#B03818" left="#CC4E22"
        style={{ filter: 'url(#shadow)', animation: 'floatA 5.5s ease-in-out infinite' }}
      />

      {/* — center glowing green cube — */}
      <IsoCube cx={285} cy={170} s={62}
        top="#B8E860" right="#709830" left="#88BC40"
        style={{ filter: 'url(#glow-green)', animation: 'floatB 3.8s ease-in-out infinite' }}
      />

      {/* — small green cube (top-left area) — */}
      <IsoCube cx={185} cy={155} s={38}
        top="#A8D860" right="#688030" left="#80A840"
        style={{ filter: 'url(#shadow)', animation: 'floatC 6s ease-in-out infinite' }}
      />

      {/* — tiny green cube (bottom-left) — */}
      <IsoCube cx={170} cy={260} s={28}
        top="#B0DC68" right="#709038" left="#88B048"
        style={{ filter: 'url(#shadow)', animation: 'floatA 4.2s ease-in-out infinite' }}
      />


    </svg>
  )
}

/* ── Main component ───────────────────────────────────────────── */
export default function LandingScreen({ onLaunch }) {
  return (
    <>
      <style>{`
        @keyframes floatA {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }
        @keyframes floatB {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-14px); }
        }
        @keyframes floatC {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-7px); }
        }
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes fadeUp {
          to { opacity: 1; transform: translateY(0); }
        }

        /* ── GLOBAL ── */
        .lp-wrap {
          min-height: 100vh;
          background: #F5F0EB;
          color: #1C1A15;
          font-family: 'Space Mono', monospace;
          overflow-x: hidden;
        }

        /* ── DIAMOND GRID BG ── */
        .lp-grid {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          background-image:
            linear-gradient(45deg, rgba(160,120,80,0.10) 1px, transparent 1px),
            linear-gradient(-45deg, rgba(160,120,80,0.10) 1px, transparent 1px);
          background-size: 48px 48px;
        }

        /* ── NAV ── */
        .lp-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 50;
          display: flex; justify-content: space-between; align-items: center;
          padding: 16px 28px;
          background: rgba(245,240,235,0.90);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(160,120,80,0.15);
        }
        @media (min-width: 768px) { .lp-nav { padding: 18px 48px; } }

        .lp-nav-logo {
          height: clamp(26px, 3.5vw, 34px);
          width: auto;
        }

        .lp-nav-btns { display: flex; gap: 10px; align-items: center; }

        .lp-btn-filled {
          font-family: 'Space Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          padding: 9px 20px;
          background: #697f42;
          color: #F5F0EB;
          border: 1.5px solid #697f42;
          cursor: pointer;
          border-radius: 4px;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .lp-btn-filled:hover {
          background: #4e6030;
          border-color: #4e6030;
        }

        /* ── HERO ── */
        .lp-hero {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr;
          align-items: center;
          padding: 80px 28px 60px;
          position: relative;
          z-index: 1;
          gap: 48px;
        }
        @media (min-width: 768px) {
          .lp-hero {
            grid-template-columns: 1fr 1fr;
            padding: 80px 48px 60px;
            gap: 0;
          }
        }
        @media (min-width: 1200px) {
          .lp-hero { padding: 80px 80px 60px; }
        }

        /* left column */
        .lp-hero-left {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding-right: 0;
          padding-left: clamp(60px, 14vw, 180px);
          position: relative;
        }
        @media (min-width: 768px) {
          .lp-hero-left { padding-right: 40px; padding-left: clamp(120px, 18vw, 260px); }
        }

        .lp-side-label {
          position: absolute;
          font-family: 'Space Mono', monospace;
          font-size: 0.55rem;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: #8BC34A;
          opacity: 0.7;
          writing-mode: vertical-rl;
          transform: rotate(180deg);
          left: -32px;
          top: 50%;
          transform: translateX(-50%) rotate(180deg);
          display: none;
          user-select: none;
        }
        @media (min-width: 1100px) { .lp-side-label { display: block; } }

        .lp-hero-title {
          font-family: 'Archivo Black', sans-serif;
          font-size: clamp(2rem, 4.5vw, 3.4rem);
          line-height: 1.08;
          letter-spacing: -1.5px;
          color: #697f42;
          margin-bottom: 22px;
        }

        .lp-hero-sub {
          font-family: 'Space Mono', monospace;
          font-size: clamp(0.75rem, 1.4vw, 0.88rem);
          color: #6A6055;
          margin-bottom: 40px;
          line-height: 1.6;
          max-width: 420px;
        }

        .lp-hero-actions {
          display: flex;
          align-items: center;
          gap: 24px;
          flex-wrap: wrap;
        }

        .lp-launch-btn {
          font-family: 'Archivo Black', sans-serif;
          font-size: clamp(0.75rem, 1.4vw, 0.88rem);
          letter-spacing: 2px;
          text-transform: uppercase;
          background: #ec632c;
          color: #FFFFFF;
          border: none;
          padding: clamp(14px, 2vw, 18px) clamp(28px, 4vw, 44px);
          cursor: pointer;
          border-radius: 4px;
          transition: all 0.25s;
        }
        .lp-launch-btn:hover {
          background: #c44e1e;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(236,99,44,0.35);
        }

        /* right column */
        .lp-hero-right {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          margin-left: clamp(-320px, -34vw, -160px);
          height: clamp(340px, 50vw, 500px);
        }

        .lp-block-label {
          position: absolute;
          bottom: 16px;
          right: 0;
          font-family: 'Space Mono', monospace;
          font-size: 0.55rem;
          letter-spacing: 3px;
          color: #ec632c;
          opacity: 0.7;
          display: none;
        }
        @media (min-width: 768px) { .lp-block-label { display: block; } }

        /* ── FEATURES BAR ── */
        .lp-features {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          background: #EDE8E2;
          border-top: 1px solid rgba(160,120,80,0.18);
          border-bottom: 1px solid rgba(160,120,80,0.18);
          position: relative;
          z-index: 1;
        }
        @media (min-width: 640px) { .lp-features { grid-template-columns: repeat(4, 1fr); } }

        .lp-feat-item {
          padding: clamp(20px, 3.5vw, 32px) 20px;
          text-align: center;
          border-right: 1px solid rgba(160,120,80,0.15);
          transition: background 0.25s;
        }
        .lp-feat-item:last-child { border-right: none; }
        .lp-feat-item:hover { background: rgba(212,120,58,0.07); }
        .lp-feat-item:hover .lp-feat-label { color: #ec632c; }

        .lp-feat-icon {
          font-size: clamp(1.3rem, 2.5vw, 1.7rem);
          margin-bottom: 10px;
          display: block;
          color: #ec632c;
        }
        .lp-feat-label {
          font-size: 0.58rem;
          text-transform: uppercase;
          letter-spacing: 3px;
          color: #888070;
          transition: color 0.2s;
        }

        /* ── MARQUEE ── */
        .lp-marquee-wrap {
          overflow: hidden;
          border-bottom: 1px solid rgba(160,120,80,0.15);
          padding: 16px 0;
          background: #F5F0EB;
          position: relative;
          z-index: 1;
        }
        .lp-marquee-track {
          display: flex;
          gap: 56px;
          animation: marquee 24s linear infinite;
          white-space: nowrap;
          width: max-content;
        }
        .lp-marquee-text {
          font-family: 'Archivo Black', sans-serif;
          font-size: 0.72rem;
          letter-spacing: 5px;
          text-transform: uppercase;
          color: #A89880;
        }
        .lp-marquee-accent { color: #ec632c; }

        /* ── HOW IT WORKS ── */
        .lp-steps {
          padding: clamp(56px, 7vh, 96px) clamp(20px, 5vw, 64px);
          background: #EDE8E2;
          position: relative;
          z-index: 1;
        }
        .lp-steps-label {
          font-size: 0.58rem;
          text-transform: uppercase;
          letter-spacing: 5px;
          color: #ec632c;
          margin-bottom: 14px;
          font-family: 'Space Mono', monospace;
        }
        .lp-steps-title {
          font-family: 'Archivo Black', sans-serif;
          font-size: clamp(1.8rem, 4.5vw, 3.2rem);
          letter-spacing: -1.5px;
          line-height: 1.05;
          margin-bottom: clamp(28px, 4vh, 52px);
          color: #1C1A15;
        }
        .lp-steps-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 180px), 1fr));
          gap: 2px;
        }
        .lp-step-card {
          background: #FAFAF8;
          border: 1px solid #D8D3CE;
          padding: clamp(22px, 2.8vw, 34px) clamp(16px, 2.5vw, 26px);
          position: relative;
          transition: all 0.3s;
          cursor: default;
        }
        .lp-step-card:hover {
          border-color: #ec632c;
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(212,120,58,0.12);
        }
        .lp-step-num {
          font-family: 'Archivo Black', sans-serif;
          font-size: clamp(2.2rem, 4.5vw, 3.2rem);
          color: #ec632c;
          opacity: 0.18;
          line-height: 1;
          margin-bottom: 14px;
          transition: opacity 0.3s;
        }
        .lp-step-card:hover .lp-step-num { opacity: 0.45; }
        .lp-step-card-title {
          font-family: 'Archivo Black', sans-serif;
          font-size: 0.9rem;
          margin-bottom: 8px;
          color: #1C1A15;
          letter-spacing: -0.3px;
        }
        .lp-step-card-desc {
          font-size: 0.72rem;
          color: #6A6055;
          line-height: 1.75;
          font-family: 'Space Mono', monospace;
        }

        /* ── FOOTER ── */
        .lp-footer {
          padding: clamp(14px, 2vw, 20px) clamp(20px, 4vw, 48px);
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid rgba(160,120,80,0.15);
          background: #F5F0EB;
          position: relative;
          z-index: 1;
          flex-wrap: wrap;
          gap: 10px;
        }
        .lp-footer-text {
          font-size: 0.58rem;
          letter-spacing: 2px;
          color: #A89880;
          text-transform: uppercase;
        }

        /* ── FADE IN ── */
        .lp-fade {
          opacity: 0;
          transform: translateY(20px);
          animation: fadeUp 0.7s forwards;
        }
      `}</style>

      <div className="lp-wrap">
        {/* grid background */}
        <div className="lp-grid" />

        {/* NAV */}
        <nav className="lp-nav">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img src="/logo.svg" alt="LockFi" className="lp-nav-logo" />
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#A89880' }}>
              Secure Withdrawal Protocol
            </span>
          </div>

          <div className="lp-nav-btns">
            <button
              className="lp-btn-filled"
              onClick={() => document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' })}
            >
              Explore
            </button>
          </div>
        </nav>

        {/* HERO */}
        <section className="lp-hero">
          {/* left */}
          <div className="lp-hero-left">
            <span className="lp-side-label">Secure Protocol</span>

            <h1 className="lp-fade lp-hero-title" style={{ animationDelay: '0.1s' }}>
              Delay suspicious<br />
              withdrawals and<br />
              protect your funds<br />
              on Monad.
            </h1>

            <p className="lp-fade lp-hero-sub" style={{ animationDelay: '0.4s' }}>
              On-chain risk detection with time-locked execution.
            </p>

            <div className="lp-fade lp-hero-actions" style={{ animationDelay: '0.55s' }}>
              <button className="lp-launch-btn" onClick={onLaunch}>
                Launch App
              </button>
            </div>
          </div>

          {/* right — 3D cube scene */}
          <div className="lp-fade lp-hero-right" style={{ animationDelay: '0.3s' }}>
            <CubeScene />
            <span className="lp-block-label">◆ BLOCK</span>
          </div>
        </section>

        {/* FEATURES BAR */}
        <div className="lp-features">
          {[
            { icon: '◇', label: 'Risk Detection' },
            { icon: '⏱', label: 'Time-Locked' },
            { icon: '↩', label: 'Cancellable' },
            { icon: '⊕', label: 'Emergency Lock' },
          ].map(f => (
            <div key={f.label} className="lp-feat-item">
              <span className="lp-feat-icon">{f.icon}</span>
              <span className="lp-feat-label">{f.label}</span>
            </div>
          ))}
        </div>

        {/* MARQUEE */}
        <div className="lp-marquee-wrap">
          <div className="lp-marquee-track">
            {['PROTECT YOUR ASSETS', 'ON-CHAIN SECURITY', 'MONAD NATIVE', 'TIME-LOCKED EXECUTION', 'RISK DETECTION',
              'PROTECT YOUR ASSETS', 'ON-CHAIN SECURITY', 'MONAD NATIVE', 'TIME-LOCKED EXECUTION', 'RISK DETECTION'].map((t, i) => (
              <React.Fragment key={i}>
                <span className="lp-marquee-text">{t}</span>
                <span className="lp-marquee-text lp-marquee-accent">◆</span>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="lp-steps">
          <p className="lp-steps-label">// How it works</p>
          <h2 className="lp-steps-title">
            <span style={{ color: '#697f42' }}>PROTECT</span><br />
            <span style={{ color: '#ec632c' }}>IN 5 STEPS</span>
          </h2>
          <div className="lp-steps-grid">
            {[
              { n: '01', title: 'DEPOSIT YOUR MONS',        desc: 'Deposit your MON tokens into the LockFi vault. Your funds are secured on-chain from the moment they enter.' },
              { n: '02', title: 'REGISTER RECOVERY WALLET', desc: 'Set up a secondary wallet as your rescue address. This backup wallet adds an extra layer of protection for fund recovery.' },
              { n: '03', title: 'INITIATE WITHDRAWAL',      desc: "Submit your withdrawal request. LockFi's on-chain engine scans the transaction for risk signals in real time." },
              { n: '04', title: 'TIME-LOCK PERIOD',         desc: 'Suspicious transactions enter a configurable delay window. Cancel at any time if something looks wrong.' },
              { n: '05', title: 'SECURE RELEASE',           desc: 'Once the lock expires and all checks pass, funds are released securely to the destination address.' },
            ].map(s => (
              <div key={s.n} className="lp-step-card">
                <div className="lp-step-num">{s.n}</div>
                <h3 className="lp-step-card-title">{s.title}</h3>
                <p className="lp-step-card-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="lp-footer">
          <span className="lp-footer-text">© 2026 LockFi Protocol</span>
          <span className="lp-footer-text" style={{ color: '#ec632c' }}>◆ Built on Monad</span>
          <span className="lp-footer-text">Leticia Azevedo &amp; Shaiane Viana</span>
        </footer>
      </div>
    </>
  )
}
