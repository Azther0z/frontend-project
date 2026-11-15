# Frontend plan

This is a technical proposal for a Next.js and TypeScript frontend. Application code and shared type files do not exist yet.
Screens and product behavior follow the updated [Figma design](FIGMA.md). Backend details follow [API.md](API.md).
The stack, component boundaries, authentication storage, and team split below are implementation proposals, not facts from Figma.

## Technology and structure

The retained proposal uses Next.js App Router, TypeScript, Tailwind utility classes, and `fetch`.
Forms keep local state. React context shares authentication state. Redux is not required by this proposal.
Use semantic HTML elements and the English labels shown in Figma.

```text
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   ├── page.tsx
│   │   ├── register/page.tsx
│   │   ├── login/page.tsx
│   │   ├── equipments/
│   │   │   ├── page.tsx
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/
│   │   │       ├── page.tsx
│   │   │       ├── rent/page.tsx
│   │   │       └── edit/page.tsx
│   │   └── rentals/
│   │       ├── page.tsx
│   │       └── [id]/
│   │           ├── page.tsx
│   │           └── edit/page.tsx
│   ├── components/
│   │   ├── shared/       # AppNav, AccessGuard, Feedback; proposed ConfirmDialog
│   │   ├── auth/         # AuthProvider, LoginForm, RegisterForm
│   │   ├── equipment/    # EquipmentList, EquipmentCard, EquipmentDetail, EquipmentForm
│   │   └── rentals/      # RentalList, RentalDetails, RentalForm, DateRangeInput
│   ├── lib/
│   │   ├── api/          # client.ts, auth.ts, equipment.ts, rentals.ts
│   │   ├── rental-cost.ts
│   │   └── validation.ts
│   └── types/            # user.ts, equipment.ts, rental.ts, api.ts
├── public/
├── package.json
└── .env.example
```

Keep frontend and backend dependencies, lockfiles, and configuration separate. Keep private environment values in ignored files.
`NEXT_PUBLIC_API_BASE_URL` contains the API origin without `/api/v1`. It contains no secrets.
For one-domain routing, use an empty base URL and relative `/api/v1` requests.

Poom owns the proposed backend copy. Its source is commit [`be18df9`](https://github.com/SWDevPrac2-69-1/PJ02-EquipmentRent/tree/be18df9967be7e0a742b5a5ae25f07966dc4e1d4).
Record the source and revision, preserve its license and notices, and exclude `.git`, installed dependencies, and secrets.
Apply later backend updates manually.

## Figma routes and proposed components

The browser uses plural `/equipments`. The backend API still uses singular `/api/v1/equipment`.
Figma braces `{id}` and Next.js segments `[id]` represent the same item ID.
Member and admin variants share URLs. Pages select the variant from the signed-in role.

| Screen | Browser path | Proposed main component |
|---|---|---|
| Home, with visitor/member/admin variants | `/` | Home page and `AppNav` |
| Registration | `/register` | `RegisterForm` |
| Login | `/login` | `LoginForm` |
| Equipment catalog, member/admin variants | `/equipments` | `EquipmentList` |
| One equipment item, member/admin variants | `/equipments/[id]` | `EquipmentDetail` |
| Member rental creation | `/equipments/[id]/rent` | `RentalForm` |
| Admin equipment creation | `/equipments/new` | `EquipmentForm` |
| Admin equipment editing | `/equipments/[id]/edit` | `EquipmentForm` |
| Rental list, member/admin variants | `/rentals` | `RentalList` |
| One rental request, member/admin variants | `/rentals/[id]` | `RentalDetails` |
| Rental editing, member/admin variants | `/rentals/[id]/edit` | `RentalForm` |

The home page shows the system heading and role-specific navigation. It is separate from the equipment catalog.
Login and registration are separate pages. Rental details are separate pages rather than expanded list content.
Admins have no rental creation path or Rent controls. Equipment creation and editing are admin actions.

`EquipmentDetail` displays only the item that matches the URL ID. Rental forms also display one fixed equipment item.
Creation binds that ID from `/equipments/[id]/rent`. Editing binds it from the existing rental.
Do not add an equipment selector to either form. The inactive-equipment conflict is recorded in [API.md](API.md#figma-integration).

## Forms and shared components

A prop is a value that a parent passes to a component. A callback reports an action to the parent.
Pages load records and call the API. Forms collect values and report them through callbacks.
The proposed interfaces are in [SHARED-CONTRACTS.md](SHARED-CONTRACTS.md).

| Component | Proposed responsibility |
|---|---|
| `AppNav` | Visitor links, signed-in links, admin indicator, and logout callback |
| `AuthProvider` | Shared user, token, session restoration, and account functions |
| `AccessGuard` | Wait for authentication and enforce the page's allowed roles |
| `LoginForm` | Email and password |
| `RegisterForm` | Name, email, telephone, role, password, and password confirmation |
| `EquipmentList` / `EquipmentCard` | Member cards with Rent, or admin rows with View/Edit/Delete and an Add action |
| `EquipmentDetail` | One item, with member Rent or admin Edit/Delete actions |
| `EquipmentForm` | Shared equipment fields for Add and Save modes |
| `RentalList` / `RentalDetails` | Request summaries and details, with owner labels in the admin variant |
| `RentalForm` | Fixed equipment, quantity, one date-range calendar input, cost, and Rent or Save |
| `DateRangeInput` | One visible input and a calendar that selects both start and return dates |
| `Feedback` / `ConfirmDialog` | Proposed feedback and deletion confirmation, which Figma does not yet specify |

The registration form compares Password and Confirm Password before submission. It sends only backend registration fields.
The password confirmation stays in the form and does not become a backend field.
One range input supplies `startDate` and `returnDate`. It keeps an incomplete selection local and prevents submission until both dates are valid.

Cost uses `rentalRate × inclusive calendar days`. June 10–12 is three days. A same-day range is one day.
Calculate calendar-day differences from date-only values through UTC. Do not measure local clock hours across daylight-saving changes.
Quantity is not a cost multiplier. The frontend derives displayed cost because the backend has no cost field.
Keep that display value separate from API request and response types.

## Backend data and authentication proposal

Use the backend field names in [API.md](API.md). Convert quantity inputs to numbers before submission.
Keep selected dates as `YYYY-MM-DD` strings. Keep display values separate from request inputs.
Rental reads contain populated equipment and user objects. Either reference can be `null`.
For edits, bind `Rental.equipment?._id` and preserve response calendar dates with `.slice(0, 10)`.

Do not replace missing or inactive equipment through a new selector. Figma has no such control.
The backend rejects edits for inactive equipment and revalidates past start dates. Those cases need an agreed design before implementation.

The retained authentication proposal uses React context and `sessionStorage` for a token scoped to the current tab.
After browser loading, restore the token and call `/auth/me` before protected data loads.
Map `_id` from `/auth/me` to the frontend user's `id`. Login and registration already return `id`.
API functions receive the token as an argument. The client sends `Authorization: Bearer <token>` on protected calls.
Public API calls omit the token. Public API access does not establish a guest screen in Figma.

On a protected HTTP 401 response, clear the local token and user. A login HTTP 401 stays a form error.
On a session-restore network failure, keep the token and offer a retry while protected content stays hidden.
Logout clears local state even if the request fails. HTTP 403 remains an access error.
The supplied backend accepts public admin self-registration. Keep its current behavior documented separately from any later server-side restriction decision.

## React boundaries and open details

Keep route files small. Interactive forms, browser data loaders, and authentication context use Client Components with `"use client"`.
The root layout remains a Server Component and renders the client authentication provider around page content.
Do not read browser token storage during server rendering. Reload affected records after successful API changes.

Figma does not specify guest access to equipment URLs, post-login or post-submit destinations, feedback states, or deletion confirmation.
The feedback, retry, and confirmation behaviors above are technical proposals. Their exact presentation needs design agreement.
The Figma calendar wireframe establishes one range input, not a complete calendar popup or mobile layout.

## Proposed implementation order

The retained work split assigns account forms, member equipment screens, and member rentals to Saint.
It assigns admin equipment and rental management, the backend copy, and hosting selection to Poom.
Both members handle shared interfaces, integration, and review.

First agree on shared types, the API wrapper, authentication, range input values, and cost calculation.
Then implement one complete member rental path. Add admin management against the same URLs and shared interfaces.
Record actual results in the [contribution handoff](CONTRIBUTION-HANDOFF.md).

## Technical references

These references explain implementation choices. They do not define product screens or behavior.

- [Next.js folder conventions](https://nextjs.org/docs/app/getting-started/project-structure): folders, layouts, and pages.
- [Next.js server and client components](https://nextjs.org/docs/app/getting-started/server-and-client-components): interactive components and context providers.
- [React component planning](https://react.dev/learn/thinking-in-react): component boundaries and shared state.

The course PDFs remain in [docs/pdf](pdf/) as reference files.
