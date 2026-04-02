/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        vault: {
          // Theme-aware (use CSS variables)
          bg:           'var(--clr-bg)',
          surface:      'var(--clr-surface)',
          card:         'var(--clr-surface)',
          border:       'var(--clr-border)',
          text:         'var(--clr-text)',
          'text-dim':   'var(--clr-text-dim)',
          muted:        'var(--clr-muted)',
          // Static accent colors (opacity modifiers work)
          accent:       '#FF6B2B',
          'accent-dim': '#e55a1f',
          'accent-glow':'rgba(255,107,43,0.15)',
          warning:      '#f59e0b',
          'warning-glow':'rgba(245,158,11,0.15)',
          green:        '#CAFF00',
          danger:       '#ef4444',
          'danger-glow':'rgba(239,68,68,0.12)',
        }
      },
      fontFamily: {
        display: ['"Archivo Black"', 'sans-serif'],
        body:    ['"Space Mono"', 'monospace'],
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'fade-up':    'fadeUp 0.6s ease-out forwards',
        'slide-in':   'slideIn 0.4s ease-out forwards',
        'countdown':  'countdownPulse 1s ease-in-out infinite',
        'shimmer':    'shimmer 2.5s ease-in-out infinite',
        'float':      'float 6s ease-in-out infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255,107,43,0.2)' },
          '50%':      { boxShadow: '0 0 40px rgba(255,107,43,0.4)' },
        },
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%':   { opacity: '0', transform: 'translateX(-16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        countdownPulse: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.6' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
}
