import { describe, it, expect } from 'vitest'
import { detectFailureType } from '@/lib/scraper/fetchController'
import {
  CAPTCHA_INDICATORS,
  WAF_INDICATORS,
  OUT_OF_STOCK_INDICATORS,
  JS_CHALLENGE_INDICATORS,
} from '@/lib/intel'

describe('detectFailureType', () => {
  it('returns FS-01 for 429 status code', () => {
    expect(detectFailureType('<html>Rate limited</html>', 429)).toBe('FS-01')
  })

  it('returns FS-05 for 403 status code with WAF indicator', () => {
    const html = `<html><body>${WAF_INDICATORS[0]}</body></html>`
    expect(detectFailureType(html, 403)).toBe('FS-05')
  })

  it('returns FS-05 for 403 status code without specific WAF indicator', () => {
    expect(detectFailureType('<html><body>Forbidden Access</body></html>', 403)).toBe('FS-05')
  })

  it('returns FS-02 for CAPTCHA indicators', () => {
    const html = `<html><body>${CAPTCHA_INDICATORS[0]}</body></html>`
    expect(detectFailureType(html, 200)).toBe('FS-02')
  })

  it('returns FS-10 for JS challenge indicators', () => {
    const html = `<html><body>${JS_CHALLENGE_INDICATORS[0]}</body></html>`
    expect(detectFailureType(html, 200)).toBe('FS-10')
  })

  it('returns FS-04 for Out of Stock indicators', () => {
    const html = `<html><body>${OUT_OF_STOCK_INDICATORS[0]}</body></html>`
    expect(detectFailureType(html, 200)).toBe('FS-04')
  })

  it('returns FS-50 for 500+ status codes', () => {
    expect(detectFailureType('<html><body>Server Error</body></html>', 500)).toBe('FS-50')
    expect(detectFailureType('<html><body>Bad Gateway</body></html>', 502)).toBe('FS-50')
    expect(detectFailureType('<html><body>Internal Server Issue</body></html>', 503)).toBe('FS-50')
  })

  it('returns FS-04 for empty 200 responses (less than 500 chars)', () => {
    const html = '<html><body>Short response</body></html>'
    expect(detectFailureType(html, 200)).toBe('FS-04')
  })

  it('returns null for normal 200 responses (>= 500 chars) without indicators', () => {
    const html = '<html><body>' + 'a'.repeat(500) + '</body></html>'
    expect(detectFailureType(html, 200)).toBeNull()
  })
})
