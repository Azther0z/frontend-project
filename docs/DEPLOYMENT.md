# Deployment

Use two Vercel projects from this repository and a persistent MongoDB Atlas database. This follows the backend Vercel/Atlas approach in the course's Week 14 TestingDeploy slides, pages 41–53. The local `npm run demo` database is temporary and must not be used for deployment.

## Current deployment

Created November 18, 2026 in the `kormuyang1` Vercel Hobby scope:

- Frontend: https://equipment-rental-web.vercel.app
- Backend: https://equipment-rental-api-ashy.vercel.app
- API documentation: https://equipment-rental-api-ashy.vercel.app/api-docs/
- Atlas: separate `Equipment Rental` project, free `EquipmentRental` cluster in Singapore, database `equipment-rental`. The application user has `readWrite` on this database. The user approved the course's `0.0.0.0/0` network rule.

Both projects currently use direct CLI deployments. Vercel did not accept the repository connection under the current account; automatic GitHub deployments are not configured. Connecting the repository later requires resolving access to `Azther0z/frontend-project` in Vercel and choosing the roots below.

After signing in to Vercel, deploy from the **repository root**:

```sh
npx vercel@latest deploy --prod --project equipment-rental-api --scope kormuyang1 --regions sin1
npx vercel@latest deploy --prod --project equipment-rental-web --scope kormuyang1 --regions sin1
```

Vercel project environment variables are already configured. Local private backups are ignored. `.vercelignore` excludes local environment files, installed packages, build caches, browser reports, and course documents from CLI uploads. Local disposable demo data and demo passwords are not copied into Atlas; create application accounts through Register and add equipment through an Admin account.

Live verification on November 18 passed 38 Postman assertions against the production URLs: equipment response shape, generated OpenAPI routes, registration/login, admin equipment CRUD, member access rejection, rental CRUD and ownership access, seven inclusive days accepted/eight rejected, inventory unchanged, browser CORS, and NextAuth session creation/sign-out. The verification script exited 0; expected 400/403/404 responses were asserted explicitly. Swagger CSS and JavaScript also returned their correct content types. Temporary verification accounts and equipment were removed from Atlas afterward.

## Projects

| Setting | Frontend | Backend |
| --- | --- | --- |
| Root Directory | `frontend` | `backend` |
| Framework | Next.js | Express |
| Node.js | 24.x | 24.x |
| Install | `npm ci` | `npm ci --omit=dev` |
| Build | `npm run build` | `npm run build` |
| Production branch | `main` | `main` |

Vercel currently supports Express's `server.js` and `app.listen` directly; no legacy catch-all `vercel.json` is needed. See [Express on Vercel](https://vercel.com/docs/frameworks/backend/express) and [Vercel monorepos](https://vercel.com/docs/monorepos).

The backend exports the Express function directly, waits for its shared MongoDB connection before API handlers run, and copies Swagger assets plus a generated OpenAPI specification into `public/api-docs` during its build. This lets Vercel serve the documentation assets as static files. `/health` remains an application-only check.

## Environment variables

Set these in the respective Vercel project's Production environment. Use the final stable HTTPS origins without a trailing slash.

| Backend variable | Value |
| --- | --- |
| `NODE_ENV` | `production` |
| `MONGO_URI` | Private Atlas connection string with a dedicated database name |
| `JWT_SECRET` | Private random secret |
| `JWT_EXPIRE` | `1d` |
| `JWT_COOKIE_EXPIRE` | `1` |
| `FRONTEND_URL` | Final frontend origin, used for browser CORS |

Vercel supplies the listening port and `VERCEL=1`. Only on Vercel, Express trusts one proxy hop for client IP detection. Vercel [overwrites the forwarded client IP header](https://vercel.com/docs/headers/request-headers); see also [Express proxy configuration](https://expressjs.com/en/guide/behind-proxies/).

| Frontend variable | Value |
| --- | --- |
| `NEXT_PUBLIC_API_BASE_URL` | Final backend origin |
| `NEXTAUTH_URL` | Final frontend origin |
| `NEXTAUTH_SECRET` | A separate private random secret |

The API origin is embedded in the frontend build: redeploy after changing it. MongoDB credentials and the backend JWT secret belong only in the backend project. Do not commit environment files, Vercel local project state, or tokens.

## Deployment order

1. Create or select a free Atlas cluster and a separate `equipment-rental` database. Give the application's database user read/write access only to this database. Configure Atlas network access for the chosen host; the course's dynamic-IP Vercel approach uses `0.0.0.0/0`, which makes the database endpoint network-reachable from any IP while database authentication remains required.
2. Create the backend and frontend Vercel projects with the roots above. Record their stable production domains and set both projects' variables.
3. Deploy the backend. `/health` checks only the running application. `/api/v1/equipment` must also return 200 to establish that database access works.
4. Deploy the frontend, then check the final origin matches `FRONTEND_URL` and `NEXTAUTH_URL` exactly.
5. Verify public catalog/detail pages, signup/login/logout, admin equipment create/edit/delete, and member rental create/edit/delete. Reload after a write to check persisted data. Verify June 10–16 is seven inclusive days; June 10–17 must be rejected, using future dates when testing.

Use separate environment values and database data for preview deployments if enabling them. The backend's CORS setting allows one exact frontend origin. Ensure the intended public production URLs can be reached without a Vercel account, including server-to-server NextAuth requests.

The supplied in-memory API rate limiter remains 100 requests per IP per ten minutes per running instance. It is suitable for the class demo but does not provide a shared quota across Vercel instances.
