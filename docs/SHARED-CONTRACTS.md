# Shared contracts

These TypeScript contracts are a technical proposal. Screens and product behavior follow the updated [Figma design](FIGMA.md) and the [November 18 decisions](FRONTEND-PLAN.md#confirmed-decisions).
Raw API field shapes remain a separate reference from the pinned backend at commit [`be18df9`](https://github.com/SWDevPrac2-69-1/PJ02-EquipmentRent/tree/be18df9967be7e0a742b5a5ae25f07966dc4e1d4).

The backend sends MongoDB IDs as strings in JSON. Login and registration responses use `id`. `/auth/me`, equipment records, and rental records use `_id`. Keep request data separate from read data. Rental input sends an ID in the field named `equipment`. Date inputs use `YYYY-MM-DD`. Dates returned by the API are ISO date-time strings.

## Implemented interface review

The continuation uses `frontend/interface.ts` and `frontend/src/libs/api.ts`.
The code was compared with the pinned backend controllers and exercised against
its real routes and a disposable MongoDB database. The declarations below retain
the original proposal; these are the intentional implementation differences:

- API helpers unwrap `data`: list calls return `Equipment[]` / `Rental[]`, and
  record calls return the record. Pages do not read a second `.data` property.
- List `count` is not exposed because the UI renders the full returned array.
- `imageUrl` may be a direct image or Google Drive file-sharing URL. The UI
  resolves Drive links for display but keeps the original stored value.
- Equipment reads/writes now include optional `imageUrl`; omitted updates preserve
  the image, and an empty string clears it. Public catalog query parameters
  (`q`, `category`) are handled on the Next.js page, not by the Express API.
- Equipment writes accept `EquipmentInput` or `EquipmentUpdate`; rental updates
  accept `RentalUpdate`. Shared request fields keep the backend's names.
- NextAuth restores its JWT session directly. It does not currently call
  `/auth/me`, so there is no implemented `authApi.me` or `_id` mapping path.
- Equipment reads are public and omit bearer tokens. Catalog/detail reads now
  run in Server Components; small delete controls use the browser session.
  Protected HTTP 401 responses end the NextAuth session and navigate Home;
  login 401 remains inline.
- `EquipmentForm` handles both Add and Save. `RentalForm` serves member creation
  and both roles' edits; the edit page supplies the renter label for both roles.
- `DeleteRecordButton` shares a native modal dialog across equipment and rental
  deletion. Rental list pages remove successful deletions from their local arrays.
  Equipment lists refresh their Server Component after deletion; detail pages
  navigate to the list.

Both teammates should still review these interfaces before merging. Automated
verification is recorded in the [handoff](CONTRIBUTION-HANDOFF.md#continuation-checkpoint).

## Domain and request types

```ts
export type Role = "member" | "admin";

// Normalized user shape for frontend state. /auth/me needs an _id-to-id map.
export interface User {
  id: string;
  name: string;
  email: string;
  tel?: string;
  role: Role;
}

// Rental reads populate user as a Mongo document, whose identifier is _id.
export interface RentalUser {
  _id: string;
  name: string;
  email: string;
  tel: string;
  role: Role;
}

export type AuthUser = User;

// Raw /auth/me data: Mongoose serializes _id (not id) and includes timestamps.
export interface AuthMeUser {
  _id: string;
  name: string;
  email: string;
  tel: string;
  role: Role;
  createdAt: string;
  __v: number;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  tel: string;
  password: string;
  role: Role;
}

// UI-only confirmation. Remove confirmPassword before calling authApi.register.
export interface RegisterFormValues extends RegisterInput {
  confirmPassword: string;
}

export interface Equipment {
  _id: string;
  name: string;
  category: string;
  description: string;
  quantity: number;
  rentalRate: number;
  imageUrl?: string; // optional direct HTTP(S) image URL; empty means no image
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type EquipmentInput = Pick<
  Equipment,
  "name" | "category" | "description" | "quantity" | "rentalRate" | "imageUrl"
>;
export type EquipmentUpdate = Partial<EquipmentInput>;

// Rental reads select these equipment fields plus Mongo's default _id.
export interface RentalEquipment {
  _id: string;
  name: string;
  category: string;
  description: string;
  quantity: number;
  rentalRate: number;
  imageUrl?: string; // optional direct HTTP(S) image URL; empty means no image
  isActive: boolean;
}

export interface Rental {
  _id: string;
  equipment: RentalEquipment | null;
  user: RentalUser | null;
  quantity: number;
  startDate: string; // ISO date-time in the response
  returnDate: string; // ISO date-time in the response
  createdAt: string;
  updatedAt: string;
}

export interface RentalInput {
  equipment: string; // equipment Mongo ID, despite the API field name
  quantity: number;
  startDate: string; // YYYY-MM-DD
  returnDate: string; // YYYY-MM-DD
}

export type RentalUpdate = Partial<RentalInput>;

// The page binds equipment from the URL or existing rental. The form cannot reselect it.
export type RentalFormInput = Omit<RentalInput, "equipment">;

// One calendar input can contain an incomplete range while the user selects dates.
export interface DateRangeValue {
  startDate: string | null; // YYYY-MM-DD when selected
  returnDate: string | null; // YYYY-MM-DD when selected
}

// Derived frontend display data. These fields are absent from the backend Rental.
export interface RentalCost {
  days: number;
  total: number;
  currency: "THB";
}
```

`Rental.equipment` uses `RentalEquipment`, and `Rental.user` uses `RentalUser`. Either reference can be `null` if its record no longer exists. Successful rental reads populate both references. Login and registration return a safe user object with `id` and no `tel`. `/auth/me` returns a Mongoose user with `_id`, `tel`, and `createdAt`. Keep `AuthUser` as the normalized frontend state shape and map `_id` to `id` when restoring the session. `Equipment` and `Rental` have `createdAt` and `updatedAt` because their Mongoose schemas enable timestamps.

An update omits unchanged fields. The equipment key remains `equipment`, not `equipmentID`. Equipment and rental update functions take partial inputs. Forms submit complete editable values.
The rental page binds the fixed equipment ID and maps one date-range input to `startDate` and `returnDate`.

## API response and function shapes

```ts
export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiList<T> extends ApiSuccess<T[]> {
  count: number;
}

export interface ApiFailure {
  success: false;
  error: string;
}

// client.ts converts backend failures into this thrown error shape.
export declare class ApiError extends Error {
  readonly status: number;
  constructor(message: string, status: number);
}

export interface AuthResponse {
  id: string;
  name: string;
  email: string;
  role: Role;
  token: string;
}

export declare const authApi: {
  login(input: LoginInput): Promise<AuthResponse>;
  register(input: RegisterInput): Promise<AuthResponse>;
  me(token: string): Promise<AuthMeUser>;
  logout(token: string): Promise<void>;
};

export declare const equipmentApi: {
  list(token?: string): Promise<ApiList<Equipment>>;
  get(id: string, token?: string): Promise<ApiSuccess<Equipment>>;
  create(input: EquipmentInput, token: string): Promise<ApiSuccess<Equipment>>;
  update(id: string, input: EquipmentUpdate, token: string): Promise<ApiSuccess<Equipment>>;
  remove(id: string, token: string): Promise<void>;
};

export declare const rentalsApi: {
  list(token: string): Promise<ApiList<Rental>>;
  get(id: string, token: string): Promise<ApiSuccess<Rental>>;
  create(input: RentalInput, token: string): Promise<ApiSuccess<Rental>>;
  update(id: string, input: RentalUpdate, token: string): Promise<ApiSuccess<Rental>>;
  remove(id: string, token: string): Promise<void>;
};
```

The route paths are listed in [API.md](API.md). Protected calls receive the token and send `Authorization: Bearer <token>`. The backend returns `{ success: false, error: string }`. Normalize this response to `ApiError` with the HTTP status and readable message. A 401 from a protected call ends the NextAuth session. A login 401 remains an account form error. A 403 stays an access error. Backend authorization remains the authority. Hiding a control is not access control.

## NextAuth integration and component proposals

Use NextAuth session APIs and `NextAuthProvider` instead of a custom authentication context.
Extend NextAuth session and JWT types explicitly for the backend token, user ID, and role during implementation.
The API helper declarations describe backend calls, not a separate authentication store.
These interfaces support the Figma routes and fields. They do not define additional product screens.
`RegisterFormValues` keeps password confirmation separate from `RegisterInput`.
`DateRangeValue` describes one visible calendar input, not two visible date inputs.

```tsx
import type { ReactNode } from "react";

export interface AccessGuardProps {
  roles: Role[];
  children: ReactNode;
}

export interface AppNavProps {
  user: AuthUser | null;
  onLogout(): Promise<void>;
}

export interface LoginFormProps {
  onSubmit(input: LoginInput): Promise<void>;
  pending: boolean;
  error: string | null;
}

export interface RegisterFormProps {
  // The form compares passwords and omits confirmPassword from this value.
  onSubmit(input: RegisterInput): Promise<void>;
  pending: boolean;
  error: string | null;
}

export interface EquipmentFormProps {
  mode: "create" | "edit";
  initialValues?: EquipmentInput;
  onSubmit(values: EquipmentInput): Promise<void>;
  pending: boolean;
  error: string | null;
}

export interface EquipmentCardProps {
  item: Equipment;
  detailsHref: string;
  requestHref?: string; // member catalog only; guest cards omit it
}

export interface EquipmentDetailProps {
  item: Equipment;
  mode: "guest" | "member" | "admin";
  loginHref?: string; // guest variant: /login, without a return destination
  requestHref?: string; // member variant only
  onEdit?: (item: Equipment) => void;
  onDelete?: (item: Equipment) => Promise<void>;
}

export interface DateRangeInputProps {
  value: DateRangeValue;
  onChange(value: DateRangeValue): void;
  disabled?: boolean;
  error?: string | null;
}

export interface RentalFormProps {
  mode: "create" | "edit";
  equipment: RentalEquipment | null; // fixed summary, never a list of choices
  ownerLabel?: string; // renter identity for both roles
  initialValues?: RentalFormInput;
  onSubmit(values: RentalFormInput): Promise<void>;
  pending: boolean;
  error: string | null;
}

export interface RentalDetailsProps {
  rental: Rental;
  cost: RentalCost | null;
  mode: "member" | "admin";
  onEdit?: (rental: Rental) => void;
  onDelete?: (rental: Rental) => Promise<void>;
}

export interface EquipmentListProps {
  items: Equipment[];
  mode: "guest" | "member" | "admin";
  onView(item: Equipment): void;
  onRent?: (item: Equipment) => void; // member variant only
  onAdd?: () => void; // admin variant only
  onEdit?: (item: Equipment) => void;
  onDelete?: (item: Equipment) => Promise<void>;
}

export interface RentalListProps {
  rentals: Rental[];
  mode: "member" | "admin";
  getCost(rental: Rental): RentalCost | null;
  onView(rental: Rental): void;
  onEdit(rental: Rental): void;
  onDelete(rental: Rental): Promise<void>;
}

// Cancel/Delete confirmation was confirmed on November 18, 2026.
export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  pending: boolean;
  onConfirm(): Promise<void>;
  onCancel(): void;
}

export interface FeedbackProps {
  loading?: boolean;
  error?: string | null;
  success?: string | null;
}
```

`AppNav` links to Home, Equipment, Register, and Login for guests. Signed-in variants link to Home, Equipment, Rental, and Logout.
The admin variant also displays its role indicator. Admin equipment components never render Rent controls.
Guest equipment cards omit request controls. Guest details show Login to request and open `/login` without saving a destination.
Login, registration, and logout always navigate to Home. The auth interfaces need no return-path state.
Only members use `RentalForm` in create mode. Both roles use edit mode for requests permitted by the backend.
Rental View actions navigate to `/rentals/[id]`, rather than expanding details inside the list.

Pages own API calls, navigation, and refresh after a successful change. Creation and editing open the record detail; deletion returns to its list.
Forms own field state. Preserve entered values after an API failure.
Show inline loading and error messages. Disable submission while saving. Confirm deletion with Cancel and Delete.
The single range input opens a one-month popup with previous/next controls and start-then-end selection.
A complete date range supplies `RentalFormInput.startDate` and `RentalFormInput.returnDate`.
Do not submit an incomplete range. The page adds the fixed equipment ID when it builds `RentalInput`.

## Cost calculation and integration limits

The proposed `libs/rental-cost.ts` calculates `days` from calendar dates, with both dates included.
For valid dates, `days = (returnDateUTC - startDateUTC) / 86400000 + 1`. Calculate `rentalRate × days`, then round that final total once to two decimals with halfway values rounded upward.
Use UTC calendar dates for this calculation, not local elapsed hours. Quantity is not a multiplier.
The allowed range is at most seven inclusive days: June 10–16 is valid and June 10–17 is rejected on creation and editing. The frontend calendar and local backend enforce the same limit.
Return no cost for an incomplete or invalid range, or a missing equipment rate.
A rate of 100 produces 100 THB for June 10–10 and 300 THB for June 10–12.

`RentalCost` is display data. Do not add it to the raw `Rental` type or send it in a rental API request.
The backend does not store a cost or a historical rental rate. All displayed totals use the current equipment rate, including older requests.
The confirmed rounding plan rounds the final total once to two decimal places, with halfway values rounded upward.
The display adapter uses the rate in the equipment response. Rate changes also change displayed totals for older requests.
The [current-rate decision](adr/0001-calculate-cost-from-current-equipment-rate.md) records this trade-off.

For edits, use the existing rental's equipment ID and date strings. Preserve response calendar dates with `.slice(0, 10)`.
A missing or inactive item cannot be replaced through the Figma form because it has no equipment selector.
Keep backend availability validation unchanged and display rejections through normal form error feedback.
Do not add availability-specific frontend controls. The backend rejects past start dates during updates, so saving requires a valid new date range.

The confirmed authentication and feedback decisions are recorded in [FRONTEND-PLAN.md](FRONTEND-PLAN.md).
A protected HTTP 401 clears the local session. A login HTTP 401 remains a form error. HTTP 403 remains an access error.
The API has no approval state, rental status, or pagination contract. These interfaces add none.
