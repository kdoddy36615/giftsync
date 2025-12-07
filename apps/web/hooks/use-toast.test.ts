import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useToast } from './use-toast'

describe('useToast', () => {
  it('should initialize with empty toasts array', () => {
    const { result } = renderHook(() => useToast())
    expect(result.current.toasts).toEqual([])
  })

  it('should add a toast', () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      result.current.showToast('Test message')
    })

    expect(result.current.toasts).toHaveLength(1)
    expect(result.current.toasts[0].message).toBe('Test message')
    expect(result.current.toasts[0].type).toBe('info')
  })

  it('should add toast with custom type', () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      result.current.showToast('Success message', 'success')
    })

    expect(result.current.toasts[0].type).toBe('success')
  })

  it('should add toast with custom duration', () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      result.current.showToast('Test message', 'info', 5000)
    })

    expect(result.current.toasts[0].duration).toBe(5000)
  })

  it('should generate unique IDs for toasts', () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      result.current.showToast('Message 1')
      result.current.showToast('Message 2')
    })

    expect(result.current.toasts[0].id).not.toBe(result.current.toasts[1].id)
  })

  it('should dismiss a toast by ID', () => {
    const { result } = renderHook(() => useToast())

    let toastId: string

    act(() => {
      toastId = result.current.showToast('Test message')
    })

    expect(result.current.toasts).toHaveLength(1)

    act(() => {
      result.current.dismissToast(toastId)
    })

    expect(result.current.toasts).toHaveLength(0)
  })

  it('should handle multiple toasts', () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      result.current.showToast('Message 1')
      result.current.showToast('Message 2')
      result.current.showToast('Message 3')
    })

    expect(result.current.toasts).toHaveLength(3)
  })

  it('should dismiss only the specified toast', () => {
    const { result } = renderHook(() => useToast())

    let id1: string, id2: string, id3: string

    act(() => {
      id1 = result.current.showToast('Message 1')
      id2 = result.current.showToast('Message 2')
      id3 = result.current.showToast('Message 3')
    })

    act(() => {
      result.current.dismissToast(id2)
    })

    expect(result.current.toasts).toHaveLength(2)
    expect(result.current.toasts.find((t) => t.id === id1)).toBeDefined()
    expect(result.current.toasts.find((t) => t.id === id2)).toBeUndefined()
    expect(result.current.toasts.find((t) => t.id === id3)).toBeDefined()
  })

  it('should show success toast with success helper', () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      result.current.success('Success message')
    })

    expect(result.current.toasts[0].type).toBe('success')
    expect(result.current.toasts[0].message).toBe('Success message')
  })

  it('should show error toast with error helper', () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      result.current.error('Error message')
    })

    expect(result.current.toasts[0].type).toBe('error')
    expect(result.current.toasts[0].message).toBe('Error message')
  })

  it('should show info toast with info helper', () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      result.current.info('Info message')
    })

    expect(result.current.toasts[0].type).toBe('info')
    expect(result.current.toasts[0].message).toBe('Info message')
  })

  it('should allow custom duration with helper methods', () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      result.current.success('Success message', 5000)
    })

    expect(result.current.toasts[0].duration).toBe(5000)
  })

  it('should return toast ID from helper methods', () => {
    const { result } = renderHook(() => useToast())

    let id = ''

    act(() => {
      id = result.current.success('Success message')
    })

    expect(result.current.toasts[0].id).toBe(id)
  })
})
