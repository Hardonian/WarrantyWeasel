import { describe, it, expect } from 'vitest'
import {
  failureScenarios,
  getAllFailureIds,
  getFailureScenario,
  getFailureByTrigger,
} from '@/lib/intel/failureRegistry'

describe('Failure Registry', () => {
  it('should export an array of failure scenarios', () => {
    expect(Array.isArray(failureScenarios)).toBe(true)
    expect(failureScenarios.length).toBeGreaterThan(0)
    expect(failureScenarios[0]).toHaveProperty('id')
    expect(failureScenarios[0]).toHaveProperty('scenario')
  })

  describe('getAllFailureIds', () => {
    it('should return an array of all failure IDs', () => {
      const ids = getAllFailureIds()
      expect(Array.isArray(ids)).toBe(true)
      expect(ids.length).toBe(failureScenarios.length)
      expect(ids[0]).toBe(failureScenarios[0].id)
    })
  })

  describe('getFailureScenario', () => {
    it('should return the correct failure scenario by ID', () => {
      const firstScenario = failureScenarios[0]
      const result = getFailureScenario(firstScenario.id)
      expect(result).toBeDefined()
      expect(result?.id).toBe(firstScenario.id)
    })

    it('should return undefined for an invalid ID', () => {
      const result = getFailureScenario('INVALID-ID-THAT-DOES-NOT-EXIST')
      expect(result).toBeUndefined()
    })
  })

  describe('getFailureByTrigger', () => {
    it('should return the correct failure scenario by trigger', () => {
      const firstScenario = failureScenarios[0]
      const result = getFailureByTrigger(firstScenario.trigger)
      expect(result).toBeDefined()
      expect(result?.id).toBe(firstScenario.id)
    })

    it('should return undefined for an invalid trigger', () => {
      const result = getFailureByTrigger('invalid trigger string that does not match')
      expect(result).toBeUndefined()
    })
  })
})
