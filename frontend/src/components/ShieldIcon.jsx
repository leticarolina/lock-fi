import React from 'react'

export default function ShieldIcon({ className = '', size = 48 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M24 4L6 12V22C6 33.1 13.68 43.48 24 46C34.32 43.48 42 33.1 42 22V12L24 4Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M24 4L6 12V22C6 33.1 13.68 43.48 24 46C34.32 43.48 42 33.1 42 22V12L24 4Z"
        fill="currentColor"
        opacity="0.08"
      />
      {/* Lock keyhole */}
      <circle cx="24" cy="22" r="4" stroke="currentColor" strokeWidth="2" fill="none" />
      <path
        d="M24 26V32"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Top arc for lock */}
      <path
        d="M20 18V16C20 13.79 21.79 12 24 12C26.21 12 28 13.79 28 16V18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}
