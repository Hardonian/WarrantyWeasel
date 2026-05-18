import { describe, it, expect } from 'vitest'
import * as constants from '@/lib/intel/constants'

describe('intel constants', () => {
  describe('scalar values', () => {
    it('should have correct numeric constants', () => {
      expect(constants.MAX_RESPONSE_SIZE).toBe(2 * 1024 * 1024)
      expect(constants.FETCH_TIMEOUT).toBe(15000)
      expect(constants.MAX_RETRIES).toBe(3)
      expect(constants.RETRY_DELAY_BASE).toBe(1000)
      expect(constants.MAX_REVIEWS_TO_PARSE).toBe(100)
      expect(constants.MIN_REVIEWS_FOR_ANALYSIS).toBe(5)
    })
  })

  describe('array indicators and keywords', () => {
    const arrayConstants = [
      'CAPTCHA_INDICATORS',
      'WAF_INDICATORS',
      'OUT_OF_STOCK_INDICATORS',
      'JS_CHALLENGE_INDICATORS',
      'SAFETY_KEYWORDS',
      'WARRANTY_KEYWORDS',
      'COUNTERFEIT_KEYWORDS',
      'INCENTIVE_KEYWORDS',
      'SUBSCRIPTION_KEYWORDS',
      'PRIVACY_KEYWORDS',
      'REGULATORY_KEYWORDS',
      'MOBILE_USER_AGENTS'
    ] as const

    it('should be defined as non-empty arrays', () => {
      for (const name of arrayConstants) {
        const value = constants[name]
        expect(Array.isArray(value)).toBe(true)
        expect(value.length).toBeGreaterThan(0)
      }
    })

    it('CAPTCHA_INDICATORS should contain specific known indicators', () => {
      expect(constants.CAPTCHA_INDICATORS).toContain('captcha')
      expect(constants.CAPTCHA_INDICATORS).toContain('hcaptcha')
    })

    it('WAF_INDICATORS should contain specific known indicators', () => {
      expect(constants.WAF_INDICATORS).toContain('blocked')
      expect(constants.WAF_INDICATORS).toContain('forbidden')
    })

    it('MOBILE_USER_AGENTS should contain expected string patterns', () => {
        expect(constants.MOBILE_USER_AGENTS[0]).toContain('Mozilla')
        expect(constants.MOBILE_USER_AGENTS[0]).toContain('Mobile')
    })
  })

  describe('string and object constants', () => {
    it('should have a valid DESKTOP_USER_AGENT string', () => {
      expect(typeof constants.DESKTOP_USER_AGENT).toBe('string')
      expect(constants.DESKTOP_USER_AGENT.length).toBeGreaterThan(0)
      expect(constants.DESKTOP_USER_AGENT).toContain('Mozilla')
    })

    it('should have DEFAULT_HEADERS object with required keys', () => {
      expect(typeof constants.DEFAULT_HEADERS).toBe('object')
      expect(constants.DEFAULT_HEADERS).not.toBeNull()
      expect(constants.DEFAULT_HEADERS).toHaveProperty('Accept')
      expect(constants.DEFAULT_HEADERS).toHaveProperty('Connection')
    })
  })
})
