import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { fetchController, detectFailureType } from '@/lib/scraper/fetchController'
import { _sleep } from '@/lib/security/urlValidator'

// Mocks
global.fetch = vi.fn()

vi.mock('@/lib/security/urlValidator', () => ({
  sleep: vi.fn().mockResolvedValue(undefined),
}))

describe('fetchController', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('detectFailureType', () => {
    it('returns FS-04 for empty 200 response (length < 500)', () => {
      const html = '<html><body>Too short</body></html>'
      expect(detectFailureType(html, 200)).toBe('FS-04')
    })

    it('returns null for valid 200 response (length >= 500)', () => {
      const html = '<html><body>' + 'a'.repeat(600) + '</body></html>'
      expect(detectFailureType(html, 200)).toBeNull()
    })

    it('returns FS-01 for 429 status', () => {
      expect(detectFailureType('html', 429)).toBe('FS-01')
    })

    it('returns FS-50 for 500 status', () => {
      expect(detectFailureType('html', 500)).toBe('FS-50')
    })
  })

  describe('fetchController e2e', () => {
    it('detects empty 200 response (FS-04) due to small HTML size', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        status: 200,
        text: () => Promise.resolve('<html><body>Too short</body></html>'),
        headers: { get: () => '36' },
        redirected: false,
        url: 'https://example.com'
      })
      global.fetch = mockFetch

      const result = await fetchController('https://example.com')

      expect(result.success).toBe(false)
      expect(result.failureId).toBe('FS-04')
      expect(result.degraded).toBe(true)
    })
  })
})
