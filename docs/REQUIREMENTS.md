# System requirements

The updated [Figma design](https://www.figma.com/design/llQS6sjdaGY3OpBfXf7NVh/SW-DEV-PRAC-2?node-id=0-1) is the only source for screens and product behavior.
The [Figma guide](FIGMA.md) records the reviewed frames and design evidence.
The backend limits below are separate integration constraints retained at the user's request. Course PDFs do not define product requirements.
This page describes the November 16 saved Figma revision, including its agreed behavior note. The [frontend plan](FRONTEND-PLAN.md#confirmed-decisions) separates confirmed scope from technical proposals.

## Home and accounts

- The home page has guest, member, and admin variants. It displays “Equipment Rental System,” not the equipment catalog.
- Guest navigation has Home, Equipment, Register, and Login links.
- Member navigation has Home, Equipment, Rental, and Logout links. Admin navigation also displays “You are admin.”
- Registration has Name, Email, Tel, Role, Password, and Confirm Password fields, plus a Register action.
- Login has Email and Password fields, plus a Login action.
- Registration and login have separate pages at `/register` and `/login`.
- Registration keeps Member and Admin role choices for the class demo.
- Login, registration, and logout always go to Home. Remember no selected item or destination, including entry through Login to request.

## Equipment

- Guests browse a separate catalog at `/equipments`. Its cards show equipment information and linked names, with neither Rent nor Login to request buttons.
- The guest detail at `/equipments/{id}` has Login to request instead of Rent. That action opens `/login` without a return destination. After signing in, the member opens Equipment and selects the item again.
- The member catalog at `/equipments` displays cards with name, description, category, quantity, rental rate, and a Rent action.
- An equipment name links to `/equipments/{id}`. That page displays one item selected by its URL ID.
- Equipment details display the name, description, category, and rental rate. The member variant has a Rent action.
- The admin catalog uses the same `/equipments` path. It has Add, View, Edit, and Delete actions.
- The admin detail variant has Edit and Delete actions. Admins cannot create rental requests and have no Rent controls.
- Admin equipment forms have Name, Category, Description, Quantity, and Rental Rate fields.
- Admins add equipment at `/equipments/new` and edit it at `/equipments/{id}/edit`.

## Rental requests

- Members create a request at `/equipments/{id}/rent` for the equipment selected by the URL ID.
- The form displays the equipment summary, quantity, one date-range calendar input, total cost in THB, and a Rent action.
- One calendar input selects both start and return dates. It replaces the earlier “Calendar Select” block.
- Member and admin edit forms use the same range input and cost rule, with a Save action.
- Rental forms display a fixed equipment item. Figma does not show an equipment selector on creation or editing.
- Members view their requests at `/rentals`. Each request has View, Edit, and Delete actions.
- Rental details have a dedicated `/rentals/{id}` page. Editing has a dedicated `/rentals/{id}/edit` page.
- Lists and details show equipment information, quantity, start date, return date, and total cost.
- The admin variants use the same rental paths and also display the request owner as “From {owner}.”
- Admins manage rental requests through View, Edit, and Delete actions. There is no admin rental creation frame.

## Cost

Cost is `rentalRate × days`. Count both selected calendar dates. Quantity is not a multiplier in this agreed formula.
June 10–12 counts as three days. June 10–10 counts as one day.
For a rental rate of 100 THB, those totals are 300 THB and 100 THB.

The backend has no cost field. The planned frontend calculates the displayed total from the rental rate and selected dates.
Use the equipment item's current rental rate for every displayed total, including older requests. A rate change also changes older displayed totals; requests do not keep the original rate.
Round the final total once to two decimal places, with halfway values rounded upward. For example, 100.005 becomes 100.01.
The separate API facts are described in [API.md](API.md#figma-integration).

## Destinations and display scope

Successful creation and editing open that record's detail page. Deletion returns to its corresponding list.
The class demo is desktop only. Mobile layouts are outside this scope.

## Backend limits retained in docs

These constraints come from the pinned [backend contract](API.md), not from Figma. Keep them in documentation and implementation validation only.

- Rental quantity is a whole number from one to three and cannot exceed the selected equipment quantity.
- The start date is today or later. The backend uses UTC for today.
- The return date is on or after the start date and at most seven elapsed days later.
- Same-day rentals and dates exactly seven days apart pass backend validation.
- Each request uses the available quantity independently. Requests do not reserve or reduce stock.
- Members read, edit, and delete their own requests. Admins read, edit, and delete all requests.

The backend duration limit and the cost day count use different rules.
A range seven elapsed days apart contains eight billable calendar days under the agreed inclusive formula.
These quantity and date limits are intentionally absent from the Figma frames.

## Open design details

Figma does not define deletion confirmation or loading, empty, error, and success states.
It establishes one date-range calendar input but does not define the detailed popup.
These presentation details were not agreed during the interview and are not added to this design update.
The [frontend plan](FRONTEND-PLAN.md) separates technical proposals from these open design details.
The [API guide](API.md#figma-integration) records cases where the fixed equipment form cannot satisfy backend validation.
