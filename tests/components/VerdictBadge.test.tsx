/**
 * @vitest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import VerdictBadge from '@/components/VerdictBadge'

describe('VerdictBadge component', () => {
  it('renders BUY verdict with correct styles and label', () => {
    render(<VerdictBadge verdict="BUY" confidence={95} />)

    const labelElement = screen.getByText('BUY')
    expect(labelElement).toBeDefined()
    expect(labelElement.className).toContain('bg-green-100')
    expect(labelElement.className).toContain('text-green-700')
    expect(labelElement.className).toContain('rounded-full')
    expect(labelElement.className).toContain('px-4')
    expect(labelElement.className).toContain('py-2')
    expect(labelElement.className).toContain('text-2xl')
    expect(labelElement.className).toContain('font-bold')
  })

  it('renders CAUTION verdict with correct styles and label', () => {
    render(<VerdictBadge verdict="CAUTION" confidence={60} />)

    const labelElement = screen.getByText('CAUTION')
    expect(labelElement).toBeDefined()
    expect(labelElement.className).toContain('bg-yellow-100')
    expect(labelElement.className).toContain('text-yellow-700')
  })

  it('renders AVOID verdict with correct styles and label', () => {
    render(<VerdictBadge verdict="AVOID" confidence={80} />)

    const labelElement = screen.getByText('AVOID')
    expect(labelElement).toBeDefined()
    expect(labelElement.className).toContain('bg-red-100')
    expect(labelElement.className).toContain('text-red-700')
  })

  it('renders UNKNOWN verdict with correct styles and label', () => {
    render(<VerdictBadge verdict="UNKNOWN" confidence={0} />)

    const labelElement = screen.getByText('UNKNOWN')
    expect(labelElement).toBeDefined()
    expect(labelElement.className).toContain('bg-gray-100')
    expect(labelElement.className).toContain('text-gray-700')
  })

  it('renders confidence percentage correctly', () => {
    render(<VerdictBadge verdict="BUY" confidence={95} />)

    const confidenceElement = screen.getByText('95%')
    expect(confidenceElement).toBeDefined()
    expect(confidenceElement.className).toContain('text-3xl')
    expect(confidenceElement.className).toContain('font-bold')

    const confidenceLabelElement = screen.getByText('confidence')
    expect(confidenceLabelElement).toBeDefined()
    expect(confidenceLabelElement.className).toContain('text-sm')
    expect(confidenceLabelElement.className).toContain('text-gray-500')
  })
})
