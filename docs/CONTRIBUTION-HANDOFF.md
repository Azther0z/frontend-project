# Team contribution and implementation handoff

This guide retains the proposed work split, review duties, and implementation handoff. These are team proposals, not facts from Figma.
The updated [Figma design](FIGMA.md) defines the base screens and product behavior. The [November 18 decisions](FRONTEND-PLAN.md#confirmed-decisions) supplement it.
The team must accept shared interfaces before both workstreams depend on them.

## Proposed ownership

| Owner | Main work |
|---|---|
| Saint | Home, guest and member equipment catalog and details, separate registration/login pages, auth state, member rentals, and shared interface drafts |
| Poom | Backend copy, admin equipment and rental pages, shared demo setup, hosting choice, booking, deployment, and submission logistics |
| Both | Shared interface review, integration, code review, acceptance checks, and demo preparation |

Both members contribute code and review each other's work. The named owner coordinates each task and raises blockers early.

## Shared work rules

- Agree on shared types, API function behavior, and auth state before feature code depends on them.
- Follow Figma for product screens. Use [API.md](API.md) separately for backend fields, access rules, and validation constraints.
- Reuse rental and equipment forms for their create and edit paths.
- Share one date-range calendar input and the inclusive-day cost calculation. Rental forms keep the equipment fixed.
- Use the same browser paths for member and admin variants. Admins have no Rent controls or rental creation path.
- Add guest equipment list and detail variants on the same paths. Keep Home minimal. Guest cards have no request controls; guest details open Login through Login to request.
- Login, registration, and logout go to Home without a remembered item or destination. Record creation and editing open details; deletion returns to the list.
- Use current equipment rates for all totals and round the final total once to two decimals, halfway upward. The demo is desktop only.
- Keep backend authorization in force. A hidden button does not protect data.
- Each member configures a local backend, database, and data set. Poom provides the backend source copy and example configuration, then coordinates shared demo accounts, equipment, and rental requests.
- Keep required behavior in [REQUIREMENTS.md](REQUIREMENTS.md).
- For each change, the author runs the relevant checks. The other member reviews the change and its actual results.
- Record unresolved issues with an owner and next action in the task or pull request.

## Implementation handoff

The implementation handoff is ready only when both members accept the shared interfaces and one real member rental path passes against the backend.
That path includes member login, `/equipments/[id]/rent`, one calendar range, cost display, creation, and the member's rental list and detail page.
Record the test action and result with the implementation work. Design screenshots do not establish that an application path passes.

Reviewing a design or plan does not satisfy this handoff condition. Do not build dependent admin integration until the shared interfaces are accepted and the member path passes.

## Implementation checkpoint

The `feat/member-rental-flow` branch contains the first frontend implementation slice.
It adds the NextAuth credentials flow, shared API helpers, guest equipment pages, and member rental create, list, detail, edit, and delete pages.
It also adds the one-month date-range calendar, inclusive current-rate cost display, inline errors, and delete confirmation.

The local lint and production build pass. The production dependency audit reports no vulnerabilities.
The full npm audit reports a high-severity `picomatch` advisory in the lint-tool dependency tree.
Its suggested forced fix downgrades `eslint-config-next` to version 14, so it was not applied.
This records Saint's original branch checkpoint. The continuation below adds the backend, verifies the member path, and implements admin management.

The class demo intentionally keeps Member and Admin registration. Keep backend authentication, role checks, and ownership checks as the security authority.

The user confirmed the simple structure, NextAuth, feedback, and calendar behavior on November 18, 2026.
See the [frontend plan](FRONTEND-PLAN.md#confirmed-decisions). Detailed TypeScript interfaces still need implementation review.

## Continuation checkpoint

Work continues from Saint's `0fdcfb8` on `codex/admin-management`.
The backend copy is pinned at `be18df9`; source details, local changes, and setup
are recorded in [backend/UPSTREAM.md](../backend/UPSTREAM.md).

Implemented:

- Admin equipment Add/View/Edit/Delete, including shared create/edit fields.
- Admin rental list/detail/edit/delete on the existing URLs, with owner labels.
- Shared native Cancel/Delete dialogs and immediate removal from list state.
- Decimal halfway-up cost rounding, calendar reselection beyond the original
  range, protected-401 sign-out, and always-Home logout without a redirect race.
- Disposable local MongoDB, seeded member/admin accounts and equipment, and
  repeatable real-service browser/API tests.

Verification on November 18, 2026:

- Frontend lint, TypeScript check, cost regression tests, and production build pass.
- Eight Playwright tests pass against the final Next.js production build, the
  real Express API, and a real temporary MongoDB process. No HTTP responses are
  mocked. The development-mode suite also passed before the final production run.
- Member path: login, select equipment, one-calendar same-day range, displayed
  total, create, list, detail, edit, cancel deletion, delete, and logout to Home.
- Admin path: equipment creation, rejection preserving form values, equipment
  editing/deletion, member rental list/detail/edit/delete, owner labels, and
  current-rate totals after a rate change, and inline backend rejection after stock
  falls to zero while preserving the rental form. Deleting equipment retains rentals.
- Calendar: a completed range can be replaced by a start two months later.
- Auth: registration confirmation, successful registration/sign-in, invalid
  login feedback, guest/member admin-page restrictions, admin rental-creation
  denial, and local session clearing after a real backend 401.
- API: missing/invalid token, member equipment-write denial, admin rental-create
  denial, cross-member read/edit/delete denial, fractional/oversized quantities,
  past/reversed/overlong dates, and the seven-inclusive-day boundary.
- Duration clarification: the local backend and frontend now allow June 10–16
  and reject June 10–17. Both member and admin updates reject an eighth day
  without changing the stored request. The calendar disables the eighth day.
- Postman public-equipment request: HTTP 200 with one passing assertion; local
  execution only (`--no-report-events`).

Compatible backend dependency fixes removed the reported high and critical
production findings. The backend production audit still reports three moderate
findings in `swagger-jsdoc` / `glob` / `minimatch`. Frontend production audit
reports zero findings. The original development-tool advisory is not claimed
resolved. No forced major-version dependency changes were applied.

Remaining work:

1. Saint and Poom review the implemented contracts and UI before merging.
2. Configure a persistent shared database, final hosting environments, and CORS;
   deploy the frontend to Vercel and backend to the chosen Node host.
3. Run the member/admin journeys again on the deployed services. Local passes
   do not establish production connectivity or deployment readiness.
4. Prepare shared demo data, presentation slides, Figma export, contribution
   evidence, and submission links. Confirm presentation booking separately.

Deployment settings and local commands are in [README.md](../README.md).
No hosting accounts, presentation booking, or submission system were changed.

## Build order

1. Review and accept shared types, API functions, and auth state.
2. Connect Home, separate account pages, guest and member equipment screens, and one complete member rental path.
3. Add member rental view, edit, and delete actions.
4. Add admin equipment and rental actions.
5. Rehearse the demo.

## Design and backend gaps

The [API guide](API.md#figma-integration) records the confirmed current-rate pricing, rounding, unchanged availability validation, and the seven-inclusive-day duration limit.
Use normal feedback for rejected updates. Do not add an equipment selector or availability-specific frontend controls.
Keep backend quantity and date limits in the docs. Do not add those limits to Figma.
