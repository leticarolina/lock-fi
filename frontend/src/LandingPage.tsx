import { Link } from 'react-router-dom'
import './LandingPage.css'

// Marketing entry point at "/". Purely presentational — no wallet/contract
// logic here, that all still lives in DashboardApp under "/app".
function LandingPage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-navy px-6 py-16 text-center">
      <img src="/logo-cloud.png" alt="Watcher" className="mb-6 h-12 w-auto opacity-90 sm:h-14" />

      <h1
        className="landing-watcher-rise bg-gradient-to-b from-cloud to-cloud/60 bg-clip-text font-manrope text-6xl font-extrabold tracking-tight text-transparent sm:text-7xl md:text-8xl lg:text-9xl"
      >
        WATCHER
      </h1>

      <p className="landing-tagline-fade mt-6 font-inter text-base text-cloud/70 sm:text-lg">
        Your wallet gets one more chance.
      </p>

      <div className="landing-cta-fade mt-10 flex flex-col items-center gap-4 sm:flex-row">
        <Link
          to="/app"
          className="rounded-lg bg-teal px-8 py-3 font-inter text-sm font-semibold text-cloud transition-colors hover:bg-teal/90 sm:text-base"
        >
          Protect my wallet
        </Link>
        <a
          href="#architecture"
          className="rounded-lg border border-cloud/30 px-8 py-3 font-inter text-sm font-semibold text-cloud/90 transition-colors hover:border-cloud/60 hover:text-cloud sm:text-base"
        >
          View architecture
        </a>
      </div>
    </div>
  )
}

export default LandingPage
