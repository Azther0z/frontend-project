# Saint and Poom: Equipment Rental System

Course Project 2 is an equipment rental system. This repository holds the project documents and will hold the Next.js and TypeScript frontend for the supplied backend.

## Read in this order

1. [Frontend plan](FRONTEND-PLAN.md): planned folders, routes and React components.
2. [Contribution handoff](CONTRIBUTION-HANDOFF.md): team ownership, checks, and open decisions.
3. [Required deliverables](DELIVERABLES.md): assignment requirements, deadline, grading, and presentation steps.

The [API guide](API.md) lists backend routes, fields and rules.

## Design

The [Figma file](https://www.figma.com/design/llQS6sjdaGY3OpBfXf7NVh/Untitled) contains eight main wireframes and two delete dialogs. Its click prototype needs repair.

## Agreed work

- Saint: public equipment browsing, accounts, member rentals, Figma and slides.
- Poom: admin equipment and rental management, backend copy, hosting decision, booking, deployment and MCV.
- Both: integration checks, reviews, UI flow review, and presentation preparation.

Use English and semantic HTML in React. Follow the course examples for Next.js and TypeScript. Use Tailwind utility classes in `className` when styling is needed.

The [supplied backend](https://github.com/SWDevPrac2-69-1/PJ02-EquipmentRent) provides authentication, equipment APIs, and rental APIs. A rental request does not change equipment quantity. Payment and approval are outside the agreed core scope.

## Status

Documentation and UI design are in progress. The application, integration tests, deployment, and MCV submission are not verified. Poom owns the open hosting decision. Read the [deployment research](docs/DEPLOYMENT-OPTIONS.md).

## Repository plan

Use `frontend/` for Next.js, `backend/` for the supplied backend copy, and `docs/` for guides.
Put all course PDFs in `docs/pdf/`. These code imports and file moves are pending.
