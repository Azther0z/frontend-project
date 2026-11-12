# Frontend plan

This is the draft code plan for Saint and Poom. The folders and components below do not exist yet.
Read this plan before the [handoff](CONTRIBUTION-HANDOFF.md).

## Basic choices

Use Next.js App Router and TypeScript. Use English and plain HTML elements inside React.
Add Tailwind classes in `className` when needed. Start with the required features.
Use `fetch` for API calls. Keep form state inside each form. Redux is not required for this plan.

## Directory structure

```text
frontend-project/
├── src/
│   ├── app/                         # URL routes
│   │   ├── layout.tsx               # App shell and AuthProvider
│   │   ├── globals.css
│   │   ├── page.tsx                 # Equipment catalog: /
│   │   ├── equipment/[id]/page.tsx  # Equipment details
│   │   ├── account/page.tsx         # Login and register tabs
│   │   ├── rentals/
│   │   │   ├── page.tsx             # My Rentals
│   │   │   ├── new/page.tsx         # Create a rental
│   │   │   └── [id]/edit/page.tsx    # Edit own rental
│   │   └── admin/
│   │       ├── layout.tsx           # Admin access guard
│   │       ├── equipment/
│   │       │   ├── page.tsx         # Manage equipment
│   │       │   ├── new/page.tsx     # Add equipment
│   │       │   └── [id]/edit/page.tsx
│   │       └── rentals/
│   │           ├── page.tsx         # All Rentals
│   │           └── [id]/edit/page.tsx
│   ├── components/
│   │   ├── shared/                 # AppNav, AccessGuard, ConfirmDialog, Feedback
│   │   ├── auth/                   # AuthProvider, AccountTabs, LoginForm, RegisterForm
│   │   ├── equipment/              # EquipmentList, EquipmentCard, EquipmentDetails, EquipmentForm
│   │   └── rentals/                # RentalList, RentalDetails, RentalForm
│   ├── lib/
│   │   ├── api/
│   │   │   ├── client.ts           # Base URL, bearer token, JSON and errors
│   │   │   ├── auth.ts             # Register, login, me, logout
│   │   │   ├── equipment.ts        # List, get, create, update, delete
│   │   │   └── rentals.ts          # List, get, create, update, delete
│   │   └── validation.ts           # Shared form rules
│   └── types/
│       └── api.ts                  # User, Equipment, Rental, inputs and API responses
├── public/                         # Static images
├── .env.example                    # Public API URL only
├── README.md
├── DELIVERABLES.md
├── FRONTEND-PLAN.md
├── API.md
└── CONTRIBUTION-HANDOFF.md
```

These are the files that the team will add. Keep the normal Next.js package, TypeScript, and lint configuration at the root.
Keep private environment values in ignored files. Run the supplied backend as a separate project.

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
A rental response contains equipment and user objects. A rental request sends an equipment ID.

The draft auth choice is React context with memory-only tokens. A refresh requires login again.
Token persistence remains a team decision before coding. Do not choose a second token store in a feature component.
`AuthProvider` exposes `user`, `token`, `loading`, `login`, `register`, and `logout`.
API functions receive the token as an argument. `client.ts` adds `Authorization: Bearer <token>`.

The proposed variable is `NEXT_PUBLIC_API_BASE_URL`. Its value is the backend origin, without `/api/v1`.
The actual hosted URL is still undecided.
The API wrapper adds the route prefix. This URL contains no secrets.
After login, accept only known internal return routes. Send admins to `/admin/equipment` and members to `/rentals` by default.
The equipment request link uses `/rentals/new?equipment=<id>`. Keep this choice through login.
After create, go to My Rentals. After edit, return to the matching member or admin list.
After logout or HTTP 401, clear the token and user. Show HTTP 403 as an access error.

## React boundaries

Keep route files small. Put forms, dialogs, auth context, and browser data loaders in Client Components with `"use client"`.
Keep the root layout as a Server Component. It renders the client `AuthProvider` around the page content.
Do not read browser token state during server rendering. Load protected data only after auth is ready.

Use one source of state for each value. Do not store a separate copy of the same rental in several components.
After a successful change, reload the affected list or detail record from the API.

## Before the handoff

Agree on token persistence, the backend URL, and the demo accounts before coding.
Saint drafts the shared types, API wrapper, auth provider, and rental form interfaces.
Poom reviews them before adding admin screens. Both use the same field names and callbacks.

Implement one complete member rental path first. Then connect admin equipment and admin rental paths.
Record test results in the [handoff](CONTRIBUTION-HANDOFF.md). This plan is not an implementation or test result.

## References

- [Next.js folder conventions](https://nextjs.org/docs/app/getting-started/project-structure): `src/app`, layouts and pages.
- [Next.js server and client components](https://nextjs.org/docs/app/getting-started/server-and-client-components): interactive components and context providers.
- [React component planning](https://react.dev/learn/thinking-in-react): split the UI into components and keep shared state in the parent.
- Course examples: W07 Router Navigation, W06 React State, and W10 Data Posting. See [DELIVERABLES.md](DELIVERABLES.md) for PDF pages.

Official web docs were read on 12 November 2026 because Context7 was unavailable. Package versions remain unset until project setup.
