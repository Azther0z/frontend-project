# Saint and Poom: handoff

Status: agreed plan, recorded on 12 November 2026. Implementation is pending. Read [FRONTEND-PLAN.md](FRONTEND-PLAN.md) before starting code.
Requirements are in [DELIVERABLES.md](DELIVERABLES.md). API details are in [API.md](API.md).

## Work split

| Owner | Work |
|---|---|
| Saint | Public catalog and details, account forms, auth state, member rentals, Figma and slides |
| Poom | Admin equipment, admin rentals, backend copy, hosting decision, booking, deployment and MCV |
| Both | Shared interfaces, integration, review, tests and demo |

Saint starts the shared types, API wrapper, auth provider, and rental form interfaces from the frontend plan.
Poom reviews these interfaces before building admin pages. Poom reuses the rental form for admin edits.
Both members write code and run checks. Neither member owns only the presentation.

## Agreed decisions

Use one repository with `frontend/`, `backend/`, and `docs/`. Put all course PDFs in `docs/pdf/`.
Use Next.js App Router, TypeScript, English, plain HTML inside React, and Tailwind classes when needed.
Complete required features before extras. Reuse the rental and equipment forms for their create/edit flows.

Keep login in `sessionStorage` for the current tab. Restore it after refresh and clear it on logout or HTTP 401.
Sign the user in after registration. Members can continue a pending rental.
Show the assignment's member/admin role selector. Use prepared test accounts for the demo.

Each member runs a local backend with separate development data.
Poom owns the shared demo setup and decides its hosting. Keep this decision open.
The [deployment research](DEPLOYMENT-OPTIONS.md) covers one-project and two-project Vercel options.
Neither option is tested or selected. The actual deployment URL is pending.

## Handoff requirement

Saint drafts the shared API, types, auth and rental form interfaces. Poom reviews them.
The handoff needs agreed interfaces and one passing member rental path.
Both members review Figma, slides, booking details, deployment and the final submission.

## Build order

1. Agree on shared types, API functions and auth state.
2. Connect catalog, details, login and member rental creation.
3. Add member view, edit and delete.
4. Add admin equipment and rental actions.
5. Run the checks below and rehearse the demo.
6. Complete the submission checklist in DELIVERABLES.md.

## Checks to record

These checks are pending. A document or Figma screen is not a passing test.

- Register all five fields and sign in automatically. Test member/admin routing.
- Log in, refresh, log out, close the tab, and handle an expired token.
- Allow public equipment browsing. Restrict equipment changes to admins.
- Allow members to create, view, edit and delete own rentals only.
- Allow admins to view, edit and delete any rental. Block admin rental creation.
- Test invalid dates, past starts, reversed dates, quantity limits and the seven-day limit.
- Test same-day and exactly-seven-day rentals against the API.
- Test equipment add, update and delete, including duplicate names and invalid numbers.
- Keep old rentals readable after equipment deletion. Select active equipment before editing them.
- Keep stock unchanged after rental changes. Test overlapping requests.
- Show loading, empty lists, errors and success. Keep entered values after errors.
- Return edits to the correct member or admin list.
- Test the deployed frontend and backend together, including CORS.

For each completed task, record the owner, commit or PR, test action, and actual result.
The other member reviews it. Record failures and remaining work too.

## UI Flow Design

The [Figma draft](https://www.figma.com/design/llQS6sjdaGY3OpBfXf7NVh/Untitled) has eight main screens and two small delete dialogs.
The screen count and layout were inspected on 12 November 2026. The click prototype is incomplete.

Browser tests reached Catalog, Details, Account, registration, and the rental form with inline create feedback.
Some links failed, including the post-create list link and member Edit action.
Component moves disrupted navigation. Inspect and repair shared component definitions before testing the full member and admin flows.
The MCP quota and daily Figma AI credit limit also affect automated work.
Do not submit this draft as the final UI Flow Design. Export the finished design and attach it to MCV.

## Completion status

Requirements, the work split, and the directory and component plan are agreed.
The PDF move is complete. Frontend/backend scaffold and backend import are pending. Planned type files are not created. This update changes documentation only.
Application code, integration tests, deployment, booking, and MCV submission are not complete.
This handoff does not record a passing demo or a submission receipt.
