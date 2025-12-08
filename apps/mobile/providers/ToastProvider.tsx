import React, { createContext, useContext, useState, useCallback } from 'react'
import { Toast, ToastType } from '../components/ui/Toast'

interface ToastContextValue {
  showToast: (message: string, type?: ToastType, action?: { label: string; onPress: () => void }) => void
  hideToast: () => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

interface ToastState {
  visible: boolean
  message: string
  type: ToastType
  action?: { label: string; onPress: () => void }
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastState>({
    visible: false,
    message: '',
    type: 'info',
  })

  const showToast = useCallback(
    (message: string, type: ToastType = 'info', action?: { label: string; onPress: () => void }) => {
      setToast({ visible: true, message, type, action })
    },
    []
  )

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, visible: false }))
  }, [])

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        action={toast.action}
        onDismiss={hideToast}
      />
    </ToastContext.Provider>
  )
}
