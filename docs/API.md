# Backend API

An API is the set of requests that the frontend sends to the backend.
Use the [supplied backend](https://github.com/SWDevPrac2-69-1/PJ02-EquipmentRent).
This contract comes from commit [`be18df9`](https://github.com/SWDevPrac2-69-1/PJ02-EquipmentRent/tree/be18df9967be7e0a742b5a5ae25f07966dc4e1d4).

This is a backend reference, not the source for product screens. The updated [Figma design](FIGMA.md) defines screens and product behavior.
The user asked to retain backend quantity and date limits in the docs without adding them to Figma.

## Connection

The local origin is `http://localhost:5000`. API docs are at `/api-docs`.
All routes below start with `/api/v1`.
Protected requests use `Authorization: Bearer <token>`. The backend does not read auth from the cookie.

Configure backend `MONGO_URI`, `JWT_SECRET`, and `FRONTEND_URL` before integration.
The supplied `MONGO_URI` is blank. Keep secrets out of the frontend and Git.
Production CORS allows `FRONTEND_URL`. Local development allows `http://localhost:3000`.
CORS is the browser rule that controls requests between origins.

## Routes

| Method and path | Access | Input or result |
|---|---|---|
| `POST /auth/register` | Public | Send name, email, tel, password and role |
| `POST /auth/login` | Public | Send email and password |
| `GET /auth/me` | Signed in | Read the current user |
| `GET /auth/logout` | Signed in | Clear the response cookie |
| `GET /equipment` | Public | Read active equipment, sorted by name |
| `GET /equipment/:id` | Public | Read one active item |
| `POST /equipment` | Admin | Add equipment |
| `PUT /equipment/:id` | Admin | Update supplied fields of an active item |
| `DELETE /equipment/:id` | Admin | Hide equipment with `isActive: false` |
| `GET /rentals` | Signed in | Members read own requests. Admins read all |
| `GET /rentals/:id` | Owner or admin | Read one request |
| `POST /rentals` | Member | Create a request |
| `PUT /rentals/:id` | Owner or admin | Update supplied rental fields |
| `DELETE /rentals/:id` | Owner or admin | Permanently delete a request |

## Fields

Registration uses `{ name, email, tel, password, role }`.
Role defaults to `member`. This backend also accepts public registration with `role: "admin"`.
Public admin registration does not provide safe admin account control for public use.

Equipment uses `{ name, category, description, quantity, rentalRate }`.
Name is unique. Quantity is a nonnegative integer. Rental rate is nonnegative.

Rental input uses `{ equipment, quantity, startDate, returnDate }`.
`equipment` is a MongoDB ID. Dates use `YYYY-MM-DD`.
The backend sets the owner from the token. Updates cannot change the owner.
Omitted update fields keep their current values.

Rental reads include equipment and user objects. Login and registration use `data.id` for the user ID.
`GET /auth/me` returns `data._id`. The frontend maps it to its normalized user `id`.
Equipment and rental records use `_id`. Keep these differences in the shared TypeScript types.

## Responses

Success uses `{ success: true, data }`. Lists also include `count`.
Registration and creation return HTTP 201. Other successful requests return HTTP 200.
Login and registration return the token in `data.token`.

Errors use `{ success: false, error }`.
Handle HTTP 400 for invalid input, including missing email or password. Handle HTTP 401 for invalid credentials and for protected requests with a missing or invalid token. Handle HTTP 403 for denied access and HTTP 404 for missing records.
Some database errors return HTTP 500. Keep form values and show a readable error.
Logout does not revoke existing tokens. Clear the frontend token and user too.

## Rental rules

- Quantity is an integer from 1 to 3 and cannot exceed available quantity.
- Start is today or later. The backend uses UTC for today.
- Return is on or after start, with at most seven elapsed days.
- Same-day rentals and dates exactly seven days apart pass.
- Each request is tested against stock on its own. Requests do not reduce stock.
- Overlapping requests can total more than available stock.

Deleted equipment leaves public lists and cannot be newly rented. Existing rentals remain readable and deletable.
Rental updates merge supplied fields with stored values, then validate the merged rental.
A past start date fails validation even when it is unchanged. An inactive equipment reference also fails validation.
The API can accept a different active equipment ID during an update. Figma's fixed equipment form does not expose that capability.
Active equipment with zero quantity remains readable and listed. Rental creation and updates still require a quantity of at least one.
If equipment quantity falls below a stored request's quantity, even an unrelated edit fails unless the requested quantity is reduced.
Zero quantity leaves no valid rental quantity. Admins have no exception to these validation rules.
The backend has no payment, approval, reservation, or rental-status flow.

## Figma integration

The browser route `/equipments` maps to the singular API route `/api/v1/equipment`.
Guest, member, and admin equipment screen variants share browser paths. Guests use the public equipment reads. The API enforces roles and ownership for protected operations.
Rental creation is member-only. The Figma admin creation frame and Rent controls were removed to match that rule.

Registration now includes Name, Email, Tel, Role, Password, and Confirm Password in Figma.
The form compares the passwords and sends `{ name, email, tel, password, role }`. It does not send password confirmation.
One visible calendar input selects a range and maps it to the existing `startDate` and `returnDate` fields.
This does not require a new API range field.

The agreed cost formula is `rentalRate × days`, counting both calendar dates. Same-day rental counts as one day.
Quantity is not a multiplier. The backend model and controller return no cost field and perform no cost calculation.
The proposed frontend derives the displayed total without changing the raw API contract.
The backend allows seven elapsed days, which contains eight billable calendar days under this inclusive cost rule.

The November 16 interview settled these integration choices:

- Displayed totals always use the current equipment rate. A rate change also changes older request totals, as recorded in the [decision](adr/0001-calculate-cost-from-current-equipment-rate.md).
- Round the final total once to two decimal places, with halfway values rounded upward. This is recorded in Figma's behavior note.
- Keep the backend's availability validation unchanged. Inactive equipment and zero stock can block updates. Reduced stock can require a lower request quantity.
- Keep the fixed equipment form. Do not add availability-specific frontend controls or an equipment selector.
- A past start date requires a valid new date range before an update can pass.
- Keep Member and Admin registration for the class demo.

Use normal form error feedback when the API rejects an update. The exact feedback presentation remains a design detail.

## Code references

Paths below refer to the pinned backend commit:

- `controllers/auth.js`, `middleware/auth.js`, `models/User.js`: login, roles and tokens.
- `controllers/equipment.js`, `models/Equipment.js`: fields and equipment deletion.
- `controllers/rentals.js`, `models/Rental.js`: ownership, dates, quantity, rental deletion, and the absence of stored cost.
- `routes/auth.js`, `routes/equipment.js`, `routes/rentals.js`: route access.
- `server.js`, `config/config.env`: origin, port and environment values.

Read the contract again if the backend revision changes.
