# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: case-flow.spec.ts >> E2E: Case Opening & Selling Flow >> Scenario 2: Selling item for balance
- Location: tests\e2e\case-flow.spec.ts:12:3

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/profile
Call log:
  - navigating to "http://localhost:3000/profile", waiting until "load"

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - generic [ref=e3]:
    - generic [ref=e6]:
      - heading "Не удается открыть эту страницу" [level=1] [ref=e7]
      - paragraph [ref=e8]:
        - strong [ref=e9]: localhost
        - text: отказано в подключении.
      - generic [ref=e10]:
        - paragraph [ref=e11]: "Попробуйте:"
        - list [ref=e12]:
          - listitem [ref=e13]: •Проверка подключения
          - listitem [ref=e14]:
            - text: •
            - link "Проверка прокси-сервера и брандмауэра" [ref=e15] [cursor=pointer]:
              - /url: "#buttons"
      - generic [ref=e16]: ERR_CONNECTION_REFUSED
    - button "Обновить" [ref=e19] [cursor=pointer]
  - generic [ref=e20]: Microsoft Edge
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('E2E: Case Opening & Selling Flow', () => {
  4  |   test('Scenario 1: Opening a case and verifying inventory award', async ({ page }) => {
  5  |     
  6  |     await page.goto('http://localhost:3000');
  7  | 
  8  |     
  9  |     await expect(page).toHaveTitle(/Bat-case/i);
  10 |   });
  11 | 
  12 |   test('Scenario 2: Selling item for balance', async ({ page }) => {
> 13 |     await page.goto('http://localhost:3000/profile');
     |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/profile
  14 |   });
  15 | });
```