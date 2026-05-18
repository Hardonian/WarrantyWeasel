import { describe, it, expect } from 'vitest';
import { GET } from '@/app/api/health/route';

describe('Health Check API (/api/health)', () => {
  it('should return a healthy status', async () => {
    const response = await GET();

    expect(response.status).toBe(200);

    const data = await response.json();

    expect(data).toEqual(expect.objectContaining({
      ok: true,
      status: 'healthy',
      version: '0.1.0',
    }));

    // Check if timestamp is a valid ISO string
    expect(new Date(data.timestamp).toISOString()).toBe(data.timestamp);
  });
});
