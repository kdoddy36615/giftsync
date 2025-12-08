import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

const PRIVACY_KEY = 'giftsync_privacy_blur'

interface PrivacyContextValue {
  isBlurred: boolean
  toggleBlur: () => void
  setBlurred: (value: boolean) => void
}

const PrivacyContext = createContext<PrivacyContextValue | null>(null)

interface PrivacyProviderProps {
  children: ReactNode
}

export function PrivacyProvider({ children }: PrivacyProviderProps) {
  const [isBlurred, setIsBlurred] = useState(false)

  // Load saved preference on mount
  useEffect(() => {
    AsyncStorage.getItem(PRIVACY_KEY).then((value) => {
      if (value !== null) {
        setIsBlurred(value === 'true')
      }
    })
  }, [])

  const setBlurred = useCallback((value: boolean) => {
    setIsBlurred(value)
    AsyncStorage.setItem(PRIVACY_KEY, String(value))
  }, [])

  const toggleBlur = useCallback(() => {
    setBlurred(!isBlurred)
  }, [isBlurred, setBlurred])

  const value: PrivacyContextValue = {
    isBlurred,
    toggleBlur,
    setBlurred,
  }

  return (
    <PrivacyContext.Provider value={value}>
      {children}
    </PrivacyContext.Provider>
  )
}

export function usePrivacy() {
  const context = useContext(PrivacyContext)
  if (!context) {
    throw new Error('usePrivacy must be used within a PrivacyProvider')
  }
  return context
}
