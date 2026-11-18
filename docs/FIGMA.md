# Figma source and screen inventory

The updated [SW DEV PRAC 2 design](https://www.figma.com/design/llQS6sjdaGY3OpBfXf7NVh/SW-DEV-PRAC-2?node-id=0-1) defines the base screens and product behavior. The [November 18 decisions](FRONTEND-PLAN.md#confirmed-decisions) supplement it.
The page is `UI Flow Design`. The file key is `llQS6sjdaGY3OpBfXf7NVh`.
The review date is November 16, 2026, in Asia/Bangkok.

This guide describes the saved design after the agreed updates below. The design contains 20 screen frames and a separate behavior note.
The frames were inspected in Figma through Chrome. The changed frames were inspected again after reloading the file.
This guide and its screenshots are records of that source. They do not replace the live design.

## Source boundaries

Screens, routes, visible fields, and visible actions follow Figma.
The [requirements](REQUIREMENTS.md) describe those screens in text.
The [API guide](API.md) records the supplied backend separately. Backend quantity and date limits remain in the docs at the user's request.
The [frontend plan](FRONTEND-PLAN.md#confirmed-decisions) records the technical foundation and additional feedback/calendar decisions confirmed on November 18, 2026.
These decisions supplement Figma without changing the saved design evidence. The team split remains a proposal. The 18 course PDFs remain reference files.

## Saved design updates

- Registration has a Name input beside Email.
- Admin equipment lists and details have no Rent controls. The admin rental creation frame was removed.
- The member creation route is `/equipments/{id}/rent`, with the slash before `{id}`.
- Member creation, member editing, and admin editing each show one date-range calendar input.
- Each rental form shows `rentalRate × days`, with both selected dates counted. Same-day rental counts as one day.
- Guests have separate equipment list and detail variants. The list has linked names and no request buttons. The detail has Login to request, which opens Login.
- Guest navigation has Home, Equipment, Register, and Login. Home keeps its minimal content and has no catalog.
- The behavior note records always-Home account navigation with no saved destination, record destinations, current-rate pricing, final rounding, Member/Admin signup, and desktop-only scope.
- Quantity and date limits remain outside the Figma frames.

## Frame inventory

Braces identify an item in the Figma labels. The Next.js proposal uses `[id]` for the same URL value.
Guest, member, and admin variants share browser paths. They do not require a role URL prefix.

| # | Figma frame label | Visible purpose |
|---|---|---|
| 1 | `/ (unauthorized)` | Home heading and guest navigation |
| 2 | `/ (member)` | Home heading and member navigation |
| 3 | `/ (admin)` | Home heading, admin indicator, and signed-in navigation |
| 4 | `/register` | Name, email, telephone, role, password, confirmation, and Register |
| 5 | `/login` | Email, password, and Login |
| 6 | `/equipments` | Member equipment cards, linked names, and Rent |
| 7 | `/equipments/{id}` | One equipment item and Rent |
| 8 | `/equipments/{id}/rent` | Fixed equipment summary, quantity, date range, cost, and Rent |
| 9 | `/rentals` | My rental requests with View, Edit, and Delete |
| 10 | `/rentals/{id}` | One rental request with Edit and Delete |
| 11 | `/rentals/{id}/edit` | Fixed equipment summary, quantity, date range, cost, and Save |
| 12 | `/equipments (admin's variant)` | Add equipment and per-item View, Edit, and Delete |
| 13 | `/equipments/{id} (admin's variant)` | One equipment item with Edit and Delete |
| 14 | `/equipments/new (admin only)` | Equipment fields and Add |
| 15 | `/equipments/{id}/edit (admin only)` | Equipment fields and Save |
| 16 | `/rentals (admin's variant)` | Rental requests with owner, View, Edit, and Delete |
| 17 | `/rentals/{id} (admin's variant)` | One rental request with owner, Edit, and Delete |
| 18 | `/rentals/{id}/edit (admin's variant)` | Owner, fixed equipment summary, quantity, date range, cost, and Save |
| 19 | `/equipments (unauthorized)` | Guest cards and linked names, without Rent or Login to request buttons |
| 20 | `/equipments/{id} (unauthorized)` | One equipment item with Login to request instead of Rent |

The separate text layer “Agreed behavior — 16 Nov 2026” is a design note, not an application screen.
It specifies current equipment rates for all totals, inclusive days without a quantity multiplier, and final rounding to two decimals with halfway values rounded upward.
It also specifies Home after login, registration, and logout without a saved item or destination; record details after creation or editing; and the corresponding list after deletion.
Member and Admin signup remain available for the desktop class demo.

The guest navigation Equipment link targets the guest catalog. The six guest equipment name links target the guest detail, and Login to request targets Login.
These interaction destinations were inspected in the editor. The review does not establish that every prototype link works or that the full application flow is implemented.
Do not infer behavior for states or layouts that the frames do not show.

## Captured evidence

The overview, registration, guest screens, and behavior note were captured after the November 16 reload.
The unchanged member/admin captures remain from the November 15 review. These are design evidence, not screenshots of an implemented application.

| Capture | What to inspect |
|---|---|
| [Overview](figma/overview.jpg) | Twenty screen frames, the behavior note, and no admin rental creation frame |
| [Registration](figma/registration.jpg) | Name and Email inputs |
| [Guest Home](figma/guest-home.jpg) | Minimal Home content and Equipment navigation |
| [Guest equipment list](figma/guest-equipment-list.jpg) | Linked names without request buttons |
| [Guest equipment detail](figma/guest-equipment-detail.jpg) | Login to request instead of Rent |
| [Behavior note](figma/design-decisions.jpg) | Agreed navigation, current-rate cost, rounding, and desktop scope |
| [Member rental creation](figma/member-rental-create.jpg) | Single date-range input, cost formula, and Rent |
| [Member rental editing](figma/member-rental-edit.jpg) | Single date-range input, cost formula, and Save |
| [Admin equipment list](figma/admin-equipment-list.jpg) | Add, View, Edit, and Delete without Rent |
| [Admin equipment detail](figma/admin-equipment-detail.jpg) | Edit and Delete without Rent |
| [Admin rental editing](figma/admin-rental-edit.jpg) | Owner, single date-range input, cost formula, and Save |
