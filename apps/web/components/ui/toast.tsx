'use client'

import { useEffect } from 'react'
import { cn } from '@/lib/utils'
import { TOAST_DURATION } from '@/lib/constants/timing'

export type ToastType = 'success' | 'error' | 'info'

export interface ToastProps {
  id: string
  message: string
  type?: ToastType
  duration?: number
  onClose: (id: string) => void
}

/**
 * Toast notification component
 * Auto-dismisses after duration (default 3000ms)
 */
export function Toast({ id, message, type = 'info', duration = TOAST_DURATION.DEFAULT, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id)
    }, duration)

    return () => clearTimeout(timer)
  }, [id, duration, onClose])

  return (
    <div
      className={cn(
        'min-w-[300px] max-w-md rounded-lg border-2 p-4 shadow-lg backdrop-blur-sm animate-in slide-in-from-top-2 fade-in',
        {
          'bg-emerald-500 bg-opacity-95 border-emerald-400 text-white': type === 'success',
          'bg-red-600 bg-opacity-95 border-red-500 text-white': type === 'error',
          'bg-[#6366f1] bg-opacity-95 border-indigo-400 text-white': type === 'info',
        }
      )}
      role="alert"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Icon */}
          {type === 'success' && (
            <svg
              className="w-5 h-5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
          {type === 'error' && (
            <svg
              className="w-5 h-5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          )}
          {type === 'info' && (
            <svg
              className="w-5 h-5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          )}
          {/* Message */}
          <p className="font-semibold text-sm">{message}</p>
        </div>

        {/* Close Button */}
        <button
          onClick={() => onClose(id)}
          className="text-white hover:opacity-80 transition-opacity flex-shrink-0"
          aria-label="Close notification"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export interface ToastContainerProps {
  toasts: Array<{
    id: string
    message: string
    type?: ToastType
    duration?: number
  }>
  onClose: (id: string) => void
}

/**
 * Container for rendering multiple toasts
 * Positioned at top-right of screen
 */
export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={onClose} />
      ))}
    </div>
  )
}
