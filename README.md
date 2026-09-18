# bat-case

Virtual item case-opening platform based on Steam skins, powered by a Provably Fair RNG algorithm.

---

## 1. Project Description

**Bat-case** is a full-stack web application designed for opening virtual cases containing CS:GO / CS2 / Dota 2 skins. Users can log in using their Steam accounts, top up their internal balance, purchase and open virtual cases, view their inventory, sell dropped items back to the platform, or withdraw them directly to their Steam inventory using a Steam Trade URL. 

### Core Features
- **Steam OpenID Authentication:** Secure login without storing passwords.
- **Case Opening Engine:** Server-authoritative random drop generator with Provably Fair verification.
- **Inventory Management:** Instant item selling for account balance or withdrawal via Steam Trade URL.
- **Admin Dashboard:** Tools for managing cases, item odds (weights), viewing revenue analytics, and inspecting system logs.

---

## 2. Team Members and Roles

- **Team Lead & UI/UX Designer:** Overall project coordination, specification analysis, user flows, Trello Kanban management, wireframing, and final presentation design.
- **Frontend Developer:** UI implementation, responsive layout, Framer Motion case-spinning animation, Redux Toolkit state management, and API integration.
- **Backend Developer:** PostgreSQL schema design, Node.js server architecture, Steam OpenID auth flow, Provably Fair RNG engine, and API routes.
- **AQA Engineer:** Test planning, test cases creation, API automated testing (Supertest + Vitest), and E2E browser automation (Playwright).

---

## 3. Technology Stack

- **Frontend:** Next.js (React), JavaScript / TypeScript, Redux Toolkit, Framer Motion, HTML5, CSS3 / Tailwind CSS
- **Backend:** Node.js, Express.js / Fastify
- **Database:** PostgreSQL
- **Web Server / Reverse Proxy:** Nginx
- **Testing & Quality Assurance:** Vitest, Supertest, Playwright
- **Project Tools:** Git, GitHub, Trello

---

## 4. Installation Instructions

Follow these steps to set up the project locally:

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/your-username/bat-case.git](https://github.com/your-username/bat-case.git)
   cd bat-case
# Install root dependencies
npm install

# If using separate client/server packages:
cd client && npm install
cd ../server && npm install

## 5. Environment Configuration

Create a `.env` file in the root/server directory based on the provided `.env.example` template:

## 6. Database Setup

# Run migrations
npm run db:migrate

# Seed initial case catalog and skins
npm run db:seed

## 7. Application Start Command

npm run dev

## 8. Test Command

# Run unit and API tests (Vitest + Supertest)
npm run test:api

# Run E2E interface tests (Playwright)
npm run test:e2e

# Run all automated tests sequentially
npm run test

## 9. Test Account Information

The platform utilizes Steam OpenID for user authentication. Role-Based Access Control (RBAC) separates standard players from administrators.

### 1. Regular User (Player Role)
* **How to authenticate:** Click the "Sign in with Steam" button on the frontend and log in with **any valid Steam account**.
* **Permissions:** Access to case catalog, opening cases, managing personal inventory, selling skins, setting Steam Trade URL, and balance top-up.
* **Default Role:** `Player`.

### 2. Administrator Account (Admin Role)
* **Pre-seeded Admin SteamID:** `76561198000000000` *(або вкажіть ваш реальний SteamID64, який ви засідили у БД)*
* **How to test Admin access:**
  1. Ensure you have run `npm run db:seed` to populate the database with pre-configured admin permissions for this SteamID.
  2. Log in using the designated administrator Steam account.
  3. Navigate to `/admin` or access protected administrative API routes (`/api/admin/*`).
* **Permissions:** Managing cases (CRUD), updating drop chances/weights, viewing platform revenue analytics, and accessing system logs.

## 10. API Documentation

### Authentication & Sessions
- `GET /api/auth/steam` — Initializes Steam OpenID login flow.
- `GET /api/auth/steam/callback` — Validates SteamID64 response and sets HTTP-only session cookie.
- `POST /api/auth/logout` — Destroys current user session.
- `GET /api/auth/me` — Verifies active session and returns profile data on page reload.

### Users & Inventory
- `GET /api/users/profile` — Retrieves profile data, account balance, and inventory.
- `PUT /api/users/trade-url` — Updates the user's Steam Trade URL.
- `POST /api/payments/deposit` — Tops up internal balance.
- `GET /api/payments/history` — Fetches last 1000 payment transactions.

### Cases & Gameplay
- `GET /api/cases` — Returns a list of all available cases and prices.
- `GET /api/cases/:caseId` — Retrieves specific case details and item drop chances.
- `POST /api/cases/:caseId/open` — Executes RNG opening algorithm, deducts balance, awards skin, logs event.
- `GET /api/cases/:caseId/drops` — Fetches recent drop history for a specific case.

### Inventory & Trading
- `GET /api/inventory` — Lists all items dropped by the user.
- `POST /api/inventory/:itemId/sell` — Sells item back to platform for instant balance credit.
- `POST /api/inventory/:itemId/withdraw` — Requests item transfer to Steam via Trade URL.

### Admin Panel (`/api/admin/*`)
- `GET /api/admin/analytics` — Views platform revenue and user metrics.
- `GET /api/admin/users` — Manages registered user accounts.
- `POST /api/admin/cases` — Creates a new case with item odds.
- `PUT /api/admin/cases/:caseId` — Modifies case items, prices, and drop weights.
- `DELETE /api/admin/cases/:caseId` — Removes a case from catalog.
- `GET /api/admin/logs` — Retrieves system audit logs.

## 11. Screenshots

![SkinReceived](https://media.discordapp.net/attachments/1548312441031630982/1550187438704435300/2026-09-17_194624.png?ex=6aaebd8e&is=6aad6c0e&hm=6955f7be1f172f30b8dbe71745c49ce9782782245570d90c4ef95a81fc78200e&=&format=webp&quality=lossless)
![MainPage](https://media.discordapp.net/attachments/1548312441031630982/1550187439082180719/2026-09-17_194539.png?ex=6aaebd8e&is=6aad6c0e&hm=1715799f90fe3a9d392f4c522f739acb5933950c68c133c7e249e81383f5603e&=&format=webp&quality=lossless)
![CasePage](https://media.discordapp.net/attachments/1548312441031630982/1550187439417721003/2026-09-17_194604.png?ex=6aaebd8e&is=6aad6c0e&hm=44381ca4bff0e7403196b4ca62f67b9ce27ed23ab64f7c92cd5244a47859f1cf&=&format=webp&quality=lossless)
![SpinCase](https://media.discordapp.net/attachments/1548312441031630982/1550187439853666374/2026-09-17_194617.png?ex=6aaebd8e&is=6aad6c0e&hm=78947c1db0d058fbd1084768a69fc766f4deb6ef7e1282b82022bbde267c96d3&=&format=webp&quality=lossless)
![AccountPage](https://media.discordapp.net/attachments/1548312441031630982/1550188915447697408/image.png?ex=6aaebeee&is=6aad6d6e&hm=7011da14de65b53bd8fe659c5eb80ac64a1cfce8352f94341758375cf15c5b80&=&format=webp&quality=lossless)
![UpgradePage](https://media.discordapp.net/attachments/1548312441031630982/1550188984968159323/image.png?ex=6aaebeff&is=6aad6d7f&hm=b855429cf0e396062252f6d7fb268e4f4cedef001f26213ca60b398b0e3e54ae&=&format=webp&quality=lossless)
![DataBaseScheme](https://media.discordapp.net/attachments/1548312589984075838/1550608747611684944/image.png?ex=6aaef46e&is=6aada2ee&hm=c7ce597d66bf3a64d0bdfb81d0e8ea62968e1a8db62a434bb7d4e08b93a6af33&=&format=webp&quality=lossless)
![AutoTests](https://media.discordapp.net/attachments/1548312589984075838/1550636308249186324/image.png?ex=6aaf0e19&is=6aadbc99&hm=f9cf2bdc120006acdc6c06f88b3a56511edb9c7d2b1ee87cf9c147a9916f1986&=&format=webp&quality=lossless)

