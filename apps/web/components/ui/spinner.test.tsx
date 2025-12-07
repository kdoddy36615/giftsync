import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Spinner, LoadingOverlay, LoadingInline } from './spinner'

describe('Spinner', () => {
  it('should render with role status', () => {
    render(<Spinner />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('should have aria-label for accessibility', () => {
    render(<Spinner />)
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Loading')
  })

  it('should render sr-only text', () => {
    render(<Spinner />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('should apply medium size by default', () => {
    render(<Spinner />)
    const spinner = screen.getByRole('status')
    expect(spinner).toHaveClass('w-6', 'h-6', 'border-2')
  })

  it('should apply small size', () => {
    render(<Spinner size="sm" />)
    const spinner = screen.getByRole('status')
    expect(spinner).toHaveClass('w-4', 'h-4', 'border-2')
  })

  it('should apply large size', () => {
    render(<Spinner size="lg" />)
    const spinner = screen.getByRole('status')
    expect(spinner).toHaveClass('w-8', 'h-8', 'border-3')
  })

  it('should apply custom className', () => {
    render(<Spinner className="text-red-500" />)
    const spinner = screen.getByRole('status')
    expect(spinner).toHaveClass('text-red-500')
  })

  it('should have animate-spin class', () => {
    render(<Spinner />)
    const spinner = screen.getByRole('status')
    expect(spinner).toHaveClass('animate-spin')
  })
})

describe('LoadingOverlay', () => {
  it('should render overlay with spinner', () => {
    render(<LoadingOverlay />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('should render with message when provided', () => {
    render(<LoadingOverlay message="Loading data..." />)
    expect(screen.getByText('Loading data...')).toBeInTheDocument()
  })

  it('should not render message when not provided', () => {
    const { container } = render(<LoadingOverlay />)
    expect(container.querySelector('p')).not.toBeInTheDocument()
  })

  it('should use large spinner', () => {
    render(<LoadingOverlay />)
    const spinner = screen.getByRole('status')
    expect(spinner).toHaveClass('w-8', 'h-8')
  })

  it('should have fixed positioning for full-screen overlay', () => {
    const { container } = render(<LoadingOverlay />)
    const overlay = container.firstChild as HTMLElement
    expect(overlay).toHaveClass('fixed', 'inset-0')
  })

  it('should have high z-index for overlay', () => {
    const { container } = render(<LoadingOverlay />)
    const overlay = container.firstChild as HTMLElement
    expect(overlay).toHaveClass('z-50')
  })
})

describe('LoadingInline', () => {
  it('should render with message', () => {
    render(<LoadingInline message="Loading items..." />)
    expect(screen.getByText('Loading items...')).toBeInTheDocument()
  })

  it('should render with spinner', () => {
    render(<LoadingInline message="Loading..." />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('should use small spinner', () => {
    render(<LoadingInline message="Loading..." />)
    const spinner = screen.getByRole('status')
    expect(spinner).toHaveClass('w-4', 'h-4')
  })

  it('should display spinner and message in flex layout', () => {
    const { container } = render(<LoadingInline message="Loading..." />)
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper).toHaveClass('flex', 'items-center', 'gap-3')
  })
})
