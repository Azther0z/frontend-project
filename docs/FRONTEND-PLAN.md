# Frontend plan

Saint and Poom agreed on this plan on 12 November 2026. The app folders, components, and planned type files do not exist yet.
Read this plan before the [handoff](CONTRIBUTION-HANDOFF.md).

## Basic choices

Use Next.js App Router and TypeScript. Use English and plain HTML elements inside React.
Add Tailwind classes in `className` when needed. Start with the required features.
Use `fetch` for API calls. Keep form state inside each form. Redux is not required for this plan.

## Directory structure

```text
frontend-project/
├── frontend/                       # Next.js app
│   ├── src/
│   │   ├── app/                         # URL routes
│   │   │   ├── layout.tsx               # App shell and AuthProvider
│   │   │   ├── globals.css
│   │   │   ├── page.tsx                 # Equipment catalog: /
│   │   │   ├── equipment/[id]/page.tsx  # Equipment details
│   │   │   ├── account/page.tsx         # Login and register tabs
│   │   │   ├── rentals/
│   │   │   │   ├── page.tsx             # My Rentals
│   │   │   │   ├── new/page.tsx         # Create a rental
│   │   │   │   └── [id]/edit/page.tsx    # Edit own rental
│   │   │   └── admin/
│   │   │       ├── layout.tsx           # Admin access guard
│   │   │       ├── equipment/
│   │   │       │   ├── page.tsx         # Manage equipment
│   │   │       │   ├── new/page.tsx     # Add equipment
│   │   │       │   └── [id]/edit/page.tsx
│   │   │       └── rentals/
│   │   │           ├── page.tsx         # All Rentals
│   │   │           └── [id]/edit/page.tsx
│   │   ├── components/
│   │   │   ├── shared/                 # AppNav, AccessGuard, ConfirmDialog, Feedback
│   │   │   ├── auth/                   # AuthProvider, AccountTabs, LoginForm, RegisterForm
│   │   │   ├── equipment/              # EquipmentList, EquipmentCard, EquipmentDetails, EquipmentForm
│   │   │   └── rentals/                # RentalList, RentalDetails, RentalForm
│   │   ├── lib/
│   │   │   ├── api/
│   │   │   │   ├── client.ts           # Base URL, bearer token, JSON and errors
│   │   │   │   ├── auth.ts             # Register, login, me, logout
│   │   │   │   ├── equipment.ts        # List, get, create, update, delete
│   │   │   │   └── rentals.ts          # List, get, create, update, delete
│   │   │   └── validation.ts           # Shared form rules
│   │   └── types/                      # Planned shared TypeScript contracts
│   │       ├── user.ts                 # User, Role, LoginInput, RegisterInput
│   │       ├── equipment.ts            # Equipment, EquipmentInput
│   │       ├── rental.ts               # Rental, RentalInput; imports User and Equipment response objects
│   │       └── api.ts                  # Shared success, list, and error responses
│   ├── public/                     # Static images
│   ├── package.json                # Frontend dependencies and scripts
│   └── .env.example                # Public API base URL
├── backend/                        # Copy of the supplied Express backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   └── package.json                # Backend dependencies and scripts
├── docs/
│   ├── pdf/                        # All course PDFs, with original names
│   ├── DELIVERABLES.md
│   ├── FRONTEND-PLAN.md
│   ├── API.md
│   ├── CONTRIBUTION-HANDOFF.md
│   └── DEPLOYMENT-OPTIONS.md        # Research for Poom's hosting decision
└── README.md
```

This is the planned application layout. The guides and all 18 course PDFs have been moved into `docs/` and `docs/pdf/`, preserving PDF names and contents. Frontend/backend scaffold and imports remain pending.
Keep each app's dependencies, lockfile, and configuration separate. Do not add workspace tools yet.
Keep private environment values in ignored files.

Poom owns the backend copy. Start from commit `be18df9967be7e0a742b5a5ae25f07966dc4e1d4` of the supplied repository.
Record its source and revision, and preserve any license and notices. Exclude `.git`, installed dependencies, and secrets.
Backend updates from the source repository are manual.

## Routes and screen reuse

The eight Figma screens describe eight UI designs. Create and edit URLs reuse the same design and component.

| Screen | URL | Main component | Owner |
|---|---|---|---|
| Equipment Catalog | `/` | `EquipmentList` | Saint |
| Equipment Details | `/equipment/[id]` | `EquipmentDetails` | Saint |
| Account | `/account` | `AccountTabs` | Saint |
| Rental Form | `/rentals/new`, `/rentals/[id]/edit`, `/admin/rentals/[id]/edit` | `RentalForm` | Saint, then Poom integrates admin use |
| My Rentals | `/rentals` | `RentalList` | Saint |
| Admin Equipment | `/admin/equipment` | `EquipmentList` with admin actions | Poom |
| Equipment Form | `/admin/equipment/new`, `/admin/equipment/[id]/edit` | `EquipmentForm` | Poom |
| Admin Rentals | `/admin/rentals` | `RentalList` with member details | Poom |

Show rental details inside the list. Use `ConfirmDialog` for deletion.
Show loading, empty lists, errors, and success inside the current screen.
Do not add admin rental creation. The backend allows only members to create rentals.

## Component rules

A prop is a value that a parent passes to a component. A callback lets a child report an action to its parent.
Pages load data and call the API. Forms collect values and report them through callbacks.
Member rental pages use `AccessGuard` with `member`. The admin layout uses it with `admin`.

| Component | Inputs | Job |
|---|---|---|
| `AppNav` | Current user, logout callback | Show links for the current role |
| `AuthProvider` | Child components | Share the user, token, loading state, login and logout functions |
| `AccessGuard` | Allowed roles, children | Wait for the user, then show content or an access message |
| `AccountTabs` | Safe return path | Switch between login and registration |
| `LoginForm` | Submit callback, pending state, error | Collect email and password |
| `RegisterForm` | Submit callback, pending state, error | Collect name, email, tel, role and password |
| `EquipmentList` | Items, optional admin callbacks | Show equipment and permitted actions |
| `EquipmentCard` | One item, details link | Show a catalog item |
| `EquipmentDetails` | One item, request link | Show all equipment fields |
| `EquipmentForm` | Add/edit mode, initial values, submit callback, pending state, error | Reuse equipment fields and validation |
| `RentalList` | Rentals, member/admin mode, view/edit/delete callbacks | Show own requests or all requests |
| `RentalDetails` | One rental | Show equipment, dates, quantity and member details when allowed |
| `RentalForm` | Create/edit mode, equipment choices, initial values, submit callback, pending state, error | Reuse rental fields and validation |
| `ConfirmDialog` | Open state, title, message, pending state, confirm/cancel callbacks | Ask before deletion |
| `Feedback` | Loading/error/success state, message | Show feedback in the current screen |

Keep submit buttons disabled while a request runs. Keep entered values after an API error.
Use labels for fields and native buttons, links, forms, and dialogs.
The backend must enforce access. Hiding a button does not protect data.

## Data and state

Use the backend field names in [API.md](API.md). Convert number inputs to numbers before submission.
Keep date inputs as `YYYY-MM-DD` strings. Keep display data separate from request inputs.
`user.ts` defines `User`, `Role`, `LoginInput`, and `RegisterInput`.
`equipment.ts` defines `Equipment` and `EquipmentInput`.
`rental.ts` defines `Rental` and `RentalInput`. It imports `User` and `Equipment` for response objects.
`RentalInput` sends the equipment ID in the backend field named `equipment`.
`api.ts` defines shared success, list, and error response types.
For example, a list response has `success`, `data`, and `count`. It can contain equipment or rentals.
Request functions live in `lib/api/`. The type files only describe data shapes.
These four type files are planned and have not been created.

Use React context for auth state and `sessionStorage` for the token. Login survives refresh in the same tab.
Closing the tab ends the stored login. Do not add another token store in a feature component.
After the browser loads, restore the token and call `/auth/me` before showing protected content.
Both login and registration store the returned token and sign the user in.
Registration shows the member/admin role selector required by the assignment. Use prepared test accounts for the demo.
`AuthProvider` exposes `user`, `token`, `loading`, `login`, `register`, and `logout`.
API functions receive the token as an argument. `client.ts` adds `Authorization: Bearer <token>`.

Use `NEXT_PUBLIC_API_BASE_URL` for a separate backend origin, without `/api/v1`.
For a single-domain deployment, use an empty base and relative `/api/v1` requests.
Poom decides the hosting layout and URL. Read [deployment options](DEPLOYMENT-OPTIONS.md).
The API wrapper adds the route prefix. This URL contains no secrets.
After login or registration, accept only known internal return routes. Send admins to `/admin/equipment` and members to `/rentals` by default.
The equipment request link uses `/rentals/new?equipment=<id>`. Keep this choice through login or registration.
Only members resume rental creation. Send admins to Admin Equipment.
After create, go to My Rentals. After edit, return to the matching member or admin list.
After logout or HTTP 401, clear the token from context and `sessionStorage`, and clear the user. Show HTTP 403 as an access error.

## React boundaries

Keep route files small. Put forms, dialogs, auth context, and browser data loaders in Client Components with `"use client"`.
Keep the root layout as a Server Component. It renders the client `AuthProvider` around the page content.
Do not read browser token state during server rendering. Load protected data only after auth is ready.

Use one source of state for each value. Do not store a separate copy of the same rental in several components.
After a successful change, reload the affected list or detail record from the API.

## Before the handoff

Saint and Poom each run a local backend with separate development data.
Poom prepares the shared demo backend and database after choosing the hosting layout.
Saint drafts the shared types, API wrapper, auth provider, and rental form interfaces.
Poom reviews them before adding admin screens. Both use the same field names and callbacks.
Handoff requires agreed interfaces and a passing member rental path. Record the actual test result.

Implement one complete member rental path first. Then connect admin equipment and admin rental paths.
Record test results in the [handoff](CONTRIBUTION-HANDOFF.md). This plan is not an implementation or test result.

## References

- [Next.js folder conventions](https://nextjs.org/docs/app/getting-started/project-structure): `src/app`, layouts and pages.
- [Next.js server and client components](https://nextjs.org/docs/app/getting-started/server-and-client-components): interactive components and context providers.
- [React component planning](https://react.dev/learn/thinking-in-react): split the UI into components and keep shared state in the parent.
- Course examples: W07 Router Navigation, W06 React State, and W10 Data Posting. See [DELIVERABLES.md](DELIVERABLES.md) for PDF pages.

Official web docs were read on 12 November 2026 because Context7 was unavailable. Package versions remain unset until project setup.
