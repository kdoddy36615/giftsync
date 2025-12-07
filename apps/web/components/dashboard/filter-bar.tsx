'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import type { FilterType } from '@/types/dashboard'

export interface FilterBarProps {
  activeFilter: FilterType
  onFilterChange: (filter: FilterType) => void
}

export const FilterBar: React.FC<FilterBarProps> = ({ activeFilter, onFilterChange }) => {
  return (
    <div className="flex items-center gap-2 bg-[#141414] px-5 py-4 border-b border-[#2d2d2d]">
      <label className="text-[0.75em] uppercase tracking-widest font-semibold text-[#71717a] mr-1">
        View:
      </label>
      <Button
        variant={activeFilter === 'all' ? 'primary' : 'secondary'}
        size="sm"
        onClick={() => onFilterChange('all')}
        className="text-sm font-medium"
      >
        All
      </Button>
      <Button
        variant={activeFilter === 'required' ? 'primary' : 'secondary'}
        size="sm"
        onClick={() => onFilterChange('required')}
        className="text-sm font-medium"
      >
        Required
      </Button>
      <Button
        variant={activeFilter === 'optional' ? 'primary' : 'secondary'}
        size="sm"
        onClick={() => onFilterChange('optional')}
        className="text-sm font-medium"
      >
        Optional
      </Button>
      <Button
        variant={activeFilter === 'high-value' ? 'primary' : 'secondary'}
        size="sm"
        onClick={() => onFilterChange('high-value')}
        className="text-sm font-medium"
      >
        High Value
      </Button>
    </div>
  )
}
