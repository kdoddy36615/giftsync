interface LoadingSpinnerProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
}

export function LoadingSpinner({ message, size = 'md' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3 p-6">
      <div className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-[#2d2d2d] border-t-[#6366f1]`} />
      {message && <p className="text-sm text-[#a1a1aa]">{message}</p>}
    </div>
  )
}
