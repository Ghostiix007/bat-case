# Backend Specification — Bat-Case

Документ для бекенд-розробника. Описує, що зараз працює, що замокано на фронті
і які ендпоінти/моделі треба реалізувати. Фронтенд: React + Vite у `../Front`
(dev-сервер `http://localhost:5173`).

---

## 1. Поточний стан

| Частина | Де зараз | Стан |
|---|---|---|
| Steam OpenID auth | `Front/steamAuthPlugin.js` (Vite middleware) | Працює, сесії в `Map` у пам'яті — треба перенести на бекенд з БД |
| Користувачі, баланс | `Front/src/main.jsx` → `useState` | Мок, губиться при reload |
| Кейси, дропи, ціни | `main.jsx` → `const cases`, `const skinCatalog`, `const skinImages` | Хардкод-константи |
| Інвентар, відкриття, продаж | `main.jsx` → `openCase`, `quickSell`, `sellAll` | Мок на клієнті |
| Апгрейд | `main.jsx` → `runUpgrade`, `calculateUpgradeChance` | Мок на клієнті |
| Депозит | `DepositView` → `+100 cr` | Демо, без платежів |
| Адмінка `/admin` | `admin/admin` хардкод | Демо, потрібна реальна авторизація |

Після впровадження бекенду стан з `main.jsx` має переїхати в API.
Точки інтеграції перелічені в розділі 6.

---

## 2. Існуючі auth-ендпоінти (працюють — перенести на бекенд)

Реалізовані у `Front/steamAuthPlugin.js`. Логіку Steam OpenID можна взяти звідти майже без змін.

| Метод | Шлях | Опис |
|---|---|---|
| GET | `/api/auth/steam` | Редірект на Steam OpenID (`checkid_setup`, `return_to = {origin}/api/auth/steam/callback`, `realm = {origin}/`) |
| GET | `/api/auth/steam/callback` | Верифікація `check_authentication` → створення сесії → редірект `/?steam=connected` або `/?steam=failed` |
| GET | `/api/auth/me` | `{ "profile": { steamId, nickname, personaState, avatar, profileUrl, connectedAt } \| null }` |
| POST | `/api/auth/logout` | Видаляє сесію → `{ "ok": true }` |

Cookie-сесія: `batcase_steam_session`, `HttpOnly; SameSite=Lax; Path=/; Max-Age=604800`.

Steam-профіль: якщо є `STEAM_API_KEY` — `ISteamUser/GetPlayerSummaries`, інакше
fallback на `https://steamcommunity.com/profiles/{steamId}?xml=1`.

При першому логіні створювати `users` запис (upsert по `steam_id`).

---

## 3. Нові ендпоінти (треба реалізувати)

Формат відповідей — JSON. Помилки: `{ "error": "текст" }` з відповідним HTTP-кодом.
Всі ендпоінти нижче вимагають сесії (крім публічних, помічених `[public]`).

### 3.1 Стан користувача

```
GET /api/user/state
→ {
    "balance": 30,
    "freeCaseAvailable": true,        // чи не використане безкоштовне відкриття
    "inventory": [ { "id", "name", "weapon", "rarity", "price", "wear" } ]
  }
```

### 3.2 Кейси і скини `[public]`

```
GET /api/cases
→ [ { "id", "name", "type", "code", "price", "volatility", "accent",
      "drops": ["Skin | Name", ...] } ]

GET /api/skins?search=&sort=price_asc|price_desc|name
→ [ { "name", "weapon", "rarity", "price", "imageUrl" } ]
```

`type`: `default | tactical | premium | mythic`. Кейс з `price = 0` — безкоштовний
(фронт групує його окремо в секцію "Безкоштовний").

### 3.3 Відкриття кейсів (підтримка мульти-відкриття)

```
POST /api/cases/:caseId/open
  body: { "count": 1 }               // 1..5 — фронт має селектор x1/x2/x3/x5
→ 200 {
    "items": [ { "id", "name", "weapon", "rarity", "price", "wear" }, ... ],
    "balance": <новий баланс>,
    "freeCaseUsed": true             // тільки для безкоштовного кейса
  }
→ 402 { "error": "Недостатньо кредитів..." }
→ 403 { "error": "Безкоштовне відкриття вже використано" }
```

⚠️ Сервер МАЄ кидати дроп і повертати фінальні предмети — фронт показує по одній
рулетці на кожен предмет і зупиняє їх на `items[]` з відповіді.

Бізнес-правила — у розділі 5.

### 3.4 Інвентар

```
POST /api/inventory/sell
  body: { "itemIds": ["id1", "id2"] }  // один або кілька предметів
→ { "balance": <новий баланс>, "inventory": [ ... ] }

POST /api/inventory/sell-all
→ { "balance": <новий баланс>, "soldCount": n }
```

### 3.5 Апгрейд

```
POST /api/upgrade
  body: { "itemId", "targetName" }     // targetName — назва скіна-цілі
→ {
    "won": true|false,
    "roll": 12.3,                      // 0–100, сервер генерує
    "chance": 34,                      // % який був (див. формулу нижче)
    "item": { ... } | null,            // новий предмет при виграші
    "inventory": [ ... ],              // оновлений інвентар (вхідний предмет спалено)
    "consumedItemId": "..."            
  }
→ 404 { "error": "item not found" }
```

Ціль підбирається на фронті з каталогу за `item.price × multiplier` (x2/x5/x10)
— бекенд має лише валідувати: ціль існує в `skins`, її ціна > ціни входу.

### 3.6 Депозит (демо)

```
POST /api/deposit
  body: { "method": "card|crypto|paypal|bank", "amount": 100 }
→ { "balance": <новий баланс>, "depositId": "..." }
```

Платежів нема — просто транзакція типу `deposit`. Пізніше тут підключиться платіжка.

### 3.7 Адмін

Авторизація адміна — окремо від Steam (env-кредами або таблицею `admin_users` + JWT/сесія).
Зараз на фронті демо `admin/admin` — це треба замінити.

```
POST   /api/admin/login                      { login, password } → { "ok": true } + admin-сесія
GET    /api/admin/users                      → [ { "id", "steamId", "nickname", "balance", "connectedAt" } ]
PATCH  /api/admin/users/:id/balance          { "balance": n } → { "ok": true }
PATCH  /api/admin/cases/:id                  { "price": n } → { "ok": true }
POST   /api/admin/cases/:id/drops            { "skin": "..." } → { "ok": true }
DELETE /api/admin/cases/:id/drops/:skinName  → { "ok": true }   // skinName URL-encoded
POST   /api/admin/skins                      { name, rarity, price, imageUrl } → створення скіна
```

---

## 4. Моделі БД (рекомендовані таблиці)

```sql
users (
  id            PK
  steam_id      TEXT UNIQUE NOT NULL
  nickname      TEXT
  avatar        TEXT
  profile_url   TEXT
  balance       INT  DEFAULT 30
  free_case_used BOOLEAN DEFAULT FALSE   -- чи використав Starter Case
  is_admin      BOOLEAN DEFAULT FALSE
  created_at    TIMESTAMP
  last_login_at TIMESTAMP
)

skins (
  id         PK
  name       TEXT UNIQUE NOT NULL        -- "AWP | Atheris"
  weapon     TEXT                        -- "AWP"
  rarity     TEXT CHECK (rarity IN ('consumer','industrial','milspec',
                                    'restricted','classified','covert','mythic'))
  price      INT
  image_url  TEXT
)

cases (
  id         PK / TEXT id ('starter-free', 'op-bravo', ...)
  name       TEXT
  type       TEXT CHECK (type IN ('default','tactical','premium','mythic'))
  code       TEXT
  price      INT                         -- 0 = безкоштовний
  volatility TEXT                        -- 'Low' | 'Mid' | 'High'
  accent     TEXT                        -- hex-колір для UI
)

case_drops (
  case_id  FK → cases
  skin_id  FK → skins
  UNIQUE (case_id, skin_id)
)

inventory_items (
  id          PK
  user_id     FK → users
  skin_id     FK → skins
  price       INT                        -- ціна на момент отримання (з variance)
  wear        TEXT                       -- 'Factory New' | 'Minimal Wear' | 'Field-Tested' | 'Battle-Scarred'
  source      TEXT                       -- 'case' | 'upgrade' | 'admin'
  created_at  TIMESTAMP
)

case_openings (
  id        PK
  user_id   FK
  case_id   FK
  item_id   FK → inventory_items
  created_at TIMESTAMP
)

transactions (
  id            PK
  user_id       FK
  type          TEXT                     -- 'deposit' | 'sell' | 'case_open' | 'upgrade_win' | 'upgrade_loss' | 'admin_adjust'
  amount        INT                      -- +/- зміна балансу
  balance_after INT
  meta          JSONB                    -- {caseId, itemId, ...}
  created_at    TIMESTAMP
)

sessions (
  id         PK  (token)
  user_id    FK
  expires_at TIMESTAMP
)
```

Сіди: `cases`, `case_drops`, `skins` — взяти з констант `cases`, `skinCatalog`,
`skinImages` у `Front/src/main.jsx` (рядки ~141–460).

---

## 5. Бізнес-правила (точно як на фронті)

### Ваги дропу (`rarityDropWeight`)

```
consumer 72 · industrial 56 · milspec 44 · restricted 22
classified 10 · covert 3.4 · mythic 0.85
```

Вага конкретного скіна в кейсі:

```
weight = rarityWeight
       * clamp(case.price / skin.price, 0.12, 1)      // valuePenalty
       * premiumPenalty                               // price>=800→0.42, >=450→0.58, >=250→0.76, else 1
```

Вибір — weighted random по всім `case_drops`. При `count > 1` кожен дроп
кидається незалежно.

### Ціна згенерованого предмета

```
price = max(8, round((skin.price + case.price * 0.15) * (0.84 + rand*0.32)))
wear  = random('Factory New','Minimal Wear','Field-Tested','Battle-Scarred')
```

### Starter Case (`id = 'starter-free'`, price 0)

- Доступний 1 раз на користувача (`free_case_used`).
- Якщо дроп < 30 cr — округлити ціну предмета до 30.

### Апгрейд

```
chance = clamp(round(input.price / target.price * 100), 1, 95)
// приклад: вхід 100 cr → ціль 200 cr = 50%
roll   = rand(0..100, 1 знак після коми)
won    = roll <= chance
```

Вхідний предмет видаляється завжди. При виграші в інвентар додається предмет
цілі (`price = skins.price`, випадковий wear, `source='upgrade'`).

### Продаж

`sell` → `balance += item.price`, предмет видаляється.
`sell-all` → `balance += Σ price`, інвентар очищається.

---

## 6. Точки інтеграції у фронті (`Front/src/main.jsx`)

Замінити моки на `fetch` до API:

| Функція | Що замінити |
|---|---|
| `useEffect` (loadProfile) | додати `GET /api/user/state` → balance/inventory |
| `openCase` | `POST /api/cases/:id/open` з `{count}` → `items[]` для рулеток (`rollingItems`) |
| `quickSell` / `sellAll` | `POST /api/inventory/...` |
| `onSellAll` у OpeningView | `POST /api/inventory/sell-all` по ids дропів |
| `runUpgrade` | `POST /api/upgrade` → `won`, `roll`, `item` |
| `DepositView onDeposit` | `POST /api/deposit` |
| `updateUserBalance` | `PATCH /api/admin/users/:id` |
| `updateCasePrice` | `PATCH /api/admin/cases/:id` |
| `addSkinToCase` / `removeSkinFromCase` | `POST/DELETE /api/admin/cases/:id/drops` |
| `handleAdminLogin` | `POST /api/admin/login` |

Важливо: `cases` зараз `const` — треба перевести на `useState` + `GET /api/cases`,
інакше зміни адмінки не відобразяться. Те саме з `users` у стані App.

Dev-проксі: у `vite.config.js` додати
`server: { proxy: { "/api": "http://localhost:8080" } }` (порт бекенду),
або бекенд має обслуговувати той самий origin.

---

## 7. Env (`.env` бекенду)

```
DATABASE_URL=...
SESSION_SECRET=...
STEAM_API_KEY=             # опційно — без нього XML-fallback
STEAM_AUTH_ORIGIN=http://localhost:5173
ADMIN_LOGIN=admin
ADMIN_PASSWORD=admin
PORT=8080
```

---

## 8. Безпека — обов'язково на бекенді

- Весь дроп/шанси/баланс рахувати ТІЛЬКИ на сервері (зараз на клієнті — демо).
- Атомарні операції: відкриття кейса, продаж, апгрейд — у транзакціях БД.
- `admin/admin` — це демо-кредами на фронті, не безпека. Реальна адмінка
  потребує окремої авторизації.
- Rate-limit на `/api/cases/*/open` і `/api/upgrade`.
- Валідація: `itemId` належить поточному `user_id`, ціль апгрейду дорожча за вхід,
  `count` у діапазоні 1–5.
