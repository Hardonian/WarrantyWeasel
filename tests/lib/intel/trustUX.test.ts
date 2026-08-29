import { describe, it, expect } from 'vitest';
import { trustUX } from '@/lib/intel/trustUX';

describe('trustUX', () => {
  it('should be an array of TrustMessage objects', () => {
    expect(Array.isArray(trustUX)).toBe(true);
    expect(trustUX.length).toBeGreaterThan(0);
  });

  it('should contain valid types', () => {
    const validTypes = ['UNKNOWN', 'CAUTION', 'AVOID', 'SAFE', 'LIMITATION'];
    trustUX.forEach((item) => {
      expect(validTypes).toContain(item.type);
    });
  });

  it('should have non-empty message arrays for each type', () => {
    trustUX.forEach((item) => {
      expect(Array.isArray(item.messages)).toBe(true);
      expect(item.messages.length).toBeGreaterThan(0);
      item.messages.forEach((message) => {
        expect(typeof message).toBe('string');
        expect(message.length).toBeGreaterThan(0);
      });
    });
  });

  it('should have unique message texts across all types to avoid confusion', () => {
    const allMessages = new Set<string>();
    let totalMessages = 0;

    trustUX.forEach((item) => {
      item.messages.forEach((message) => {
        allMessages.add(message);
        totalMessages++;
      });
    });

    expect(allMessages.size).toBe(totalMessages);
  });
});
