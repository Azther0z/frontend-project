# Frontend plan

This plan records the confirmed technical foundation and proposed component interfaces for a Next.js and TypeScript frontend. Application code and shared type files do not exist yet.
Screens and product behavior follow the updated [Figma design](FIGMA.md). Backend details follow [API.md](API.md).
The user confirmed the technical foundation on November 18, 2026. Component interfaces and the team split remain proposals.

## Confirmed decisions

The user confirmed these decisions on November 16, 2026. The guest screens and product behavior are now recorded in the saved Figma revision and its behavior note.
Backend constraints remain separate technical references.

- Backend changes are allowed when confirmed product behavior needs them. The API guide still describes the current supplied revision.
- Keep Home's current minimal design for all roles. It has no equipment catalog.
- Guests browse a separate `/equipments` page. Its cards have neither Rent nor Login to request buttons.
- Guest catalog cards link to an equipment detail page. That page has Login to request instead of Rent.
- Keep Home and Equipment separate so those links do not open the same catalog content.
- Use the equipment item's current rate for every displayed rental total, including older requests. Do not save a creation-time rate.
- Round the final total once to two decimal places. Round halfway values upward, such as 100.005 to 100.01.
- Keep backend availability validation as it is. Do not add availability-specific frontend controls or a replacement equipment selector.
- Editing a request with a past start date requires a valid new date range under the existing backend rules.
- Keep Member and Admin choices in registration for the class demo.
- After successful creation or editing, open that record's detail page. After deletion, return to its list.
- Login, registration, and logout always go to Home. Do not remember a destination or selected item through account access.
- Login to request opens Login without a return destination. After signing in, the member opens Equipment and selects the item again.
- The class demo is desktop only. Mobile layouts are outside this scope.

The [current-rate decision](adr/0001-calculate-cost-from-current-equipment-rate.md) records the consequence for older request totals.
The decisions above are confirmed. On November 18, 2026, the user also confirmed these implementation decisions:

- Keep the code as simple as the [reference project](https://github.com/Azther0z/swdevprac2-69-1-a12-swdevprac2-69-1-azther0z).
- Use Next.js App Router, TypeScript, Tailwind, small direct `fetch` helpers, shared interfaces, and local form state.
- Use NextAuth for login. This replaces the earlier React context and per-tab `sessionStorage` authentication proposal.
- Store rentals in the supplied backend. Do not add a Redux rental store.
- Show loading and error messages inline. Preserve entered values after failures and disable submission while saving.
- Show a confirmation with Cancel and Delete before deleting a record.
- Use one calendar popup that shows one month, with previous and next month controls.
- Select the start date and then the end date through the single range input.

These decisions supplement the saved Figma design. They are not evidence of changes to Figma or an implemented application.

The user requested a course PDF check before deciding guest access.
The [project topic PDF](pdf/6901_Project_Topics-957520-17911698720803.pdf), page 3, says all users can view equipment information.
That viewing rule has no login condition, while nearby rules explicitly require login for member rental creation and admin changes.
The PDF does not explicitly define whether “User” includes unauthenticated guests. The user chose guest browsing after reviewing that wording.
Page 1 explicitly permits backend customization and additional functionality.

## Technology and structure

The confirmed foundation uses Next.js App Router, TypeScript, Tailwind utility classes, and `fetch`.
Forms keep local state. NextAuth manages login sessions. Rentals use the backend without a Redux rental store.
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
│   │   ├── AppNav.tsx
│   │   ├── LoginForm.tsx
│   │   ├── RentalForm.tsx
│   │   └── DateRangeInput.tsx  # Other shared forms and views stay in this folder
│   ├── libs/                # Small fetch helpers, rental-cost.ts, and validation.ts
│   └── providers/           # NextAuthProvider.tsx
├── interface.ts             # Shared domain, request, and response interfaces
├── public/
├── package.json
└── .env.example
```

Add the NextAuth handler under `src/app/api/auth/[...nextauth]/` and keep its configuration beside the handler.
The folder tree is a guide. Add files when the implementation needs them.
Keep frontend and backend dependencies, lockfiles, and configuration separate. Keep private environment values in ignored files.
`NEXT_PUBLIC_API_BASE_URL` contains the API origin without `/api/v1`. It contains no secrets.
For one-domain routing, use an empty base URL and relative `/api/v1` requests.

Poom owns the proposed backend copy. Its source is commit [`be18df9`](https://github.com/SWDevPrac2-69-1/PJ02-EquipmentRent/tree/be18df9967be7e0a742b5a5ae25f07966dc4e1d4).
Record the source and revision, preserve its license and notices, and exclude `.git`, installed dependencies, and secrets.
Apply later backend updates manually.

## Figma routes and proposed components

The browser uses plural `/equipments`. The backend API still uses singular `/api/v1/equipment`.
Figma braces `{id}` and Next.js segments `[id]` represent the same item ID.
Guest, member, and admin variants share URLs. Pages select the variant from the current account state.

| Screen | Browser path | Proposed main component |
|---|---|---|
| Home, with guest/member/admin variants | `/` | Home page and `AppNav` |
| Registration | `/register` | `RegisterForm` |
| Login | `/login` | `LoginForm` |
| Equipment catalog, guest/member/admin variants | `/equipments` | `EquipmentList` |
| One equipment item, guest/member/admin variants | `/equipments/[id]` | `EquipmentDetail` |
| Member rental creation | `/equipments/[id]/rent` | `RentalForm` |
| Admin equipment creation | `/equipments/new` | `EquipmentForm` |
| Admin equipment editing | `/equipments/[id]/edit` | `EquipmentForm` |
| Rental list, member/admin variants | `/rentals` | `RentalList` |
| One rental request, member/admin variants | `/rentals/[id]` | `RentalDetails` |
| Rental editing, member/admin variants | `/rentals/[id]/edit` | `RentalForm` |

The home page shows the system heading and role-specific navigation. It is separate from the equipment catalog.
Login and registration are separate pages. Rental details are separate pages rather than expanded list content.
Admins have no rental creation path or Rent controls. Equipment creation and editing are admin actions.
Guests can open equipment list and detail URLs without login. Guest cards have linked names and no request buttons.
Guest details show Login to request, which opens `/login`. Do not retain an item or destination through login or registration; both finish at Home.
After successful record creation or editing, navigate to its detail page. After deletion, navigate to its list. Logout goes to Home.

`EquipmentDetail` displays only the item that matches the URL ID. Rental forms also display one fixed equipment item.
Creation binds that ID from `/equipments/[id]/rent`. Editing binds it from the existing rental.
Do not add an equipment selector to either form. The inactive-equipment conflict is recorded in [API.md](API.md#figma-integration).

## Forms and shared components

A prop is a value that a parent passes to a component. A callback reports an action to the parent.
Pages load records and call the API. Forms collect values and report them through callbacks.
The proposed interfaces are in [SHARED-CONTRACTS.md](SHARED-CONTRACTS.md).

| Component | Proposed responsibility |
|---|---|
| `AppNav` | Guest Home/Equipment/Register/Login links, signed-in links, admin indicator, and logout callback |
| `NextAuthProvider` | NextAuth session state for client components |
| `AccessGuard` | Wait for authentication and enforce the page's allowed roles |
| `LoginForm` | Email and password |
| `RegisterForm` | Name, email, telephone, role, password, and password confirmation |
| `EquipmentList` / `EquipmentCard` | Guest cards with linked names only, member cards with Rent, or admin rows with View/Edit/Delete and an Add action |
| `EquipmentDetail` | One item, with guest Login to request, member Rent, or admin Edit/Delete actions |
| `EquipmentForm` | Shared equipment fields for Add and Save modes |
| `RentalList` / `RentalDetails` | Request summaries and details, with owner labels in the admin variant |
| `RentalForm` | Fixed equipment, quantity, one date-range calendar input, cost, and Rent or Save |
| `DateRangeInput` | One visible input and a calendar that selects both start and return dates |
| `Feedback` / `ConfirmDialog` | Confirmed inline loading/errors and Cancel/Delete confirmation |

The registration form compares Password and Confirm Password before submission. It sends only backend registration fields.
The password confirmation stays in the form and does not become a backend field.
One range input supplies `startDate` and `returnDate`. It keeps an incomplete selection local and prevents submission until both dates are valid.

Cost uses `rentalRate × inclusive calendar days`. June 10–12 is three days. A same-day range is one day.
Calculate calendar-day differences from date-only values through UTC. Do not measure local clock hours across daylight-saving changes.
Quantity is not a cost multiplier. The frontend derives displayed cost because the backend has no cost field.
Use the current equipment rate, including for older requests. Round the final total once to two decimals, with halfway values rounded upward.
Keep that display value separate from API request and response types.

## Backend data and confirmed authentication foundation

Use the backend field names in [API.md](API.md). Convert quantity inputs to numbers before submission.
Keep selected dates as `YYYY-MM-DD` strings. Keep display values separate from request inputs.
Rental reads contain populated equipment and user objects. Either reference can be `null`.
For edits, bind `Rental.equipment?._id` and preserve response calendar dates with `.slice(0, 10)`.

Do not replace missing or inactive equipment through a new selector. Figma has no such control.
Keep the backend's availability and date validation unchanged. Use normal form error feedback when an update is rejected.
Do not add availability-specific edit restrictions or controls in the frontend. A past start date must change to a valid new date range before saving.

Use the reference project's NextAuth credentials login pattern with a JWT session and a `NextAuthProvider`.
The credentials handler calls the supplied backend login endpoint. Keep the backend token in the NextAuth session flow.
Map the backend user and role explicitly. Do not copy the reference's untyped session casts.
Map `_id` from `/auth/me` to the frontend user's `id`. Login and registration already return `id`.
API helpers receive the backend token and send `Authorization: Bearer <token>` on protected calls.
Public equipment calls omit the token. Do not add a separate `sessionStorage` token store.
Registration calls the backend registration endpoint. Complete the NextAuth sign-in flow before navigating to Home.
The exact callback types and registration integration remain implementation details to verify against the installed NextAuth version.

A protected HTTP 401 ends the frontend session. A login HTTP 401 stays a form error.
HTTP 403 remains an access error. Failed requests show inline errors and preserve entered values.
Logout ends the NextAuth session even if the backend logout request fails. Account navigation always finishes at Home.
Keep NextAuth server secrets in ignored environment files. Backend database and signing secrets remain on the backend.
The class demo intentionally keeps Member and Admin registration, matching the supplied backend and the agreed design.

## React boundaries and open details

Keep route files small. Interactive forms, browser data loaders, and the NextAuth provider use Client Components with `"use client"`.
The root layout remains a Server Component and renders the client NextAuth provider around page content.
Do not read browser token storage during server rendering. Reload affected records after successful API changes.

The November 18 decisions specify inline loading/errors, preserved values after failures, disabled submission while saving, and Cancel/Delete confirmation.
The calendar popup shows one month with previous/next controls and start-then-end selection.
These details supplement the Figma wireframe. Empty and success state wording remains a routine implementation detail.
The confirmed class demo scope does not require mobile layouts.

## Proposed implementation order

The retained work split assigns account forms, guest and member equipment screens, and member rentals to Saint.
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
