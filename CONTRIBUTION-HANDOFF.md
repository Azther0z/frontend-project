# Saint and Poom: handoff

Status: planning draft. Read [FRONTEND-PLAN.md](FRONTEND-PLAN.md) before starting code.
Requirements are in [DELIVERABLES.md](DELIVERABLES.md). API details are in [API.md](API.md).

## Work split

| Owner | Work |
|---|---|
| Saint | Public catalog and details, account forms, auth state, member rentals |
| Poom | Admin equipment, admin rentals, backend setup, deployment preparation |
| Both | Shared interfaces, integration, review, tests and demo |

Saint starts the shared types, API wrapper, auth provider, and rental form interfaces from the frontend plan.
Poom reviews these interfaces before building admin pages. Poom reuses the rental form for admin edits.
Both members write code and run checks. Neither member owns only the presentation.

## Decisions before coding

The directory and component plan is a draft. The stack is Next.js with TypeScript.
Use English, plain HTML inside React, and Tailwind classes when needed.
Complete required features before extras.

Agree on token persistence, the actual backend URL, and member/admin demo accounts.
Name the owner for booking, slides, design export, and MCV submission.
The frontend plan uses memory-only tokens as a draft default. A refresh requires login again.

## Build order

1. Agree on shared types, API functions and auth state.
2. Connect catalog, details, login and member rental creation.
3. Add member view, edit and delete.
4. Add admin equipment and rental actions.
5. Run the checks below and rehearse the demo.
6. Complete the submission checklist in DELIVERABLES.md.

## Checks to record

These checks are pending. A document or Figma screen is not a passing test.

- Register all five fields. Log in, log out, and handle an expired token.
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

Requirements and the work split are documented. The directory and component plan is ready for team review.
Application code, integration tests, deployment, booking, and MCV submission are not complete.
This handoff does not record a passing demo or a submission receipt.
