# AQA Testing Framework & Test Plan — Bat-case Project

Даний модуль містить автоматизовані тести (API та E2E) для проекту Bat-case, а також документацію тестових сценаріїв та тестових даних.

---

## 🛠 Технологічний стек
* **API Testing:** [Vitest](https://vitest.dev/) + [Supertest](https://github.com/ladjs/supertest)
* **E2E Testing:** [Playwright](https://playwright.dev/) (канал `msedge`)
* **Мови / Інструменти:** TypeScript, Node.js

---

## 📋 Test Suite & Checklist Specification

### 1. Authentication & User Profile (`/tests/api/auth.test.ts`)
#### Positive Cases:
- [x] **POST /api/auth/login**: Успішна авторизація з валідними кредами -> Повертає JWT-токен та дані про користувача (`200 OK`).
- [x] **GET /api/user/profile**: Отримання профілю авторизованого користувача з токеном -> Повертає статус, ID, баланс (`200 OK`).

#### Negative & Boundary Cases:
- [ ] **POST /api/auth/login**: Спроба входу з некоректним паролем / несучасним e-mail -> Повертає `401 Unauthorized`.
- [ ] **POST /api/auth/login**: Відправка порожнього боді або відсутніх обов'язкових полів -> Повертає `400 Bad Request`.
- [ ] **GET /api/user/profile**: Запит без заголовоку `Authorization` або з простроченим токеном -> Повертає `401 Unauthorized`.

---

### 2. Cases & Drop Logic (`/tests/api/cases.test.ts`)
#### Positive Cases:
- [x] **GET /api/cases**: Отримання списку всіх доступних кейсів -> Повертає масив кейсів з цінами та вмістом (`200 OK`).
- [x] **POST /api/cases/:id/open**: Відкриття кейсу при достатньому балансі -> Списання коштів, видача предмета в інвентар (`200 OK`).

#### Negative & Boundary Cases:
- [ ] **POST /api/cases/:id/open**: Відкриття кейсу при балансі, меншому за вартість кейсу (`balance < case.price`) -> Повертає `400 Bad Request` або `402 Payment Required` ("Недостатньо коштів").
- [ ] **POST /api/cases/:id/open**: Відкриття кейсу з балансом строго рівним 0 -> Перевірка блокування операції.
- [ ] **POST /api/cases/:id/open**: Передача неіснуючого `caseId` (UUID/number) -> Повертає `404 Not Found`.

---

### 3. Inventory & Item Economy (`/tests/api/inventory.test.ts`)
#### Positive Cases:
- [x] **GET /api/inventory**: Отримання предметів в інвентарі користувача -> Повертає перелік вибитих предметів зі статусами (`in_inventory`, `sold`).
- [x] **POST /api/inventory/:itemId/sell**: Продаж предмета з інвентарю -> Зміна статусу предмета, зарахування вартості на баланс (`200 OK`).

#### Negative & Boundary Cases:
- [ ] **POST /api/inventory/:itemId/sell**: Повторний продаж вже проданого предмета -> Повертає `400 Bad Request` / `409 Conflict`.
- [ ] **POST /api/inventory/:itemId/sell**: Продаж чужого предмета (іншого `userId`) -> Повертає `403 Forbidden` або `404 Not Found`.

---

### 4. Admin Management & Access Control (`/tests/api/admin.test.ts`)
#### Positive Cases:
- [x] **POST /api/admin/cases**: Створення нового кейсу під обліковим записом з роллю `ADMIN` -> Кейс успішно створюється (`201 Created`).

#### Negative & Access Boundary Cases:
- [ ] **POST /api/admin/cases**: Спроба створення кейсу звичайним користувачем (роль `USER`) -> Повертає `403 Forbidden`.
- [ ] **POST /api/admin/cases**: Спроба створення кейсу незаавторизованим запитом -> Повертає `401 Unauthorized`.
- [ ] **POST /api/admin/cases**: Передача від'ємної ціни кейсу (`price: -100`) або некоректних шансів випадіння предметів -> Повертає `400 Bad Request` (Валідація полів).

---

##  Команди для запуску автотестів

```bash
# Запуск API-тестів (Vitest)
npm run test:api

# Запуск E2E-тестів у головному режимі (Playwright)
npm run test:e2e

# Запуск Playwright у режимі UI (Інтерактивна панель)
npx playwright test --ui