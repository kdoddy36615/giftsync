'use client'

export interface StatusBadgeProps {
  status: 'required' | 'optional'
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const isRequired = status === 'required'

  const baseStyles = 'inline-block px-2 py-1 rounded text-xs font-semibold uppercase'
  const variantStyles = isRequired
    ? 'bg-[rgba(16,185,129,0.2)] text-[#10b981]'
    : 'bg-[rgba(245,158,11,0.2)] text-[#f59e0b]'

  return (
    <span className={`${baseStyles} ${variantStyles}`}>
      {status}
    </span>
  )
}
