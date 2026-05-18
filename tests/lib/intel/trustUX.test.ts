import { describe, it, expect } from 'vitest'
import { trustUX } from '@/lib/intel/trustUX'

describe('trustUX', () => {
  it('should be an array', () => {
    expect(Array.isArray(trustUX)).toBe(true)
  })

  it('should have correct structure for each entry', () => {
    const validTypes = ['UNKNOWN', 'CAUTION', 'AVOID', 'SAFE', 'LIMITATION']

    trustUX.forEach(entry => {
      expect(entry).toHaveProperty('type')
      expect(validTypes).toContain(entry.type)

      expect(entry).toHaveProperty('messages')
      expect(Array.isArray(entry.messages)).toBe(true)
      expect(entry.messages.length).toBeGreaterThan(0)

      entry.messages.forEach(message => {
        expect(typeof message).toBe('string')
        expect(message.length).toBeGreaterThan(0)
      })
    })
  })

  it('should contain required types', () => {
    const types = trustUX.map(entry => entry.type)

    expect(types).toContain('UNKNOWN')
    expect(types).toContain('CAUTION')
    expect(types).toContain('AVOID')
    expect(types).toContain('LIMITATION')
  })
})
