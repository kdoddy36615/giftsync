import { cn } from '@/lib/utils'

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

/**
 * Loading spinner component
 * Animated spinning circle for loading states
 */
export function Spinner({ size = 'md', className }: SpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3',
  }

  return (
    <div
      className={cn(
        'inline-block animate-spin rounded-full border-solid border-current border-r-transparent',
        sizeClasses[size],
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

/**
 * Full-page loading overlay
 * Covers entire viewport with semi-transparent background
 */
export function LoadingOverlay({ message }: { message?: string }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#141414] border-2 border-[#6366f1] rounded-lg p-8 flex flex-col items-center gap-4">
        <Spinner size="lg" className="text-[#6366f1]" />
        {message && <p className="text-[#e4e4e7] font-semibold">{message}</p>}
      </div>
    </div>
  )
}

/**
 * Inline loading state
 * Shows loading message with spinner inline
 */
export function LoadingInline({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-3 text-[#a1a1aa]">
      <Spinner size="sm" />
      <span>{message}</span>
    </div>
  )
}
