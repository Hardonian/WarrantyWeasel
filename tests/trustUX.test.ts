import { describe, it, expect } from 'vitest';
import { trustUX } from '@/lib/intel/trustUX';

describe('trustUX', () => {
  it('is defined and is an array', () => {
    expect(trustUX).toBeDefined();
    expect(Array.isArray(trustUX)).toBe(true);
  });

  it('contains expected types', () => {
    const types = trustUX.map(item => item.type);
    expect(types).toContain('UNKNOWN');
    expect(types).toContain('CAUTION');
    expect(types).toContain('AVOID');
    expect(types).toContain('LIMITATION');
  });

  it('each item has a valid type and non-empty messages array', () => {
    const validTypes = ['UNKNOWN', 'CAUTION', 'AVOID', 'SAFE', 'LIMITATION'];
    for (const item of trustUX) {
      expect(validTypes).toContain(item.type);
      expect(Array.isArray(item.messages)).toBe(true);
      expect(item.messages.length).toBeGreaterThan(0);
      for (const message of item.messages) {
        expect(typeof message).toBe('string');
        expect(message.length).toBeGreaterThan(0);
      }
    }
  });
});
