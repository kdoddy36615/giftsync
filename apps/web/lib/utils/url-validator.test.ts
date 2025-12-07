import { describe, it, expect } from 'vitest'
import { isValidHttpUrl, sanitizeUrl, validateUrl } from './url-validator'

describe('URL Validator', () => {
  describe('isValidHttpUrl', () => {
    it('should accept valid HTTP URLs', () => {
      expect(isValidHttpUrl('http://example.com')).toBe(true)
      expect(isValidHttpUrl('http://example.com/path')).toBe(true)
      expect(isValidHttpUrl('http://example.com:8080')).toBe(true)
    })

    it('should accept valid HTTPS URLs', () => {
      expect(isValidHttpUrl('https://example.com')).toBe(true)
      expect(isValidHttpUrl('https://example.com/path')).toBe(true)
      expect(isValidHttpUrl('https://subdomain.example.com')).toBe(true)
    })

    it('should reject javascript: protocol', () => {
      expect(isValidHttpUrl('javascript:alert("xss")')).toBe(false)
    })

    it('should reject data: protocol', () => {
      expect(isValidHttpUrl('data:text/html,<script>alert("xss")</script>')).toBe(false)
    })

    it('should reject file: protocol', () => {
      expect(isValidHttpUrl('file:///etc/passwd')).toBe(false)
    })

    it('should reject empty string', () => {
      expect(isValidHttpUrl('')).toBe(false)
    })

    it('should reject non-string input', () => {
      expect(isValidHttpUrl(null as unknown as string)).toBe(false)
      expect(isValidHttpUrl(undefined as unknown as string)).toBe(false)
      expect(isValidHttpUrl(123 as unknown as string)).toBe(false)
    })

    it('should reject malformed URLs', () => {
      expect(isValidHttpUrl('not a url')).toBe(false)
      expect(isValidHttpUrl('htp://example.com')).toBe(false)
    })
  })

  describe('sanitizeUrl', () => {
    it('should return valid URLs unchanged', () => {
      expect(sanitizeUrl('https://example.com')).toBe('https://example.com')
      expect(sanitizeUrl('http://example.com/path')).toBe('http://example.com/path')
    })

    it('should return fallback for javascript: URLs', () => {
      expect(sanitizeUrl('javascript:alert("xss")')).toBe('#')
    })

    it('should return fallback for data: URLs', () => {
      expect(sanitizeUrl('data:text/html,<h1>test</h1>')).toBe('#')
    })

    it('should return custom fallback when provided', () => {
      expect(sanitizeUrl('javascript:alert()', '/error')).toBe('/error')
    })

    it('should return fallback for empty string', () => {
      expect(sanitizeUrl('')).toBe('#')
    })

    it('should return fallback for malformed URLs', () => {
      expect(sanitizeUrl('not a url')).toBe('#')
    })
  })

  describe('validateUrl', () => {
    it('should return valid HTTP URLs', () => {
      expect(validateUrl('http://example.com')).toBe('http://example.com')
    })

    it('should return valid HTTPS URLs', () => {
      expect(validateUrl('https://example.com')).toBe('https://example.com')
    })

    it('should trim whitespace', () => {
      expect(validateUrl('  https://example.com  ')).toBe('https://example.com')
    })

    it('should return null for invalid URLs', () => {
      expect(validateUrl('javascript:alert()')).toBe(null)
      expect(validateUrl('not a url')).toBe(null)
    })

    it('should return null for empty string', () => {
      expect(validateUrl('')).toBe(null)
      expect(validateUrl('   ')).toBe(null)
    })

    it('should return null for non-string input', () => {
      expect(validateUrl(null as unknown as string)).toBe(null)
      expect(validateUrl(undefined as unknown as string)).toBe(null)
    })
  })
})
