import { describe, it, expect } from 'vitest';
import { trustUX } from '@/lib/intel/trustUX';

describe('trustUX', () => {
  it('should be an array of trust messages', () => {
    expect(Array.isArray(trustUX)).toBe(true);
    expect(trustUX.length).toBeGreaterThan(0);
  });

  it('should have valid message types', () => {
    const validTypes = ['UNKNOWN', 'CAUTION', 'AVOID', 'SAFE', 'LIMITATION'];
    trustUX.forEach((item) => {
      expect(validTypes).toContain(item.type);
    });
  });

  it('should have non-empty message arrays', () => {
    trustUX.forEach((item) => {
      expect(Array.isArray(item.messages)).toBe(true);
      expect(item.messages.length).toBeGreaterThan(0);
      item.messages.forEach((msg) => {
        expect(typeof msg).toBe('string');
        expect(msg.trim().length).toBeGreaterThan(0);
      });
    });
  });

  it('should have unique types', () => {
    const types = trustUX.map((item) => item.type);
    const uniqueTypes = new Set(types);
    expect(uniqueTypes.size).toBe(types.length);
  });
});
