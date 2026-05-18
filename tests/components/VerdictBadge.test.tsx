import { render, screen, cleanup } from '@testing-library/react'
import { describe, it, expect, afterEach } from 'vitest'
import React from 'react'
import VerdictBadge from '@/components/VerdictBadge'
import type { Verdict } from '@/types'

describe('VerdictBadge', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders BUY verdict correctly', () => {
    render(<VerdictBadge verdict="BUY" confidence={95} />)

    // Check if the label is rendered
    expect(screen.getByText('BUY')).toBeDefined()
    // Check if the confidence percentage is rendered
    expect(screen.getByText('95%')).toBeDefined()
    // Check for the confidence text
    expect(screen.getByText('confidence')).toBeDefined()

    // Check if the correct classes are applied
    const badge = screen.getByText('BUY')
    expect(badge.className).toContain('text-green-700')
    expect(badge.className).toContain('bg-green-100')
  })

  it('renders CAUTION verdict correctly', () => {
    render(<VerdictBadge verdict="CAUTION" confidence={60} />)

    expect(screen.getByText('CAUTION')).toBeDefined()
    expect(screen.getByText('60%')).toBeDefined()

    const badge = screen.getByText('CAUTION')
    expect(badge.className).toContain('text-yellow-700')
    expect(badge.className).toContain('bg-yellow-100')
  })

  it('renders AVOID verdict correctly', () => {
    render(<VerdictBadge verdict="AVOID" confidence={80} />)

    expect(screen.getByText('AVOID')).toBeDefined()
    expect(screen.getByText('80%')).toBeDefined()

    const badge = screen.getByText('AVOID')
    expect(badge.className).toContain('text-red-700')
    expect(badge.className).toContain('bg-red-100')
  })

  it('renders UNKNOWN verdict correctly', () => {
    render(<VerdictBadge verdict="UNKNOWN" confidence={0} />)

    expect(screen.getByText('UNKNOWN')).toBeDefined()
    expect(screen.getByText('0%')).toBeDefined()

    const badge = screen.getByText('UNKNOWN')
    expect(badge.className).toContain('text-gray-700')
    expect(badge.className).toContain('bg-gray-100')
  })
})
