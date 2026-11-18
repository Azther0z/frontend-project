# Equipment Rental System

Saint and Poom's Course Project 2 lets members request equipment rentals and admins manage equipment and rental requests.
This repository contains project documentation and 18 course PDFs. It does not contain the application yet.

The updated [Figma design](https://www.figma.com/design/llQS6sjdaGY3OpBfXf7NVh/SW-DEV-PRAC-2?node-id=0-1) defines the base screens and product behavior. The [November 18 decisions](docs/FRONTEND-PLAN.md#confirmed-decisions) supplement it.
The [Figma guide](docs/FIGMA.md) records the 20 screen frames and behavior note reviewed on November 16, 2026, after the agreed design updates.
The [November 18 decisions](docs/FRONTEND-PLAN.md#confirmed-decisions) confirm a simple Next.js structure with NextAuth, inline feedback, deletion confirmation, and a one-month range calendar.
These decisions supplement the saved Figma design. Backend contracts and the proposed team split remain separate references. Course PDFs are reference files, not product requirements.
The [glossary](GLOSSARY.md) defines the project terms used in these guides.
The [frontend plan](docs/FRONTEND-PLAN.md#confirmed-decisions) records the confirmed scope and separates it from implementation proposals.

## Documentation

Read the guides in this order:

1. [Figma guide](docs/FIGMA.md): source, frame inventory, and captured design evidence.
2. [Requirements](docs/REQUIREMENTS.md): Figma-based screens and behavior, plus separate backend limits.
3. [System design](docs/SYSTEM-DESIGN.md): proposed frontend, backend, and database boundaries.
4. [Frontend plan](docs/FRONTEND-PLAN.md): proposed folders, routes, components, and state.
5. [Shared contracts](docs/SHARED-CONTRACTS.md): backend data types and proposed component interfaces.
6. [API guide](docs/API.md): supplied backend routes, fields, limits, and integration gaps.
7. [Contribution guide](docs/CONTRIBUTION-HANDOFF.md): proposed ownership, build order, and integration checks.

## Repository structure

The planned application uses these directories:

- `frontend/`: Next.js and TypeScript application.
- `backend/`: Copy of the supplied Express backend.
- `docs/`: Project guides, Figma evidence, and course PDFs in `docs/pdf/`.

The [supplied backend](https://github.com/SWDevPrac2-69-1/PJ02-EquipmentRent) provides account, equipment, and rental APIs.
Frontend and backend setup follows [FRONTEND-PLAN.md](docs/FRONTEND-PLAN.md).
