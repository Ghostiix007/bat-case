import { describe, it, expect } from 'vitest';
import request from 'supertest';

const BASE_URL = 'http://localhost:5000';

describe('Admin Operations API (/api/admin)', () => {
  it('GET /api/admin/analytics - should block non-admin users with 401, 403 or 404', async () => {
    const response = await request(BASE_URL).get('/api/admin/analytics');
    expect([401, 403, 404]).toContain(response.status);
  });
});