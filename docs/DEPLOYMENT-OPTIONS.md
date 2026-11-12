# Deployment options

The hosting choice is open. Poom owns the decision. These are two deployment layouts for the Next.js frontend and Express backend on Vercel.

The backend source is pinned at commit [`be18df9`](https://github.com/SWDevPrac2-69-1/PJ02-EquipmentRent/tree/be18df9967be7e0a742b5a5ae25f07966dc4e1d4). It listens on `PORT` (default `5000`), requires `MONGO_URI` and a private `JWT_SECRET`, and allows the configured `FRONTEND_URL` through CORS. It returns bearer tokens. Protected requests send `Authorization: Bearer <token>`. The backend does not read authentication from a cookie.

## Option 1: One Vercel project with Services

Use one Vercel project for `frontend/` and `backend/`. Vercel Services can put multiple frontends and backends in one project. The service feature is marked beta and is available on all plans. Configure the two application roots and route `/api/v1` requests to the backend. Route other paths to the frontend. Vercel documents top-level rewrites and path matching. The source path is preserved, so confirm that the backend receives the expected `/api/v1/...` path.

This layout gives the app one domain and avoids cross-origin browser requests between the frontend and backend. Configure `MONGO_URI` and `JWT_SECRET` as backend-only environment variables. Keep `FRONTEND_URL` aligned with the deployed domain if the backend checks CORS.

Vercel documents Express apps with `server.js` and `app.listen()` as supported and deployed as Functions. The supplied backend entry point and cold-start behavior need deployment checks. Vercel Function compute and limits apply. Hobby included usage is subject to plan limits.

## Option 2: Two Vercel projects

Create one project rooted at `frontend/` and another rooted at `backend/`, both from this monorepo. Vercel documents configuring each folder as its own project. Each application can deploy independently and have its own deployment URL. Set the frontend API base URL to the backend origin. Set backend `FRONTEND_URL` to the frontend origin. Browser requests cross origins, so check CORS and bearer-token requests after deployment.

This layout keeps deployment and configuration separate, but requires coordination between two URLs and deployments. The backend still runs as Vercel Functions and uses the applicable plan limits.

## Database and plan notes

Both layouts can use MongoDB Atlas Free for a class project, subject to its limits. The Free shared cluster has a 0.5 GB storage cap, supports up to 500 concurrent connections, and has other limits. Check current capacity with the project data before relying on it. Vercel Hobby is limited to personal, non-commercial use and has plan limits.

## Deployment checks

- Can the backend run as a Vercel Function and connect to Atlas after a cold start?
- Does `/health` respond? This alone does not prove database access.
- Can the deployed app complete equipment reads, login, member rental requests, and admin equipment and rental actions using the database?
- Do API routing, bearer-token authorization, page refreshes, and direct navigation to nested frontend routes work? If the layouts use separate origins, does CORS work?
- Are `MONGO_URI` and `JWT_SECRET` scoped to the backend and kept out of source control?

## Decision record

Decision: OPEN. Poom owns the choice. Record the selected layout, frontend URL, backend URL, and deployment check results here.

## Sources

- [Vercel Services](https://vercel.com/docs/services)
- [Vercel Services routing](https://vercel.com/docs/services/routing)
- [Vercel Services pricing](https://vercel.com/docs/services/pricing)
- [Vercel monorepos](https://vercel.com/docs/monorepos)
- [Vercel Express framework guide](https://vercel.com/docs/frameworks/backend/express)
- [Vercel Hobby plan](https://vercel.com/docs/plans/hobby)
- [MongoDB Atlas Free shared cluster limitations](https://www.mongodb.com/docs/atlas/reference/free-shared-limitations/)
