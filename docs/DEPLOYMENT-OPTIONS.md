# Deployment options

This is a shortlist of two ways to deploy the project on Vercel. It is not a complete hosting-provider comparison. The hosting decision is open. Poom decides. Neither option has been deployed or tested.

The backend review uses the supplied backend pinned at commit [`be18df9`](https://github.com/SWDevPrac2-69-1/PJ02-EquipmentRent/tree/be18df9967be7e0a742b5a5ae25f07966dc4e1d4). It listens on `PORT` (default 5000), requires `MONGO_URI` and a private `JWT_SECRET`, and allows the configured `FRONTEND_URL` through CORS. It returns bearer tokens; protected requests must send `Authorization: Bearer <token>`. The backend does not read authentication from a cookie.

## Option 1: One Vercel project with Services

Use one Vercel project for `frontend/` (Next.js) and `backend/` (Express). Vercel Services can put multiple frontends and backends in one project. Services are currently marked beta and available on all plans. Configure the two application roots and route `/api/v1` requests to the backend while other paths go to the frontend. Vercel documents top-level rewrites and path matching; the source path is preserved. Confirm the backend receives the expected `/api/v1/...` path.

This gives the app one domain and avoids cross-origin browser requests between the frontend and backend. Configure `MONGO_URI` and `JWT_SECRET` as backend-only environment variables. Keep the frontend origin setting aligned with the deployed domain if the backend still checks CORS.

Vercel documents Express apps with `server.js` and `app.listen()` as supported and deployed as Functions. The supplied backend entry point and cold-start behavior still need deployment testing. Vercel Function compute and limits apply; Hobby's included usage is subject to limits, so this is not a promise of unlimited free use.

## Option 2: Two Vercel projects

Create one Vercel project rooted at `frontend/` and another rooted at `backend/`, both from this monorepo. Vercel documents configuring each folder as its own project. Each application can deploy independently and have its own deployment URL. Set the frontend API base URL to the backend origin, and set backend `FRONTEND_URL` to the frontend origin. Browser requests cross origins, so verify CORS and bearer-token requests in production.

This keeps deployment and settings separate, but requires coordinating two URLs and deployments. The backend still runs as Vercel Functions and uses the applicable plan limits.

## Database and plan notes

Both options can use MongoDB Atlas Free for a class project, subject to its limits: a 0.5 GB storage cap, up to 500 concurrent connections, and other Free-cluster limitations. Confirm current capacity and behavior with the project data before relying on it. Vercel Hobby is limited to personal, non-commercial use and has plan limits. Keep the setup within the chosen free-plan limits.

## Before choosing

- Can the backend be deployed as a Vercel Function and connect to Atlas after a cold start?
- Does `/health` respond? This alone does not prove database access.
- Can the deployed app complete database-backed equipment reads, login, member rental requests, and admin equipment/rental actions?
- Do API routing, bearer-token authorization, CORS (Option 2), page refreshes, and direct navigation to nested frontend routes work?
- Are `MONGO_URI` and `JWT_SECRET` scoped to the backend only and kept out of source control?

## Decision record

- Chosen option: Open
- Reason: Poom to record
- Frontend URL: Pending
- Backend URL: Pending
- Test result and date: Pending

## Sources

Official documentation read on 12 November 2026. Context7 was unavailable.

- [Vercel Services](https://vercel.com/docs/services)
- [Vercel Services routing](https://vercel.com/docs/services/routing)
- [Vercel Services pricing](https://vercel.com/docs/services/pricing)
- [Vercel monorepos](https://vercel.com/docs/monorepos)
- [Vercel Express framework guide](https://vercel.com/docs/frameworks/backend/express)
- [Vercel Hobby plan](https://vercel.com/docs/plans/hobby)
- [MongoDB Atlas Free shared cluster limitations](https://www.mongodb.com/docs/atlas/reference/free-shared-limitations/)
