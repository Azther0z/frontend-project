# Team contribution and implementation handoff

This guide retains the proposed work split, review duties, and implementation handoff. These are team proposals, not facts from Figma.
The updated [Figma design](FIGMA.md) is the only source for screens and product behavior.
The team must accept shared interfaces before both workstreams depend on them.

## Proposed ownership

| Owner | Main work |
|---|---|
| Saint | Home, member equipment catalog and details, separate registration/login pages, auth state, member rentals, and shared interface drafts |
| Poom | Backend copy, admin equipment and rental pages, shared demo setup, hosting choice, booking, deployment, and submission logistics |
| Both | Shared interface review, integration, code review, acceptance checks, and demo preparation |

Both members contribute code and review each other's work. The named owner coordinates each task and raises blockers early.

## Shared work rules

- Agree on shared types, API function behavior, and auth state before feature code depends on them.
- Follow Figma for product screens. Use [API.md](API.md) separately for backend fields, access rules, and validation constraints.
- Reuse rental and equipment forms for their create and edit paths.
- Share one date-range calendar input and the inclusive-day cost calculation. Rental forms keep the equipment fixed.
- Use the same browser paths for member and admin variants. Admins have no Rent controls or rental creation path.
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

The supplied backend accepts public admin self-registration. The demo is for the class only until the team chooses server-side role restrictions. Prepared demo accounts do not secure the public registration endpoint. Keep backend authentication, role checks, and ownership checks as the security authority. This handoff gate does not change those rules.

## Build order

1. Review and accept shared types, API functions, and auth state.
2. Connect home, separate account pages, member equipment screens, and one complete member rental path.
3. Add member rental view, edit, and delete actions.
4. Add admin equipment and rental actions.
5. Rehearse the demo.

## Design and backend gaps

The [API guide](API.md#figma-integration) records inactive-equipment edits, past-date validation, historical prices, and currency rounding.
Assign those decisions before the related implementation depends on them. Do not add a selector or change the cost formula without agreement.
Keep backend quantity and date limits in the docs. Do not add those limits to Figma.
