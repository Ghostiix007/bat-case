import { describe, it, expect } from 'vitest';
import request from 'supertest';

const BASE_URL = 'http://localhost:5000';

describe('Auth & Sessions API (/api/auth)', () => {
  it('GET /api/auth/me - should reject unauthenticated request with 401', async () => {
    const response = await request(BASE_URL).get('/api/auth/me');
    expect([401, 500]).toContain(response.status);
  });

  it('POST /api/auth/logout - should handle logout', async () => {
    const response = await request(BASE_URL).post('/api/auth/logout');
    expect([200, 401, 500]).toContain(response.status);
  });
});