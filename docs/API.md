# Backend API

An API is the set of requests that the frontend sends to the backend.
Use the [supplied backend](https://github.com/SWDevPrac2-69-1/PJ02-EquipmentRent).
This contract comes from commit [`be18df9`](https://github.com/SWDevPrac2-69-1/PJ02-EquipmentRent/tree/be18df9967be7e0a742b5a5ae25f07966dc4e1d4).
It is a code review, not a runtime test.

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
Use this fact when preparing the class demo. It does not provide safe admin account control for public use.

Equipment uses `{ name, category, description, quantity, rentalRate }`.
Name is unique. Quantity is a nonnegative integer. Rental rate is nonnegative.

Rental input uses `{ equipment, quantity, startDate, returnDate }`.
`equipment` is a MongoDB ID. Dates use `YYYY-MM-DD`.
The backend sets the owner from the token. Updates cannot change the owner.
Omitted update fields keep their current values.

Rental reads include equipment and user objects. Login and registration use `data.id` for the user ID.
`GET /auth/me` returns `data._id`; the frontend maps it to its normalized user `id`.
Equipment and rental records use `_id`. Keep these differences in the shared TypeScript types.

## Responses

Success uses `{ success: true, data }`. Lists also include `count`.
Registration and creation return HTTP 201. Other successful requests return HTTP 200.
Login and registration return the token in `data.token`.

Errors use `{ success: false, error }`.
Handle HTTP 400 for invalid input, 401 for missing or invalid login, 403 for denied access, and 404 for missing records.
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
To edit a rental for deleted equipment, select active equipment.
The backend has no payment, approval, reservation, or rental-status flow.

## Code references

Paths below refer to the pinned backend commit:

- `controllers/auth.js`, `middleware/auth.js`, `models/User.js`: login, roles and tokens.
- `controllers/equipment.js`, `models/Equipment.js`: fields and equipment deletion.
- `controllers/rentals.js`: ownership, dates, quantity and rental deletion.
- `routes/auth.js`, `routes/equipment.js`, `routes/rentals.js`: route access.
- `server.js`, `config/config.env`: origin, port and environment values.

Read the contract again if the backend revision changes.
