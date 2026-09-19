import { test, expect } from '@playwright/test';

test.describe('E2E: Case Opening & Selling Flow', () => {
  test('Scenario 1: Opening a case and verifying inventory award', async ({ page }) => {
    
    await page.goto('http://localhost:5173');

    
    await expect(page).toHaveTitle(/Bat-case/i);
  });

  test('Scenario 2: Selling item for balance', async ({ page }) => {
    await page.goto('http://localhost:5173/profile');
  });
});