# Equipment Rental System

Saint and Poom's Course Project 2 lets members request equipment rentals and admins manage equipment and rental requests.
This repository contains the Next.js frontend, a copy of the supplied Express backend, project documentation, and 18 course PDFs.

The updated [Figma design](https://www.figma.com/design/llQS6sjdaGY3OpBfXf7NVh/SW-DEV-PRAC-2?node-id=0-1) defines the base screens and product behavior. The [November 18 decisions](docs/FRONTEND-PLAN.md#confirmed-decisions) supplement it.
The [Figma guide](docs/FIGMA.md) records the 20 screen frames and behavior note reviewed on November 16, 2026, after the agreed design updates.
The [November 18 decisions](docs/FRONTEND-PLAN.md#confirmed-decisions) confirm a simple Next.js structure with NextAuth, inline feedback, deletion confirmation, and a one-month range calendar.
These decisions supplement the saved Figma design. Backend contracts and the proposed team split remain separate references. Course PDFs are reference files, not product requirements.
The [glossary](GLOSSARY.md) defines the project terms used in these guides.
The [frontend plan](docs/FRONTEND-PLAN.md#confirmed-decisions) records the confirmed scope and separates it from implementation proposals.

## Documentation

Read the guides in this order:

1. [Figma guide](docs/FIGMA.md): source, frame inventory, and captured design evidence.
2. [Requirements](docs/REQUIREMENTS.md): Figma-based screens and behavior, plus separate backend limits.
3. [System design](docs/SYSTEM-DESIGN.md): proposed frontend, backend, and database boundaries.
4. [Frontend plan](docs/FRONTEND-PLAN.md): proposed folders, routes, components, and state.
5. [Shared contracts](docs/SHARED-CONTRACTS.md): backend data types and proposed component interfaces.
6. [API guide](docs/API.md): supplied backend routes, fields, limits, and integration gaps.
7. [Contribution guide](docs/CONTRIBUTION-HANDOFF.md): proposed ownership, build order, and integration checks.

## Repository structure

The application uses these directories:

- `frontend/`: Next.js, TypeScript, Tailwind, and NextAuth application.
- `backend/`: Copy of the supplied Express backend.
- `docs/`: Project guides, Figma evidence, and course PDFs in `docs/pdf/`.

The [supplied backend](https://github.com/SWDevPrac2-69-1/PJ02-EquipmentRent) provides account, equipment, and rental APIs.
Frontend and backend setup follows [FRONTEND-PLAN.md](docs/FRONTEND-PLAN.md).

## Run locally

Use Node.js 20.19 or newer. Run the backend and frontend in separate terminals.

For a disposable local database with demo data:

```sh
cd backend
npm ci
npm run demo
```

Wait for `Demo ready`. This runs the real Express API and a temporary MongoDB
process. The first run downloads MongoDB. Stopping the process removes its data.

| Role | Email | Password |
|---|---|---|
| Member | member@example.com | DemoPass123! |
| Admin | admin@example.com | DemoPass123! |

For a persistent local or hosted database, follow [backend setup](backend/UPSTREAM.md)
and configure your own accounts instead of using the disposable runner.

In another terminal:

```sh
cd frontend
npm ci
cp .env.example .env.local
# Replace NEXTAUTH_SECRET in .env.local with a private random value.
npm run dev
```

Open http://localhost:3000. The default API origin is `http://127.0.0.1:5000`.
IPv4 avoids macOS services that can answer on `localhost:5000` through IPv6.
Do not overwrite an existing `.env.local` when repeating setup.

## Implementation and checks

Guest equipment browsing, registration/login/logout, the member rental flow,
admin equipment CRUD, and admin rental viewing/editing/deletion are implemented.
Rentals allow at most seven inclusive calendar days (June 10–16).
All roles share the Figma browser routes. Backend roles and ownership remain the
authority. Costs use current rates and inclusive calendar days without quantity.

With both local services running as above:

```sh
cd frontend
npm run lint
npx tsc --noEmit
npm run test:unit
npx playwright install chromium
npm run test:e2e
npm run build
```

Browser tests create and remove local test records. Use the disposable database,
not a shared deployment. Restart `npm run demo` before a full test run to reset
its data and the supplied API's limit of 100 requests per ten minutes.
The eight browser/API tests run against real Express and MongoDB, without mocked
HTTP responses. See [the handoff](docs/CONTRIBUTION-HANDOFF.md#continuation-checkpoint)
for the verified behavior and remaining review/deployment work.

## Deployment handoff

The application has not been deployed by this implementation.

- Create a persistent MongoDB database and configure the backend's `MONGO_URI`,
  private `JWT_SECRET`, `JWT_EXPIRE`, and `JWT_COOKIE_EXPIRE`.
- On your Node backend host, use root directory `backend`, install command
  `npm ci --omit=dev`, start command `npm start`, `NODE_ENV=production`, and
  `HOST=0.0.0.0`. Set `FRONTEND_URL` to the exact HTTPS frontend origin.
  The platform supplies `PORT`. The disposable runner is for local use only.
- In Vercel, use root directory `frontend` and the Next.js framework preset.
  Set `NEXT_PUBLIC_API_BASE_URL` to the reachable HTTPS backend origin,
  `NEXTAUTH_URL` to the deployed frontend origin, and a private `NEXTAUTH_SECRET`.
  Set the API origin before building; changing it requires rebuilding.
- Public equipment reads, login from NextAuth on the server, and protected
  browser requests must all reach the backend. Verify the deployed member and
  admin flows after setting the final frontend URL and CORS origin.
- Prepare shared demo records, slides, the Figma export, and submission links.
  The saved submission instructions specify November 18, 2026 at 23:00 Bangkok.

MongoDB and backend JWT secrets belong only in the backend environment.
The class demo intentionally retains Member/Admin role selection at signup.
