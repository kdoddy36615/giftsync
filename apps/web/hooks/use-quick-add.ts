import { useState, useEffect, useCallback } from 'react'
import type { QuickAddResult, QuickAddData } from '@/types/ai'

export interface BudgetData {
  remainingCents: number
  totalCents: number
  percentUsed: number
  estimatedRequestsRemaining: number
  estimatedTotalRequests: number
}

interface UseQuickAddReturn {
  fetchAIData: (itemName: string, recipientContext?: string) => Promise<void>
  isLoading: boolean
  error: string | null
  data: QuickAddData | null
  reset: () => void
  budget: BudgetData | null
  budgetLoading: boolean
  refreshBudget: () => Promise<void>
}

export function useQuickAdd(): UseQuickAddReturn {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<QuickAddData | null>(null)
  const [budget, setBudget] = useState<BudgetData | null>(null)
  const [budgetLoading, setBudgetLoading] = useState(false)

  const refreshBudget = useCallback(async () => {
    setBudgetLoading(true)
    try {
      const response = await fetch('/api/ai/budget')
      const result = await response.json()
      if (result.success) {
        setBudget(result.data)
      }
    } catch {
      // Budget fetch failure is non-critical
    } finally {
      setBudgetLoading(false)
    }
  }, [])

  // Fetch budget on mount
  useEffect(() => {
    refreshBudget()
  }, [refreshBudget])

  const fetchAIData = async (itemName: string, recipientContext?: string) => {
    setIsLoading(true)
    setError(null)
    setData(null)

    try {
      const response = await fetch('/api/ai/quick-add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemName, recipientContext }),
      })

      const result: QuickAddResult = await response.json()

      if (!result.success) {
        setError(result.error)
        return
      }

      setData(result.data)
      // Refresh budget after successful AI call
      refreshBudget()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch AI suggestions')
    } finally {
      setIsLoading(false)
    }
  }

  const reset = () => {
    setIsLoading(false)
    setError(null)
    setData(null)
  }

  return {
    fetchAIData,
    isLoading,
    error,
    data,
    reset,
    budget,
    budgetLoading,
    refreshBudget,
  }
}
