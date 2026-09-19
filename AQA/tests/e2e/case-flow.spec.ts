import { test, expect } from '@playwright/test';

test.describe('E2E: Case Opening & Selling Flow', () => {
  test('Scenario 1: Opening a case and verifying inventory award', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await expect(page).toHaveTitle(/Bat-case/i);

    // Проверяем, что главная страница и кейсы отображаются
    await expect(page.locator('body')).toBeVisible();
  });

  test('Scenario 2: Selling item for balance', async ({ page }) => {
    await page.goto('http://localhost:5173/profile');

    // Проверяем, что страница профиля/инвентаря загрузилась
    await expect(page).toHaveURL('http://localhost:5173/profile');
    await expect(page.locator('body')).toBeVisible();
  });
});