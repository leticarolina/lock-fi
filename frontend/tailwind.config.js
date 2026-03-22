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
          bg: '#f0ede9',
          surface: '#efefef',
          card: '#efefef',
          border: '#d9d9d9',
          accent: '#ec632c',
          'accent-dim': '#d4561f',
          'accent-glow': 'rgba(236, 99, 44, 0.15)',
          warning: '#ec632c',
          'warning-glow': 'rgba(236, 99, 44, 0.15)',
          green: '#d9e28d',
          danger: '#ec632c',
          'danger-glow': 'rgba(236, 99, 44, 0.12)',
          muted: '#737373',
          text: '#111111',
          'text-dim': '#444444',
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
          '0%, 100%': { boxShadow: '0 0 20px rgba(236, 99, 44, 0.2)' },
          '50%': { boxShadow: '0 0 40px rgba(236, 99, 44, 0.4)' },
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
