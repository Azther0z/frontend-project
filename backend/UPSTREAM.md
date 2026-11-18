# Supplied backend

Source: https://github.com/SWDevPrac2-69-1/PJ02-EquipmentRent

Revision: `be18df9967be7e0a742b5a5ae25f07966dc4e1d4`.

The upstream package declares the ISC license. Its README, assignment notes,
source comments, and package metadata are retained. The upstream revision has
no separate LICENSE file. The upstream environment file was excluded.

Local additions: safe example configuration, ignored environment files,
optional listen host, CORS headers on rate-limit errors, and a disposable MongoDB
demo runner. Compatible dependency security updates were applied within the
supplied version ranges.

Local domain change confirmed on November 18, 2026: rental creation and updates
allow at most seven inclusive calendar days. June 10–16 is valid; June 10–17
is rejected. The upstream revision allowed seven elapsed days; this local
override aligns duration validation with the inclusive cost calculation.
Routes, authentication, ownership checks, and stock behavior are unchanged.

## Configured database

```sh
cd backend
npm ci
cp config/config.env.example config/config.env
# Set MONGO_URI and a private JWT_SECRET in config/config.env.
npm run dev
```

Swagger UI: http://localhost:5000/api-docs.

## Disposable local demo

```sh
cd backend
npm ci
npm run demo
```

The first run downloads a MongoDB binary. It starts a real temporary database
and seeds Camera, Tripod, one member rental request, and two accounts:

| Role | Email | Password |
|---|---|---|
| Member | member@example.com | DemoPass123! |
| Admin | admin@example.com | DemoPass123! |

This runner binds the API to localhost and generates its JWT secret in memory.
Stopping it removes the database. These accounts are only for this local demo.
For a shared hosted demo, use a configured database and create your own accounts.
