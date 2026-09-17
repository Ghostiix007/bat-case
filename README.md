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

![test](https://media.discordapp.net/attachments/1548311334544871534/1550184927390081164/image.png?ex=6aad69b7&is=6aac1837&hm=21e30cf7cec4ce4058ac29161e1fdd013b4d7f4c4cf498ec7e078b96bcdda3e9&=&format=webp&quality=lossless)
