# Frontend plan

This document defines the planned Next.js and TypeScript frontend. The application code and its shared type files are planned. See [requirements](REQUIREMENTS.md) for required system behavior, [API](API.md) for the backend contract, and [shared contracts](SHARED-CONTRACTS.md) for TypeScript shapes.

## Technology and structure

Use Next.js App Router and TypeScript. Use English and semantic HTML elements in React. Add Tailwind utility classes in `className` when styling is needed. Use `fetch` for API calls. Keep form state in each form. Redux is not required.

```text
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   ├── page.tsx
│   │   ├── equipment/[id]/page.tsx
│   │   ├── account/page.tsx
│   │   ├── rentals/page.tsx
│   │   ├── rentals/new/page.tsx
│   │   ├── rentals/[id]/edit/page.tsx
│   │   └── admin/
│   │       ├── layout.tsx
│   │       ├── equipment/page.tsx
│   │       ├── equipment/new/page.tsx
│   │       ├── equipment/[id]/edit/page.tsx
│   │       ├── rentals/page.tsx
│   │       └── rentals/[id]/edit/page.tsx
│   ├── components/
│   │   ├── shared/       # AppNav, AccessGuard, ConfirmDialog, Feedback
│   │   ├── auth/         # AuthProvider, AccountTabs, LoginForm, RegisterForm
│   │   ├── equipment/    # EquipmentList, EquipmentCard, EquipmentDetail, EquipmentForm
│   │   └── rentals/      # RentalList, RentalDetails, RentalForm
│   ├── lib/
│   │   ├── api/          # client.ts, auth.ts, equipment.ts, rentals.ts
│   │   └── validation.ts
│   └── types/            # user.ts, equipment.ts, rental.ts, api.ts
├── public/
├── package.json
└── .env.example
```

Keep frontend and backend dependencies, lockfiles, and configuration separate. Keep private environment values in ignored files. `NEXT_PUBLIC_API_BASE_URL` contains the API origin without `/api/v1`; it contains no secrets. For one-domain routing, use an empty base URL and relative `/api/v1` requests.

The backend copy belongs to Poom. Use the supplied repository at commit [`be18df9`](https://github.com/SWDevPrac2-69-1/PJ02-EquipmentRent/tree/be18df9967be7e0a742b5a5ae25f07966dc4e1d4). Record its source and revision, preserve its license and notices, and exclude `.git`, installed dependencies, and secrets. Apply later backend updates manually.

## Routes and components

| Screen | URL | Main component |
|---|---|---|
| Equipment catalog | `/` | `EquipmentList` |
| Equipment detail | `/equipment/[id]` | `EquipmentDetail` |
| Account | `/account` | `AccountTabs` |
| My rentals | `/rentals` | `RentalList` |
| Rental form | `/rentals/new`, `/rentals/[id]/edit`, `/admin/rentals/[id]/edit` | `RentalForm` |
| Admin equipment | `/admin/equipment` | `EquipmentList` with admin actions |
| Equipment form | `/admin/equipment/new`, `/admin/equipment/[id]/edit` | `EquipmentForm` |
| Admin rentals | `/admin/rentals` | `RentalList` with member details |

Create and edit URLs reuse the same form component. Show rental details inside the list. Use `ConfirmDialog` before deletion. Show loading, empty, error, and success states in the current screen. Do not add admin rental creation because the backend allows only members to create rentals.

The `/equipment/[id]` page displays only the equipment item that matches `id`. It has no equipment selector or tabs for other items. Show a loading state while the page loads the item, then show a not-found message when the API returns 404.

A prop is a value that a parent passes to a component. A callback lets a child report an action to its parent. Pages load data and call the API. Forms collect values and report them through callbacks.

| Component | Inputs | Job |
|---|---|---|
| `AppNav` | Current user, logout callback | Show links for the current role |
| `AuthProvider` | Children | Share user, token, loading state, login, registration, and logout functions |
| `AccessGuard` | Allowed roles, children | Wait for the user, then show content or an access message |
| `AccountTabs` | Safe internal return path | Switch between login and registration |
| `LoginForm` | Submit callback, pending state, error | Collect email and password |
| `RegisterForm` | Submit callback, pending state, error | Collect name, email, telephone, role, and password |
| `EquipmentList` | Items, optional admin callbacks | Show equipment and permitted actions |
| `EquipmentCard` | One item, details link | Show one catalog item |
| `EquipmentDetail` | One item, optional request link | Show all fields for that item, with no item selector or admin rental creation |
| `EquipmentForm` | Mode, initial values, submit callback, pending state, error | Reuse equipment fields and validation |
| `RentalList` | Rentals, member or admin mode, view/edit/delete callbacks | Show the user's requests or all requests |
| `RentalDetails` | One rental, member or admin display mode | Show equipment, dates, quantity, and member details allowed for that mode |
| `RentalForm` | Mode, equipment choices, initial values, submit callback, pending state, error | Reuse rental fields and validation |
| `ConfirmDialog` | Open state, title, message, pending state, confirm/cancel callbacks | Ask before deletion |
| `Feedback` | Loading, error, or success state and message | Show feedback in the current screen |

Pages own callbacks that call the API, navigation, and data refresh. If an API call fails, the page keeps form values and passes the error to its `Feedback` component. Keep submit buttons disabled while a request runs. Use labels, native buttons, links, forms, and dialogs. The backend must enforce access because hiding a button does not protect data.

## Data and state

Use the backend field names in [API.md](API.md). Convert number inputs to numbers before submission. Keep date inputs as `YYYY-MM-DD` strings. Keep display data separate from request inputs.

The planned type files define `User`, `Role`, `LoginInput`, and `RegisterInput` in `user.ts`. The `equipment.ts` file defines `Equipment` and `EquipmentInput`. The `rental.ts` file defines `Rental` and `RentalInput`. The `api.ts` file defines shared success, list, and error responses. `RentalInput.equipment` contains the equipment ID. `Rental.equipment` uses the populated `RentalEquipment` shape, and `Rental.user` uses `RentalUser`. Either populated reference can be `null`. Do not substitute the normalized `User` or full `Equipment` types for these nested rental response shapes. The field definitions are in [SHARED-CONTRACTS.md](SHARED-CONTRACTS.md).

Keep request functions in `lib/api/`. Type files describe data shapes only. Equipment and rental update functions accept partial inputs. Reusable forms submit complete values.

For rental edits, adapt the populated rental response to form input values. Map `Rental.equipment?._id` to the equipment ID, or use an empty string when the reference is missing. Map each response date with `.slice(0, 10)` to keep its UTC calendar date. Do not convert the date through the browser's local timezone. Fetch the active equipment list for the choices. If the current equipment reference is missing or inactive, keep its historic label in separate display data and leave the form selection empty. Explain that the user must choose active equipment. Disable save until the user selects an active choice. If there are no active choices, explain that the user cannot edit this rental now. Keep viewing and deleting available.

Rental edits revalidate the dates, including a start date that is now in the past, and the quantity against the newly selected equipment. Submit complete rental values so the backend validates the merged rental. Keep every entered value visible after an API failure.

Use React context for authentication state and `sessionStorage` for the token. The token lasts for the current tab. After the browser loads, restore the token and call `/auth/me` before protected content appears. Normalize `/auth/me` data by mapping `_id` to `id` for `AuthUser`. Login and registration store the returned token and sign in the user. Registration includes the required member/admin role selector. The supplied backend also accepts public admin self-registration, so this is a class demo only until the team chooses server-side role restrictions. Use prepared test accounts for the demo.

`AuthProvider` exposes `user`, `token`, `loading`, `restoreError`, `retrySession`, `login`, `register`, and `logout`. API functions receive the token as an argument. `client.ts` adds `Authorization: Bearer <token>` only when a token exists. If `/auth/me` returns HTTP 401, clear the token from context and `sessionStorage`, and clear the user. If any protected request returns HTTP 401, clear the session too. If `/auth/me` fails because of a network error, keep the token, stop loading, and show a retry action. The guard shows restore errors before the sign-in path and keeps protected content hidden until retry succeeds. Login HTTP 401 shows a credential error in the account form. It does not redirect. Logout clears local token and user state even when its request fails. Show HTTP 403 as an access error. Forms and pages own async error display.

After login or registration, accept only known internal return routes. Send admins to `/admin/equipment` and members to `/rentals` by default. The equipment request link uses `/rentals/new?equipment=<id>`. Keep this choice through login or registration. Only members resume rental creation. Send admins to Admin Equipment. After create, go to My Rentals. After edit, return to the matching member or admin list.

## React boundaries

Keep route files small. Put forms, dialogs, authentication context, and browser data loaders in Client Components with `"use client"`. Keep the root layout as a Server Component. It renders the client `AuthProvider` around page content.

Do not read browser token state during server rendering. Load protected data only after authentication is ready. Keep one source of state for each value. After a successful change, reload the affected list or detail record from the API.

## Implementation order

The proposed work split assigns public equipment browsing, accounts, and member rentals to Saint. It assigns admin equipment and rental management, the backend copy, and hosting selection to Poom. Both members handle integration checks and review.

Draft the shared types, API wrapper, authentication provider, and rental form interfaces first. Poom reviews the interfaces before adding admin screens. Implement one complete member rental path, then connect admin equipment and admin rental paths. Keep actual test results in the contribution handoff.

## References

- [Next.js folder conventions](https://nextjs.org/docs/app/getting-started/project-structure): `src/app`, layouts, and pages.
- [Next.js server and client components](https://nextjs.org/docs/app/getting-started/server-and-client-components): interactive components and context providers.
- [React component planning](https://react.dev/learn/thinking-in-react): component boundaries and shared state.
- Course examples: [W07 Router Navigation](pdf/W07_Router_Navigation-957520-17888570978209.pdf), [W06 React State](pdf/W06_ReactState-957520-17883323524647.pdf), and [W10 Data Posting](pdf/W10_DataPosting-957520-17913744221453.pdf).
