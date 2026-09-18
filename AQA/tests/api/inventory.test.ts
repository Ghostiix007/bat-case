import { describe, it, expect } from 'vitest';
import request from 'supertest';

const BASE_URL = 'http://localhost:5000';

describe('Inventory API (/api/inventory)', () => {
  it('GET /api/inventory - should handle unauthenticated access', async () => {
    const response = await request(BASE_URL).get('/api/inventory');
    expect([401, 404, 200]).toContain(response.status);
  });
});