import { useState, useEffect, useRef } from 'react'

function calcSecondsLeft(targetTimestamp) {
  if (!targetTimestamp) return 0
  const target = targetTimestamp instanceof Date ? targetTimestamp.getTime() : targetTimestamp
  return Math.max(0, Math.floor((target - Date.now()) / 1000))
}

export function useCountdown(targetTimestamp) {
  const [secondsLeft, setSecondsLeft] = useState(() => calcSecondsLeft(targetTimestamp))
  const intervalRef = useRef(null)

  useEffect(() => {
    if (!targetTimestamp) {
      setSecondsLeft(0)
      return
    }

    const calculate = () => {
      const diff = calcSecondsLeft(targetTimestamp)
      setSecondsLeft(diff)
      return diff
    }

    calculate()

    intervalRef.current = setInterval(() => {
      const remaining = calculate()
      if (remaining <= 0) {
        clearInterval(intervalRef.current)
      }
    }, 1000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [targetTimestamp])

  const minutes = Math.floor(secondsLeft / 60)
  const seconds = secondsLeft % 60
  const formatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  const isComplete = secondsLeft === 0 && targetTimestamp !== null

  return { secondsLeft, minutes, seconds, formatted, isComplete }
}
