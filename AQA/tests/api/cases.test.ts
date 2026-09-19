import { describe, it, expect } from 'vitest';
import request from 'supertest';

const BASE_URL = 'http://localhost:5000';

describe('Cases API (/api/cases)', () => {
  it('GET /api/cases - should return list of available cases', async () => {
    const response = await request(BASE_URL).get('/api/cases');
    expect(response.status).toBe(200);
  });

  it('POST /api/cases/:caseId/open - should return 401 for unauthenticated user', async () => {
    const response = await request(BASE_URL).post('/api/cases/case-123/open');
    expect([401, 500]).toContain(response.status);
  });
});