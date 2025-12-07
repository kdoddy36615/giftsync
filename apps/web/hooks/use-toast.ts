import { useState, useCallback } from 'react'
import type { ToastType } from '@/components/ui/toast'
import { TOAST_DURATION } from '@/lib/constants/timing'

interface Toast {
  id: string
  message: string
  type?: ToastType
  duration?: number
}

/**
 * Hook for managing toast notifications
 * Provides methods to show and dismiss toasts
 */
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback(
    (message: string, type: ToastType = 'info', duration: number = TOAST_DURATION.DEFAULT) => {
      const id = Math.random().toString(36).substring(2, 9)
      const newToast: Toast = { id, message, type, duration }

      setToasts((prev) => [...prev, newToast])

      return id
    },
    []
  )

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const success = useCallback(
    (message: string, duration?: number) => {
      return showToast(message, 'success', duration)
    },
    [showToast]
  )

  const error = useCallback(
    (message: string, duration?: number) => {
      return showToast(message, 'error', duration)
    },
    [showToast]
  )

  const info = useCallback(
    (message: string, duration?: number) => {
      return showToast(message, 'info', duration)
    },
    [showToast]
  )

  return {
    toasts,
    showToast,
    dismissToast,
    success,
    error,
    info,
  }
}
