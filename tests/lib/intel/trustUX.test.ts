import { describe, it, expect } from 'vitest';
import { trustUX } from '@/lib/intel/trustUX';

describe('trustUX', () => {
  it('should export an array of TrustMessage objects', () => {
    expect(Array.isArray(trustUX)).toBe(true);
    expect(trustUX.length).toBeGreaterThan(0);
  });

  it('each object should have a valid type', () => {
    const validTypes = ['UNKNOWN', 'CAUTION', 'AVOID', 'SAFE', 'LIMITATION'];
    trustUX.forEach(entry => {
      expect(validTypes).toContain(entry.type);
    });
  });

  it('each object should have a non-empty messages array of strings', () => {
    trustUX.forEach(entry => {
      expect(Array.isArray(entry.messages)).toBe(true);
      expect(entry.messages.length).toBeGreaterThan(0);
      entry.messages.forEach(message => {
        expect(typeof message).toBe('string');
        expect(message.trim().length).toBeGreaterThan(0);
      });
    });
  });

  it('should have unique types for each entry', () => {
    const types = trustUX.map(entry => entry.type);
    const uniqueTypes = new Set(types);
    expect(uniqueTypes.size).toBe(types.length);
  });

  it('should include expected types', () => {
    const types = trustUX.map(entry => entry.type);
    expect(types).toContain('UNKNOWN');
    expect(types).toContain('CAUTION');
    expect(types).toContain('AVOID');
    expect(types).toContain('LIMITATION');
  });
});
