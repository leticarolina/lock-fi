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
          bg: '#0a0b0f',
          surface: '#12131a',
          card: '#181a24',
          border: '#252836',
          accent: '#00e5a0',
          'accent-dim': '#00c98b',
          'accent-glow': 'rgba(0, 229, 160, 0.15)',
          warning: '#f59e0b',
          'warning-glow': 'rgba(245, 158, 11, 0.15)',
          danger: '#ef4444',
          'danger-glow': 'rgba(239, 68, 68, 0.12)',
          muted: '#6b7294',
          text: '#e2e4f0',
          'text-dim': '#9599b3',
        }
      },
      fontFamily: {
        display: ['"Syne"', 'sans-serif'],
        body: ['"IBM Plex Mono"', 'monospace'],
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'slide-in': 'slideIn 0.4s ease-out forwards',
        'countdown': 'countdownPulse 1s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 229, 160, 0.2)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 229, 160, 0.4)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        countdownPulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
}
