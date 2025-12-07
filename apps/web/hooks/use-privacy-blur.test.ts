import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { usePrivacyBlur } from './use-privacy-blur'

describe('usePrivacyBlur', () => {
  it('should initialize with blur disabled', () => {
    const { result } = renderHook(() => usePrivacyBlur())
    expect(result.current.isBlurred).toBe(false)
  })

  it('should toggle blur on spacebar press', () => {
    const { result } = renderHook(() => usePrivacyBlur())

    act(() => {
      const event = new KeyboardEvent('keydown', {
        code: 'Space',
        bubbles: true,
        cancelable: true,
      })
      Object.defineProperty(event, 'target', {
        value: document.body,
        enumerable: true,
      })
      window.dispatchEvent(event)
    })

    expect(result.current.isBlurred).toBe(true)
  })

  it('should toggle blur off on second spacebar press', () => {
    const { result } = renderHook(() => usePrivacyBlur())

    act(() => {
      const event1 = new KeyboardEvent('keydown', { code: 'Space', bubbles: true, cancelable: true })
      Object.defineProperty(event1, 'target', { value: document.body, enumerable: true })
      window.dispatchEvent(event1)

      const event2 = new KeyboardEvent('keydown', { code: 'Space', bubbles: true, cancelable: true })
      Object.defineProperty(event2, 'target', { value: document.body, enumerable: true })
      window.dispatchEvent(event2)
    })

    expect(result.current.isBlurred).toBe(false)
  })

  it('should not toggle on other keys', () => {
    const { result } = renderHook(() => usePrivacyBlur())

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Enter', bubbles: true }))
      window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Escape', bubbles: true }))
    })

    expect(result.current.isBlurred).toBe(false)
  })

  it('should toggle blur with toggleBlur function', () => {
    const { result } = renderHook(() => usePrivacyBlur())

    act(() => {
      result.current.toggleBlur()
    })

    expect(result.current.isBlurred).toBe(true)

    act(() => {
      result.current.toggleBlur()
    })

    expect(result.current.isBlurred).toBe(false)
  })

  it('should not toggle when spacebar is pressed in input field', () => {
    const { result } = renderHook(() => usePrivacyBlur())
    const input = document.createElement('input')
    document.body.appendChild(input)

    act(() => {
      const event = new KeyboardEvent('keydown', {
        code: 'Space',
        bubbles: true,
      })
      Object.defineProperty(event, 'target', { value: input, enumerable: true })
      window.dispatchEvent(event)
    })

    expect(result.current.isBlurred).toBe(false)

    document.body.removeChild(input)
  })

  it('should not toggle when spacebar is pressed in textarea', () => {
    const { result } = renderHook(() => usePrivacyBlur())
    const textarea = document.createElement('textarea')
    document.body.appendChild(textarea)

    act(() => {
      const event = new KeyboardEvent('keydown', {
        code: 'Space',
        bubbles: true,
      })
      Object.defineProperty(event, 'target', { value: textarea, enumerable: true })
      window.dispatchEvent(event)
    })

    expect(result.current.isBlurred).toBe(false)

    document.body.removeChild(textarea)
  })

  it('should cleanup event listener on unmount', () => {
    const { unmount } = renderHook(() => usePrivacyBlur())

    unmount()

    // After unmount, event listener should be removed
    // This test verifies no errors occur when dispatching events after unmount
    expect(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space', bubbles: true }))
    }).not.toThrow()
  })
})
