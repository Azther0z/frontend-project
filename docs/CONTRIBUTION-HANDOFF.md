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
The live member rental path still needs a configured backend and database.
The supplied backend guide records a blank `MONGO_URI`. No backend copy or live data setup is included in this branch.
Poom can continue with admin equipment and rental management, then run the member path against a configured backend and record the result here.

The class demo intentionally keeps Member and Admin registration. Keep backend authentication, role checks, and ownership checks as the security authority.

The user confirmed the simple structure, NextAuth, feedback, and calendar behavior on November 18, 2026.
See the [frontend plan](FRONTEND-PLAN.md#confirmed-decisions). Detailed TypeScript interfaces still need implementation review.

## Build order

1. Review and accept shared types, API functions, and auth state.
2. Connect Home, separate account pages, guest and member equipment screens, and one complete member rental path.
3. Add member rental view, edit, and delete actions.
4. Add admin equipment and rental actions.
5. Rehearse the demo.

## Design and backend gaps

The [API guide](API.md#figma-integration) records the confirmed current-rate pricing, rounding, and unchanged availability and date validation.
Use normal feedback for rejected updates. Do not add an equipment selector or availability-specific frontend controls.
Keep backend quantity and date limits in the docs. Do not add those limits to Figma.
