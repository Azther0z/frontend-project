# Saint and Poom: contribution handoff

Status: records confirmed product and contribution decisions for the fresh frontend, alongside unresolved integration choices. Backend behavior and course requirements are documented separately as verified evidence.

## Shared understanding

- Assigned topic: Project 2, Equipment Rental System. Build a frontend for the provided backend. The two-person group and required project functions are described in `6901_Project_Topics-957520-17911698720803.pdf`, pp. 1, 3; the group assignment is in `Project_Topic_Assignment_02-957520-17922322178662.pdf`, p. 1.
- Start with the required core: user registration/login/logout, public equipment browsing, admin equipment management, member rental requests, and the stated validations. Treat extras as optional only after the core acceptance checks pass. The functions and limits are in the topic PDF, p. 3.
- Use Next.js with TypeScript, following the course examples. Build the interface in English. Start with plain semantic HTML elements within React; use Tailwind utilities directly in `className` if styling is needed. Other libraries, versions, and file structure remain open unless required by implementation.
- Both members contribute code, checks, and demo preparation. Avoid a split where one person only codes and the other only presents.

## Confirmed feature ownership

| Owner | Confirmed scope | Shared boundary |
|---|---|---|
| Saint | Public equipment catalog and detail, registration/login, member rental-request flow, and My Rentals view/edit/delete. | Coordinate the shared auth and API interfaces with Poom; persistence details remain unresolved. |
| Poom | Admin equipment CRUD; All Rentals view/edit/delete for any member; backend and deployment preparation. | Coordinate shared setup and integration boundaries with Saint. |
| Both | Code, check, and prepare the demo; review each other's integration points and rehearse the seven-minute demo and three-minute Q&A. | Each person contributes to implementation, checks, and demo preparation. |

The confirmed member path is public catalog → equipment detail → login when needed → enter quantity and dates → submit request → My Rentals to view, edit, or delete. Admins manage equipment and view, edit, or delete any rental. Requests do not change stock. Payment and approval are outside the agreed flow. Extras follow the required core.

## UI design and documentation locations

Requirements, backend details, decisions, and contribution documentation live in this GitHub repository. The [Figma file](https://www.figma.com/design/llQS6sjdaGY3OpBfXf7NVh/Untitled?node-id=11-815) is for plain box UI screens with click navigation between them.

Figma currently contains 30 wireframe screen states with prototype navigation for public browsing, registration/login, member rentals, and admin equipment/rentals. Clicking selected input boxes advances to prefilled sample states; these are prototype snapshots, not live forms or API calls. Member and admin flow starting points are configured.

Status on 12 November 2026: incomplete. The Starter-plan MCP quota stopped final corrections. The old diagram still needs removal; the empty/error registration screens need telephone and role fields; a few sample input and item links need correction. Catalog, registration, and rental-form screenshots were inspected. Do not treat this draft as the final UI design submission. Exporting the completed design for MCV remains a submission task.


Still unresolved: auth persistence, shared project/API setup details, and who owns submission tasks. Do not treat the detailed integration suggestions below as confirmed decisions.

## Verified backend integration contract

Backend inspected at [commit be18df9](https://github.com/SWDevPrac2-69-1/PJ02-EquipmentRent/tree/be18df9967be7e0a742b5a5ae25f07966dc4e1d4). Evidence paths below are relative to that repository. The backend project contract is documented in [`2026-PJ02.md`](https://github.com/SWDevPrac2-69-1/PJ02-EquipmentRent/blob/be18df9967be7e0a742b5a5ae25f07966dc4e1d4/2026-PJ02.md).

Base URL defaults to `http://localhost:5000`; configure `PORT` if needed. API docs are at `/api-docs`. Relevant routes and request bodies:

| Method and route | Access | Request body / behavior |
|---|---|---|
| `POST /api/v1/auth/register` | Public | `{ name, email, tel, password, role? }`; role defaults to `member` and currently accepts `admin`. Returns HTTP 201 and user fields plus `data.token`. |
| `POST /api/v1/auth/login` | Public | `{ email, password }`; returns HTTP 200 and user fields plus `data.token`. |
| `GET /api/v1/auth/me` | Bearer token | Returns the current user. |
| `GET /api/v1/auth/logout` | Bearer token | Clears the response cookie; frontend must also discard its stored bearer token. |
| `GET /api/v1/equipment` | Public | Active equipment list, alphabetically sorted. |
| `GET /api/v1/equipment/:id` | Public | One active equipment record. |
| `POST /api/v1/equipment` | Admin | `{ name, category, description, quantity, rentalRate }`. Name must be unique; quantity a nonnegative integer; rate nonnegative. |
| `PUT /api/v1/equipment/:id` | Admin | Partial equipment fields; record must be active. |
| `DELETE /api/v1/equipment/:id` | Admin | Soft-deletes by setting `isActive: false`; returns `{ success: true, data: {} }`. |
| `GET /api/v1/rentals` | Bearer token | Member sees own requests; admin sees all. |
| `GET /api/v1/rentals/:id` | Owner or admin | Returns rental with populated equipment and user details. |
| `POST /api/v1/rentals` | Member | `{ equipment: <equipment MongoDB ID>, quantity, startDate: "YYYY-MM-DD", returnDate: "YYYY-MM-DD" }`; owner is taken from the bearer-authenticated user. |
| `PUT /api/v1/rentals/:id` | Owner or admin | Partial `{ equipment?, quantity?, startDate?, returnDate? }`; omitted fields retain current values. Owner cannot be changed. |
| `DELETE /api/v1/rentals/:id` | Owner or admin | Permanently deletes the request. |

Responses generally use `{ success: true, data }`, with `count` for lists. Create succeeds with 201; other success responses with 200. Errors use `{ success: false, error }`, commonly 400 for invalid rental input, 401 unauthenticated, 403 unauthorized, and 404 not found. Some database validation/cast errors can surface as 500 instead of a client validation response. Backend sources: `routes/auth.js:624-634`, `routes/equipment.js:308-315`, `routes/rentals.js:328-336`; `controllers/auth.js:3-55`, `controllers/equipment.js:3-57`, `controllers/rentals.js:31-135`; `middleware/auth.js:4-34`; `models/User.js:5-35`, `models/Equipment.js:3-20`.

### Shared integration decisions to make before wiring screens

- Agree on one API base URL configuration and one place for the bearer token. Protected requests must send `Authorization: Bearer <token>`; the backend does not authenticate from the cookie. Logout does not revoke existing JWTs, so clear the frontend token locally and update the visible user state.
- Agree on how a demo admin account will be available. The API currently allows public registration to select `role: "admin"` (`controllers/auth.js:17-21`, `models/User.js:15`). This enables the course admin journey, but it is an access-control weakness if exposed beyond the class demo. The PDFs require both roles but do not prescribe how to provision the admin account.
- Members cannot create rental requests through the admin flow; `POST /rentals` is member-only. Admin can list, inspect, edit, and delete any request, but there is no admin rental-create endpoint.
- A deleted equipment item disappears from public browse/detail and cannot be newly rented. Existing rental history remains viewable/deletable; editing an old rental requires changing its equipment reference to an active item (`controllers/equipment.js:45-57`, `controllers/rentals.js:101-108`).
- Rental requests do not reserve or subtract equipment quantity. Each request is checked independently, so overlapping requests can collectively exceed current stock. Do not display a stock deduction or approval state as if the backend provides it.
- Rental duration is implemented as `returnDate - startDate <= 7` days in UTC, so same-day rentals and dates exactly seven days apart pass. Counting both endpoints as calendar days would make the latter eight dates; the assignment does not resolve that interpretation. Match the backend for integration and call out the interpretation if it affects the UI copy.
- For local data-backed API work, configure `MONGO_URI`; the checked-in development env has it blank. Configure a private `JWT_SECRET` and appropriate `FRONTEND_URL` for a hosted frontend. Do not put secrets in frontend code, Git, slides, or this document. Production CORS allows the configured frontend origin; local development allows `http://localhost:3000` (`server.js:136-169`, `config/config.env:1-7`).

## Conceptual screen and flow outline

These are conceptual screens, not required URL or file names:

1. Public equipment list and equipment detail, with loading, empty, and API-error states.
2. Registration and login, with field validation and authentication errors.
3. Member rental-request form and own-request list/detail/edit/delete.
4. Admin equipment list/create/edit/delete, plus rental list/detail/edit/delete for any user.
5. Account exit that clears the frontend token and returns to a public state.

Keep access checks visible in navigation and handle a 401 by returning to the unauthenticated state. A 403 should explain that the current account cannot perform that action. Confirming a soft delete should explain that the item will leave public browsing while old rental history remains.

## Acceptance checklist

Use these as checks to perform and record during implementation; no result is claimed by this draft.

### Authentication and access

- Register with name, email, tel, password, and role; verify success response and token handling. Confirm omitted role becomes member if the UI supports omission.
- Log in with email/password; verify protected calls include the bearer token. Verify missing/invalid token produces a recoverable unauthenticated UI state.
- Log out; verify local token and authenticated UI state are cleared. Re-login should work.
- Verify a member cannot use admin equipment actions and an admin cannot create a rental request; present 403 feedback without losing entered form data unnecessarily.
- Verify members see only their own requests, cannot view/edit/delete another member's request, and admins can view/edit/delete requests belonging to any member.
- Confirm how the admin demo account is provisioned. Do not represent public self-selection of admin as safe account provisioning.

### Equipment

- Public list/detail show only active items and expose the fields needed by the assignment: name, category, description, available quantity, rental rate.
- Admin can create, update, and soft-delete equipment; show field/API errors including duplicate name, negative/non-integer quantity, and negative rate.
- After soft delete, item is absent from browse/detail and cannot be selected for a new rental. An older rental remains accessible; editing it against the inactive item fails unless the equipment is changed to an active item.

### Rental requests

- Member can create a request with equipment ID, quantity, start date, and return date; show returned request details and own-request list.
- Reject invalid calendar dates, past start dates (backend uses UTC), return-before-start, non-integer or out-of-range quantity, quantity above current equipment quantity, and date difference greater than seven days.
- Confirm same-day and exactly-seven-day-difference behavior against backend implementation. Do not infer inclusive-day billing from that validation.
- Member can edit and delete own request; admin can edit/delete any request. Omitted edit fields retain their values; client must not expect to transfer ownership.
- Confirm that request create/edit/delete does not deduct stock and that overlapping requests can exceed aggregate stock because checks are per request.

### End-to-end presentation path

- Prepare an ordinary member journey: register and show validation; log in; browse/view equipment; create a valid request and demonstrate one invalid request; view, edit, and delete own request; log out.
- Prepare an admin journey: log in; view requests from users; edit and delete a request; create an equipment item. Have a sample equipment item ready before the presentation.
- Verify a 7-minute demo and 3-minute Q&A plan. These steps and timings follow `Project-Submission-Presentation-Instructions_6aecab16d9430.pdf`, pp. 3-4.

## Sequence and completion receipts

1. Implement the confirmed core journeys using the ownership above. Resolve the API base URL strategy, shared auth state contract, and admin demo-account plan during integration; these details are not yet confirmed.
2. Agree the conceptual screen flow and minimal shared types/API response handling before separate feature implementation.
3. Implement core journeys in the confirmed ownership areas; integrate at the shared auth and API boundaries as soon as each is available.
4. Each member records the acceptance checks they personally ran, the relevant commit/PR reference in the team repository, and one demo step they own. The other member reviews and rehearses that step.
5. Prepare the UI Flow Design artifact and presentation slide deck with assigned problem, UI flow, demonstration, additional functionality if any, and contribution split. Attach a UI design file to MCV; a Figma export is one permitted format. Include team repository and Vercel links in the slide deck and MCV submission as required.
6. Poom may prepare deployment configuration and verify frontend/API/CORS environment values locally or in a draft configuration. This handoff does not authorize publishing, pushing, deploying, or writing to MCV/Google Sheets. No deployment, presentation booking, or submission is claimed complete.

Course deliverables and timing to plan around: group of two and group creation in MCV by 27 Aug 2026 23:59 (`00_ClassOrientation-957520-17859437725987.pdf`, p. 11); presentation booking opens 13 Nov 2026 16:00, edit own booking by 17 Nov 2026 23:00, and presentation is 7 minutes plus 3 minutes Q&A (`Project-Submission-Presentation-Instructions_6aecab16d9430.pdf`, p. 3); project submission via MCV, team repository, and Vercel by 18 Nov 2026 23:00 with slides and UI Design artifact (`Project-Submission-Presentation-Instructions_6aecab16d9430.pdf`, p. 2). Class Orientation lists the project presentation in Class 15 on 19 Nov 2026 (p. 9); confirm the group's booked slot rather than assuming a specific time.

## Evidence and scope limits

- Assignment topic and shared setup: `6901_Project_Topics-957520-17911698720803.pdf`, pp. 1, 3.
- Group assignment: `Project_Topic_Assignment_02-957520-17922322178662.pdf`, p. 1.
- Submission, rubric, journey, and presentation logistics: `Project-Submission-Presentation-Instructions_6aecab16d9430.pdf`, pp. 1-4.
- Group and course context: `00_ClassOrientation-957520-17859437725987.pdf`, pp. 6, 9, 11-12.
- Backend implementation inspected at `be18df9967be7e0a742b5a5ae25f07966dc4e1d4`; use the code contract above as evidence of current behavior, and verify again if the backend revision changes.

This file records confirmed decisions and open implementation questions; it is not a test report, deployment record, presentation booking, or MCV submission receipt.
