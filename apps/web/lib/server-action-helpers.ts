/**
 * Server Action Helpers
 * Standardized patterns for server actions to ensure consistent error handling,
 * authentication checks, and response formats
 */

import { createClient } from '@/lib/supabase/server'

/**
 * Standard success response format
 */
export type ActionSuccess<T> = {
  success: true
  data: T
}

/**
 * Standard error response format
 */
export type ActionError = {
  success: false
  error: string
  code?: string
}

/**
 * Standard action response type
 */
export type ActionResponse<T> = ActionSuccess<T> | ActionError

/**
 * Wrapper for server actions that handles common patterns:
 * - Error boundary with try/catch
 * - Consistent error response format
 * - Optional authentication check
 */
export async function withServerAction<T>(
  handler: () => Promise<T>,
  options?: {
    requireAuth?: boolean
    errorMessage?: string
  }
): Promise<ActionResponse<T>> {
  try {
    // Optional auth check
    if (options?.requireAuth) {
      const supabase = await createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        return {
          success: false,
          error: 'Not authenticated',
          code: 'AUTH_REQUIRED',
        }
      }
    }

    // Execute handler
    const data = await handler()
    return { success: true, data }
  } catch (error) {
    console.error('Server action error:', error)
    return {
      success: false,
      error: options?.errorMessage || 'An unexpected error occurred',
      code: 'INTERNAL_ERROR',
    }
  }
}

/**
 * Get authenticated user or return error
 */
export async function getAuthenticatedUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  return user
}

/**
 * Validate required fields in input data
 */
export function validateRequired<T extends Record<string, unknown>>(
  data: T,
  fields: (keyof T)[]
): ActionError | null {
  for (const field of fields) {
    if (!data[field]) {
      return {
        success: false,
        error: `${String(field)} is required`,
        code: 'VALIDATION_ERROR',
      }
    }
  }
  return null
}

/**
 * Validate string length
 */
export function validateStringLength(
  value: string,
  fieldName: string,
  min?: number,
  max?: number
): ActionError | null {
  const trimmed = value.trim()

  if (min !== undefined && trimmed.length < min) {
    return {
      success: false,
      error: `${fieldName} must be at least ${min} characters`,
      code: 'VALIDATION_ERROR',
    }
  }

  if (max !== undefined && trimmed.length > max) {
    return {
      success: false,
      error: `${fieldName} must be less than ${max} characters`,
      code: 'VALIDATION_ERROR',
    }
  }

  return null
}
