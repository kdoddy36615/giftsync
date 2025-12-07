/**
 * URL Validation Utilities
 * Prevents XSS attacks via malicious URLs like javascript: or data: URIs
 */

/**
 * Checks if a URL is a valid HTTP/HTTPS URL
 */
export function isValidHttpUrl(url: string): boolean {
  if (!url || typeof url !== 'string') {
    return false
  }

  try {
    const parsed = new URL(url)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

/**
 * Sanitizes a URL by validating it and returning a safe fallback if invalid
 * @param url - The URL to sanitize
 * @param fallback - Optional fallback URL (defaults to '#')
 * @returns A safe URL or the fallback
 */
export function sanitizeUrl(url: string, fallback: string = '#'): string {
  return isValidHttpUrl(url) ? url : fallback
}

/**
 * Validates and normalizes a URL string
 * - Trims whitespace
 * - Validates protocol
 * - Returns null if invalid
 */
export function validateUrl(url: string): string | null {
  if (!url || typeof url !== 'string') {
    return null
  }

  const trimmed = url.trim()

  if (!trimmed) {
    return null
  }

  return isValidHttpUrl(trimmed) ? trimmed : null
}
