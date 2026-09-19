import { describe, it, expect } from 'vitest';
import request from 'supertest';

const BASE_URL = 'http://localhost:5000';

describe('Admin Operations API (/api/admin)', () => {
  it('GET /api/admin/analytics - should block non-admin users with 401, 403 or 404', async () => {
    const response = await request(BASE_URL).get('/api/admin/analytics');
<<<<<<< HEAD
    expect(response.status).toBe(401);
=======
    expect([401, 403, 404]).toContain(response.status);
>>>>>>> 75793ba6558046f67d1ea8b3a36ecc8aa3435cdc
  });
});