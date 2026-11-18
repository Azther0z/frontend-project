# Frontend plan

This plan records the confirmed technical foundation and proposed component interfaces for a Next.js and TypeScript frontend. The frontend and shared types now exist under `frontend/`; the folder and component interfaces below retain the original design proposals. See [the implementation checkpoint](CONTRIBUTION-HANDOFF.md#continuation-checkpoint) for verified behavior.
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

On November 18, 2026, the user clarified the maximum rental duration as seven inclusive calendar days. June 10–16 is valid; June 10–17 must be rejected. This overrides the supplied backend's earlier elapsed-day boundary; the calendar, form validation, and local backend use the clarified rule.

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
The current credentials login requires an absolute backend origin because it also runs on the Next.js server. One-domain routing would need separate server-origin configuration; do not set an empty API origin.

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
| `RentalList` / `RentalDetails` | Request summaries and details, with “Rented by” names for both roles |
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
Keep the backend's availability validation unchanged. Apply the confirmed seven-inclusive-day duration limit and existing UTC/past-date checks. Use normal form error feedback when an update is rejected.
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

Keep route files small. Interactive forms, private rental data loaders, and the NextAuth provider use Client Components with `"use client"`. Equipment catalog/detail data now loads in Server Components as described below.
The root layout remains a Server Component and renders the client NextAuth provider around page content.
Do not read browser token storage during server rendering. Reload affected records after successful API changes.

The November 18 decisions specify inline loading/errors, preserved values after failures, disabled submission while saving, and Cancel/Delete confirmation.
The calendar popup shows one month with previous/next controls and start-then-end selection.
These details supplement the Figma wireframe. Empty and success state wording remains a routine implementation detail.
The confirmed class demo scope does not require mobile layouts.

## Course-aligned rendering optimization

The `codex/server-rendered-equipment` branch follows patterns verified in the
supplied course material, rather than treating every available Next.js feature
as a project requirement:

- [Class 05](pdf/Class05_Form_Interaction_Event-957520-17877366596774.pdf) explains
  the server/client boundary, server rendering, and client-side interactivity.
- [Week 09 Data Fetching](pdf/W09_DataFetching-957520-17908413706988.pdf), page 3,
  recommends server-side fetching and avoiding client/server waterfalls.
  Pages 5–6 and 14 cover parallel requests and `Promise.all`; page 15 explicitly
  teaches `cache: "no-store"`; page 38 builds a server-rendered catalog; pages
  47–50 cover Suspense and loading UI.
- The available local Assignment 12 checkout
  `swdevprac2-69-1-a12-swdevprac2-69-1-kormuyang` at commit `027916f` uses an async
  `src/components/VenueCatalog.tsx`, an async venue detail page, server-side
  `getServerSession` in `TopMenu.tsx`, and a client `InteractiveCard.tsx`.
  This is a local source check; Saint's personal reference link above returned
  GitHub 404 with the current account and was not independently verified.

Implementation boundaries:

| Area | Rendering and data fetching |
|---|---|
| Home/root layout | Existing Server Components; Home remains statically renderable |
| Equipment catalog and detail | Server Components fetch public equipment and resolve the session in parallel; cards, descriptions, prices, role-specific links, and page variants render on the server |
| Equipment deletion | Small `EquipmentDeleteControl` Client Component reads the live session token and reuses the existing confirmation/button; successful deletion refreshes the server-rendered list |
| Loading/missing equipment | Route loading UI and a dedicated server-rendered not-found page |
| Forms, calendar, cost preview, and private rentals | Existing Client Components; their state and authenticated API behavior remain unchanged |

The existing API helper uses explicit `no-store`, so catalog reads remain fresh
when an admin changes rates or deletes equipment. No persistent data cache,
cache invalidation framework, Server Actions, or extra libraries are added by
this optimization. Some lecture default-cache statements describe older
Next.js behavior; the implementation uses the installed Next.js 16 guides and
an explicit cache option instead of depending on those historical defaults.

The change removes the browser's equipment-read request and the wait for a
client session before starting that request. It does not establish a universal
loading-time improvement: server/API latency and network conditions still
matter. Verify server HTML, browser requests, and mutation freshness using
`frontend/tests/equipment-rendering.spec.ts`.

## Optional catalog search and linked images

The user confirmed these additions after the rendering optimization. They use
existing course concepts: HTML forms, query strings, Server Components, local
state, and the Image component. They add no external package.

`/equipments` reads `q` and `category` from its server `searchParams`. A GET form
preserves both values in the URL. The server filters name/description and
category before rendering, so there is no new browser equipment-read request.
Category options come from the original full active list, with trimmed,
case-insensitive keys; admin entry remains free text. Counts, empty feedback,
and Reset filters are part of this view. Deleting from a filtered list refreshes
its current URL; deleting from a detail page goes to the catalog.

The optional `imageUrl` field is stored in MongoDB and included in equipment
responses and populated rental equipment. The admin form uses a small client
`EquipmentImage` preview with load/error callbacks. A nonempty URL must load as
an image before submission. Standard Google Drive file links (`/file/d/…`,
`/open?id=…`, `/uc?id=…`, and thumbnail links) resolve to the public thumbnail
endpoint for display, preserving `resourcekey`. Store the original link so it
remains familiar during edits. Drive access must be Anyone with the link
(Viewer); this does not grant access to private files. Images are also shown on catalog/detail pages and
rental summaries. Clearing the field removes the image. URL syntax is checked
on both sides; image availability is checked by the browser.

`next/image` uses `unoptimized` for these user-provided URLs: the browser loads
the source directly rather than sending arbitrary hosts through the Next.js
image optimization proxy. No image binary is uploaded or stored. HTTP(S) links
can still fail because of removal, authentication, hotlink restrictions, or
browser restrictions; those failures show a fallback. The server does not
fetch remote URLs to check their content. Equipment text remains server-rendered;
only each image's loading/error behavior is a Client Component.

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
