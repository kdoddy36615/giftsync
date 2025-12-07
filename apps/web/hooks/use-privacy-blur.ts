'use client'

import { useState, useEffect } from 'react'

export function usePrivacyBlur() {
  const [isBlurred, setIsBlurred] = useState(false)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only toggle on spacebar if not typing in an input or textarea
      if (
        event.code === 'Space' &&
        event.target instanceof HTMLElement &&
        event.target.tagName !== 'INPUT' &&
        event.target.tagName !== 'TEXTAREA'
      ) {
        event.preventDefault()
        setIsBlurred((prev) => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const toggleBlur = () => setIsBlurred((prev) => !prev)

  return { isBlurred, toggleBlur }
}
