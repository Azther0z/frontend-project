# Design and implementation review criteria

Use this guide to review the requirements, shared contracts, and implementation. Review findings must name the affected requirement or interface and state the change or evidence needed. This guide does not record a review decision.

## Review route

Read these documents when reviewing the design and shared boundaries:

1. [REQUIREMENTS.md](REQUIREMENTS.md) for required behavior.
2. [SYSTEM-DESIGN.md](SYSTEM-DESIGN.md) for frontend, backend, and database boundaries.
3. [FRONTEND-PLAN.md](FRONTEND-PLAN.md) for routes, components, and state ownership.
4. [SHARED-CONTRACTS.md](SHARED-CONTRACTS.md) for data types and API function shapes.
5. [API.md](API.md) for backend routes, fields, and access rules.
6. [DEPLOYMENT-OPTIONS.md](DEPLOYMENT-OPTIONS.md) for hosting choices.

Review the actual source files and callers when implementation exists. A plan alone does not prove that code follows the plan.

## Review criteria

### Requirements and system boundaries

- Make sure that each required member and admin action in `REQUIREMENTS.md` has a matching route and backend operation.
- Make sure that public users can browse active equipment.
- Make sure that only admins can add, update, or remove equipment.
- Make sure that members can manage only their own rentals.
- Make sure that admins can view and manage rentals but cannot create rentals.
- Make sure that the backend enforces each access rule.

### Frontend behavior

- Make sure that catalog, equipment details, account, member rentals, admin equipment, and admin rentals have clear routes.
- Make sure that create and edit use the same rental form and the same equipment form.
- Make sure that pages show loading, empty, error, and success states.
- Make sure that forms keep entered values after an API error and prevent duplicate submits while a request runs.
- Make sure that login returns to a safe internal route and preserves the requested equipment when a member starts a rental.
- Make sure that edits return to the correct member or admin list.

### Shared contracts and API boundary

- Make sure that `user.ts`, `equipment.ts`, `rental.ts`, and `api.ts` match their actual callers and [API.md](API.md).
- Make sure that `id` in login and registration responses differs from `_id` in `/auth/me` and database records.
- Make sure that frontend state uses one form of the user identifier.
- Make sure that rental input sends an equipment ID in the field named `equipment`.
- Make sure that read data and request input use the correct backend fields and date formats.
- Make sure that protected API calls send the bearer token and handle 401 and 403 responses differently.
- Make sure that the backend remains the authority for access decisions.

### Acceptance cases

Use these cases to review implementation. Record the action and actual result with the code change. A passing result must come from the running application and backend.

- Register with all required fields, sign in, refresh the page, sign out, and close the tab. Test member and admin routing and expired-token handling.
- Browse equipment without signing in. Make sure that equipment changes require an admin.
- As a member, create, view, edit, and delete the member's own rentals. Make sure that another member's rental stays inaccessible.
- As an admin, view, edit, and delete rentals. Make sure that admin rental creation is unavailable and rejected by the backend.
- Test rental quantities, past start dates, reversed dates, same-day rentals, exactly seven elapsed days, and rentals longer than seven days.
- Test equipment creation, update, and removal, including duplicate names and invalid numbers.
- Make sure that existing rentals remain readable after equipment removal and that an edit can select active equipment.
- Make sure that rental changes do not change equipment stock. Test overlapping requests against the backend's stated behavior.
- Test loading, empty, error, and success states. Make sure that a failed submit keeps the entered values.
- Test the frontend and backend together in the chosen deployment, including CORS and the configured API URL.

## Ownership and handoff

Use the proposed owners and review duties in [CONTRIBUTION-HANDOFF.md](CONTRIBUTION-HANDOFF.md). The implementation handoff requires both members to accept the shared interfaces and one real member rental path to pass.

Poom coordinates the hosting choice and shared demo setup. Record the selected layout and URLs in [DEPLOYMENT-OPTIONS.md](DEPLOYMENT-OPTIONS.md) when the team makes that decision. Keep submission steps in [SUBMISSION.md](SUBMISSION.md).
