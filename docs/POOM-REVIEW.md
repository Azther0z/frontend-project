# Poom design review

Status: Saint-confirmed proposal, pending Poom review. No Poom decision is recorded here. This is a review of the proposed design and work split, not approval to start the implementation handoff.

## Reading route

Read the documents in this order. The system diagram, shared contract summary, and UI flow notes are expected review artifacts; if one is not available at its link, mark that item blocked and ask for the artifact rather than infer its contents.

1. [DELIVERABLES.md](DELIVERABLES.md) — required behavior and submission requirements.
2. [SYSTEM-DESIGN.md](SYSTEM-DESIGN.md) — proposed system boundaries and diagram.
3. [FRONTEND-PLAN.md](FRONTEND-PLAN.md) — routes, components, state, and screen reuse.
4. [SHARED-CONTRACTS.md](SHARED-CONTRACTS.md) — shared interfaces and their callers.
5. [API.md](API.md) — pinned backend routes, fields, access rules, and known limitations.
6. [UI-FLOWS.md](UI-FLOWS.md) — screen flow and prototype review. Also inspect the [Figma draft](https://www.figma.com/design/llQS6sjdaGY3OpBfXf7NVh/Untitled).
7. [DEPLOYMENT-OPTIONS.md](DEPLOYMENT-OPTIONS.md) — hosting choices and the open hosting decision.

For the TypeScript shapes, inspect the planned files in `frontend/src/types/`: `user.ts`, `equipment.ts`, `rental.ts`, and `api.ts`. Check each against its actual callers in `frontend/src/lib/api/` and the backend contract in `API.md`; the plan currently says these files have not been created.

## Four review items

For each item, choose **Accept**, **Change**, or **Blocked**. “Accept” records agreement with that proposal only. Add a concrete change or missing evidence when needed. Do not reopen a selected choice unless it conflicts with a requirement, the pinned API, or another review artifact.

### 1. Requirements and system design

Check that the system design covers the required member and admin behavior in [DELIVERABLES.md](DELIVERABLES.md), and that its diagram matches the planned frontend, backend, and database boundaries. Check the caller/API role boundary: public equipment reads, member-owned rental operations, admin rental access, admin-only equipment changes, and no admin rental creation.

- Decision: ______ (Accept / Change / Blocked)
- Change or evidence needed: ______

### 2. Frontend plan and eight screen flows

Check the eight main designs and their route reuse against the table in [FRONTEND-PLAN.md](FRONTEND-PLAN.md): catalog, equipment details, account, rental form, my rentals, admin equipment, equipment form, and admin rentals. The rental form and equipment form reuse create/edit designs; deletion uses confirmation dialogs. Check loading, empty, error, and success states, and the login return path for a requested equipment item.

The core prototype paths have been tested: catalog/details, member/admin login, member rental create/edit/delete, admin equipment add/edit/delete, and admin rental view/edit/delete. Member and admin registration have passed. See [UI-FLOWS.md](UI-FLOWS.md) for the exact receipt. The prototype uses mock interactions: data does not persist, and member/admin context changes are manual. These checks do not verify the application implementation.

- Decision: ______ (Accept / Change / Blocked)
- Change or evidence needed: ______

### 3. Shared contracts and backend boundary

Review the proposed `user.ts`, `equipment.ts`, `rental.ts`, and `api.ts` shapes and API function signatures in [SHARED-CONTRACTS.md](SHARED-CONTRACTS.md). These planned source files do not exist yet. Confirm auth input/response shapes and token handling; distinguish login/register `id` from `/auth/me` and record `_id`, and check the frontend normalization; use backend field names; ensure `RentalInput.equipment` carries the equipment ID; and check the caller role and authorization expectations for each API function against [API.md](API.md). The backend, not hidden UI controls, enforces access.

- Decision: ______ (Accept / Change / Blocked)
- Change or evidence needed: ______

### 4. Ownership and implementation handoff

Review the proposed owners in [CONTRIBUTION-HANDOFF.md](CONTRIBUTION-HANDOFF.md) and [FRONTEND-PLAN.md](FRONTEND-PLAN.md). Check that Saint's shared interface draft and Poom's admin integration responsibilities are clear, along with backend copy, hosting decision, booking, deployment, and submission ownership. Design approval can be recorded before code exists. The implementation handoff is a later gate: interfaces must be accepted by both members and one complete member rental path must pass, with its actual result recorded.

- Decision: ______ (Accept / Change / Blocked)
- Change or evidence needed: ______

## Separate decision: hosting

Hosting remains delegated to Poom and open. Review the two documented Vercel layouts and record the selected option, reason, frontend/backend URLs, and test result in [DEPLOYMENT-OPTIONS.md](DEPLOYMENT-OPTIONS.md). This hosting decision is not implied by accepting the four design items.

- Decision: ______ (Option 1 / Option 2 / Keep open)
- Reason or follow-up: ______

## Review record

- Reviewer: Poom
- Review date: ______
- Summary / remaining changes: ______
- Implementation handoff ready: ______ (only after accepted shared interfaces and a passing member rental path are recorded)
