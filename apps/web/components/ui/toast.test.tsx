import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Toast, ToastContainer } from './toast'

describe('Toast', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('should render with message', () => {
    const onClose = vi.fn()
    render(<Toast id="1" message="Test message" onClose={onClose} />)
    expect(screen.getByText('Test message')).toBeInTheDocument()
  })

  it('should have role alert', () => {
    const onClose = vi.fn()
    render(<Toast id="1" message="Test" onClose={onClose} />)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('should render success type with green styling', () => {
    const onClose = vi.fn()
    const { container } = render(<Toast id="1" message="Success" type="success" onClose={onClose} />)
    const toast = container.firstChild as HTMLElement
    expect(toast.className).toContain('emerald')
  })

  it('should render error type with red styling', () => {
    const onClose = vi.fn()
    const { container } = render(<Toast id="1" message="Error" type="error" onClose={onClose} />)
    const toast = container.firstChild as HTMLElement
    expect(toast.className).toContain('red')
  })

  it('should render info type with indigo styling', () => {
    const onClose = vi.fn()
    const { container } = render(<Toast id="1" message="Info" type="info" onClose={onClose} />)
    const toast = container.firstChild as HTMLElement
    expect(toast.className).toContain('indigo')
  })

  it('should call onClose when close button is clicked', async () => {
    vi.useRealTimers() // Use real timers for this test to avoid userEvent timeout
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<Toast id="1" message="Test" onClose={onClose} />)

    const closeButton = screen.getByRole('button', { name: /close notification/i })
    await user.click(closeButton)

    expect(onClose).toHaveBeenCalledWith('1')
    vi.useFakeTimers() // Switch back to fake timers
  })

  it('should auto-dismiss after default duration (3000ms)', () => {
    const onClose = vi.fn()
    render(<Toast id="1" message="Test" onClose={onClose} />)

    expect(onClose).not.toHaveBeenCalled()

    vi.advanceTimersByTime(3000)

    expect(onClose).toHaveBeenCalledWith('1')
  })

  it('should auto-dismiss after custom duration', () => {
    const onClose = vi.fn()
    render(<Toast id="1" message="Test" duration={5000} onClose={onClose} />)

    vi.advanceTimersByTime(4999)
    expect(onClose).not.toHaveBeenCalled()

    vi.advanceTimersByTime(1)
    expect(onClose).toHaveBeenCalledWith('1')
  })

  it('should cleanup timer on unmount', () => {
    const onClose = vi.fn()
    const { unmount } = render(<Toast id="1" message="Test" onClose={onClose} />)

    unmount()
    vi.advanceTimersByTime(3000)

    expect(onClose).not.toHaveBeenCalled()
  })

  it('should render success icon for success type', () => {
    const onClose = vi.fn()
    const { container } = render(<Toast id="1" message="Success" type="success" onClose={onClose} />)
    const icon = container.querySelector('svg path[d*="M5 13l4 4L19 7"]')
    expect(icon).toBeInTheDocument()
  })

  it('should render error icon for error type', () => {
    const onClose = vi.fn()
    const { container } = render(<Toast id="1" message="Error" type="error" onClose={onClose} />)
    const icon = container.querySelector('svg path[d*="M6 18L18 6M6 6l12 12"]')
    expect(icon).toBeInTheDocument()
  })

  it('should render info icon for info type', () => {
    const onClose = vi.fn()
    const { container } = render(<Toast id="1" message="Info" type="info" onClose={onClose} />)
    const icon = container.querySelector('svg path[d*="M13 16h-1v-4h-1m1-4h.01"]')
    expect(icon).toBeInTheDocument()
  })
})

describe('ToastContainer', () => {
  it('should render nothing when toasts array is empty', () => {
    const onClose = vi.fn()
    const { container } = render(<ToastContainer toasts={[]} onClose={onClose} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('should render all toasts', () => {
    const onClose = vi.fn()
    const toasts = [
      { id: '1', message: 'Toast 1' },
      { id: '2', message: 'Toast 2' },
      { id: '3', message: 'Toast 3' },
    ]
    render(<ToastContainer toasts={toasts} onClose={onClose} />)

    expect(screen.getByText('Toast 1')).toBeInTheDocument()
    expect(screen.getByText('Toast 2')).toBeInTheDocument()
    expect(screen.getByText('Toast 3')).toBeInTheDocument()
  })

  it('should be positioned fixed at top-right', () => {
    const onClose = vi.fn()
    const toasts = [{ id: '1', message: 'Test' }]
    const { container } = render(<ToastContainer toasts={toasts} onClose={onClose} />)
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper).toHaveClass('fixed', 'top-4', 'right-4')
  })

  it('should have high z-index', () => {
    const onClose = vi.fn()
    const toasts = [{ id: '1', message: 'Test' }]
    const { container } = render(<ToastContainer toasts={toasts} onClose={onClose} />)
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper).toHaveClass('z-50')
  })

  it('should stack toasts vertically with gap', () => {
    const onClose = vi.fn()
    const toasts = [{ id: '1', message: 'Test' }]
    const { container } = render(<ToastContainer toasts={toasts} onClose={onClose} />)
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper).toHaveClass('flex', 'flex-col', 'gap-2')
  })
})
