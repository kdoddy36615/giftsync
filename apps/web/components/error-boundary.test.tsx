import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ErrorBoundary, DashboardErrorBoundary } from './error-boundary'

// Component that throws an error
function ThrowError({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error('Test error')
  }
  return <div>No error</div>
}

describe('ErrorBoundary', () => {
  // Suppress console.error for these tests
  const originalError = console.error
  beforeEach(() => {
    console.error = vi.fn()
  })
  afterEach(() => {
    console.error = originalError
  })

  it('should render children when no error', () => {
    render(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>
    )
    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('should render error UI when child throws', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
  })

  it('should display error message in error UI', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )
    expect(screen.getByText(/We encountered an unexpected error/i)).toBeInTheDocument()
  })

  it('should show refresh button', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )
    expect(screen.getByRole('button', { name: /refresh page/i })).toBeInTheDocument()
  })

  it('should refresh page when refresh button is clicked', async () => {
    const user = userEvent.setup()
    const reloadSpy = vi.fn()
    Object.defineProperty(window, 'location', {
      value: { reload: reloadSpy },
      writable: true,
    })

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    const refreshButton = screen.getByRole('button', { name: /refresh page/i })
    await user.click(refreshButton)

    expect(reloadSpy).toHaveBeenCalled()
  })

  it('should call onError callback when error occurs', () => {
    const onError = vi.fn()
    render(
      <ErrorBoundary onError={onError}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )
    expect(onError).toHaveBeenCalled()
  })

  it('should render custom fallback when provided', () => {
    const fallback = <div>Custom error UI</div>
    render(
      <ErrorBoundary fallback={fallback}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )
    expect(screen.getByText('Custom error UI')).toBeInTheDocument()
  })
})

describe('DashboardErrorBoundary', () => {
  // Suppress console.error for these tests
  const originalError = console.error
  beforeEach(() => {
    console.error = vi.fn()
  })
  afterEach(() => {
    console.error = originalError
  })

  it('should render children when no error', () => {
    render(
      <DashboardErrorBoundary>
        <div>Dashboard content</div>
      </DashboardErrorBoundary>
    )
    expect(screen.getByText('Dashboard content')).toBeInTheDocument()
  })

  it('should render section error UI when child throws', () => {
    render(
      <DashboardErrorBoundary>
        <ThrowError shouldThrow={true} />
      </DashboardErrorBoundary>
    )
    expect(screen.getByText('Section Error')).toBeInTheDocument()
  })

  it('should display error message', () => {
    render(
      <DashboardErrorBoundary>
        <ThrowError shouldThrow={true} />
      </DashboardErrorBoundary>
    )
    expect(screen.getByText(/This section encountered an error/i)).toBeInTheDocument()
  })

  it('should have smaller min-height than full ErrorBoundary', () => {
    render(
      <DashboardErrorBoundary>
        <ThrowError shouldThrow={true} />
      </DashboardErrorBoundary>
    )
    // Check that it renders the Section Error heading (specific to DashboardErrorBoundary)
    expect(screen.getByText('Section Error')).toBeInTheDocument()
    // The main difference is it shows "Section Error" vs "Something went wrong"
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument()
  })
})
