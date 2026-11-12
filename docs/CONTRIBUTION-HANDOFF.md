# Team contribution and implementation handoff

This guide defines the proposed work split, review duties, and implementation handoff. The team must accept shared interfaces before both workstreams depend on them.

## Proposed ownership

| Owner | Main work |
|---|---|
| Saint | Public equipment catalog and details, account forms, auth state, member rentals, and first drafts of shared interfaces |
| Poom | Backend copy, admin equipment and rental pages, shared demo setup, hosting choice, booking, deployment, and submission logistics |
| Both | Shared interface review, integration, code review, acceptance checks, and demo preparation |

Both members contribute code and review each other's work. The named owner coordinates each task and raises blockers early.

## Shared work rules

- Agree on shared types, API function behavior, and auth state before feature code depends on them.
- Use the backend field names and access rules in [API.md](API.md).
- Reuse rental and equipment forms for their create and edit paths.
- Keep backend authorization in force. A hidden button does not protect data.
- Each member configures a local backend, database, and data set. Poom provides the backend source copy and example configuration, then coordinates shared demo accounts, equipment, and rental requests.
- Keep required behavior in [REQUIREMENTS.md](REQUIREMENTS.md).
- For each change, the author runs the relevant checks. The other member reviews the change and its actual results.
- Record unresolved issues with an owner and next action in the task or pull request.

## Implementation handoff

The implementation handoff is ready only when both members accept the shared interfaces and one real member rental path passes against the backend. A real path includes signing in as a member, creating a rental, and seeing it in the member's list. Record the test action and result with the implementation work.

Reviewing a design or plan does not satisfy this handoff condition. Do not build dependent admin integration until the shared interfaces are accepted and the member path passes.

The supplied backend accepts public admin self-registration. The demo is for the class only until the team chooses server-side role restrictions. Prepared demo accounts do not secure the public registration endpoint. Keep backend authentication, role checks, and ownership checks as the security authority. This handoff gate does not change those rules.

## Build order

1. Review and accept shared types, API functions, and auth state.
2. Connect public equipment browsing, account access, and one complete member rental path.
3. Add member rental view, edit, and delete actions.
4. Add admin equipment and rental actions.
5. Rehearse the demo.
