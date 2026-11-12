# Saint and Poom: Equipment Rental System

Course Project 2 is an equipment rental system. This repository holds the project documents and will hold the Next.js and TypeScript frontend for the supplied backend.

## Read in this order

1. [Required deliverables](docs/DELIVERABLES.md): assignment requirements, deadline, grading, and presentation steps.
2. [System design](docs/SYSTEM-DESIGN.md): proposed system boundaries and diagram.
3. [Frontend plan](docs/FRONTEND-PLAN.md): proposed folders, routes and React components.
4. [Shared contracts](docs/SHARED-CONTRACTS.md): proposed typed interfaces and callers.
5. [API guide](docs/API.md): pinned backend routes, fields and rules.
6. [UI flows](docs/UI-FLOWS.md): design flow and current prototype check receipt.
7. [Deployment options](docs/DEPLOYMENT-OPTIONS.md): Poom's open hosting decision.
8. [Poom review](docs/POOM-REVIEW.md) and [contribution handoff](docs/CONTRIBUTION-HANDOFF.md): decisions, ownership, and implementation gates.

## Design

The [Figma file](https://www.figma.com/design/llQS6sjdaGY3OpBfXf7NVh/Untitled) contains eight main screens and two delete dialogs. Core prototype paths have been checked; member and admin registration have passed. The prototype has mock interactions, no data persistence, and manual member/admin context changes. See [UI-FLOWS.md](docs/UI-FLOWS.md) for the exact receipt and remaining limits.

## Proposed work split for Poom review

- Saint: public equipment browsing, accounts, member rentals, Figma and slides.
- Poom: admin equipment and rental management, backend copy, hosting decision, booking, deployment and MCV.
- Both: integration checks, reviews, UI flow review, and presentation preparation.

Use English and semantic HTML in React. Follow the course examples for Next.js and TypeScript. Use Tailwind utility classes in `className` when styling is needed.

The [supplied backend](https://github.com/SWDevPrac2-69-1/PJ02-EquipmentRent) provides authentication, equipment APIs, and rental APIs. A rental request does not change equipment quantity. Payment and approval are outside the documented required scope.

## Status

The design proposal is Saint-confirmed and pending Poom review. The PDFs and guides are organized under `docs/`. The frontend/backend scaffold and type files are planned but not created. Prototype checks do not verify the application. Integration, deployment, and MCV submission are not verified. Hosting is delegated to Poom and remains open. Read the [deployment options](docs/DEPLOYMENT-OPTIONS.md) and [Poom review](docs/POOM-REVIEW.md).

## Repository plan

Use `frontend/` for Next.js, `backend/` for the supplied backend copy, and `docs/` for guides.
Put all course PDFs in `docs/pdf/`. The guide and PDF moves are complete. Frontend/backend scaffold and code imports remain pending.
