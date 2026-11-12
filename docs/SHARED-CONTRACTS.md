# Shared contracts

These TypeScript contracts describe the planned frontend data and component interfaces. The field shapes follow the pinned backend at commit [`be18df9`](https://github.com/SWDevPrac2-69-1/PJ02-EquipmentRent/tree/be18df9967be7e0a742b5a5ae25f07966dc4e1d4).

The backend sends MongoDB IDs as strings in JSON. Login and registration responses use `id`. `/auth/me`, equipment records, and rental records use `_id`. Keep request data separate from read data. Rental input sends an ID in the field named `equipment`. Date inputs use `YYYY-MM-DD`. Dates returned by the API are ISO date-time strings.

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

export interface Equipment {
  _id: string;
  name: string;
  category: string;
  description: string;
  quantity: number;
  rentalRate: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type EquipmentInput = Pick<
  Equipment,
  "name" | "category" | "description" | "quantity" | "rentalRate"
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
```

`Rental.equipment` uses `RentalEquipment`, and `Rental.user` uses `RentalUser`. Either reference can be `null` if its record no longer exists. Successful rental reads populate both references. Login and registration return a safe user object with `id` and no `tel`. `/auth/me` returns a Mongoose user with `_id`, `tel`, and `createdAt`. Keep `AuthUser` as the normalized frontend state shape and map `_id` to `id` when restoring the session. `Equipment` and `Rental` have `createdAt` and `updatedAt` because their Mongoose schemas enable timestamps.

An update omits unchanged fields. The equipment key remains `equipment`, not `equipmentID`. Equipment and rental update functions take partial inputs. Reusable forms submit complete values.

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

The route paths are listed in [API.md](API.md). Protected calls receive the token and send `Authorization: Bearer <token>`. The backend returns `{ success: false, error: string }`. Normalize this response to `ApiError` with the HTTP status and readable message. A 401 from a protected call clears the context and session storage. A login 401 remains an account form error. A 403 stays an access error. Backend authorization remains the authority. Hiding a control is not access control.

## Auth context and components

```tsx
import type { ReactNode } from "react";

export interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  loading: boolean; // token restoration and /auth/me are still running
  restoreError: string | null;
  retrySession(): Promise<void>;
  login(input: LoginInput): Promise<void>;
  register(input: RegisterInput): Promise<void>;
  logout(): Promise<void>;
}

export interface AccessGuardProps {
  roles: Role[];
  children: ReactNode;
}

export interface AuthProviderProps {
  children: ReactNode;
}

export interface AppNavProps {
  user: AuthUser | null;
  onLogout(): Promise<void>;
}

export interface AccountTabsProps {
  returnTo: string; // accepted safe internal path
}

export interface LoginFormProps {
  onSubmit(input: LoginInput): Promise<void>;
  pending: boolean;
  error: string | null;
}

export interface RegisterFormProps {
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
}

export interface EquipmentDetailProps {
  item: Equipment;
  requestHref?: string; // omit for admins because only members create rentals
}

export interface RentalFormProps {
  mode: "create" | "edit";
  equipmentChoices: Equipment[];
  initialValues?: RentalInput;
  onSubmit(values: RentalInput): Promise<void>;
  pending: boolean;
  error: string | null;
}

export interface RentalDetailsProps {
  rental: Rental;
  mode: "member" | "admin";
}

export interface EquipmentListProps {
  items: Equipment[];
  onEdit?: (item: Equipment) => void;
  onDelete?: (item: Equipment) => Promise<void>;
}

export interface RentalListProps {
  rentals: Rental[];
  mode: "member" | "admin";
  onView?: (rental: Rental) => void;
  onEdit?: (rental: Rental) => void;
  onDelete?: (rental: Rental) => Promise<void>;
}

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

Pages own loading, API calls, navigation, refresh after a successful change, and async error display through page feedback. Forms own their field state and report complete values. Keep values visible after a failure. `AccessGuard` first handles session restoration. While `loading` is true, show loading feedback. If `restoreError` exists, show its message and call `retrySession` from the retry action. Do not show protected content during either state. Then render children for an allowed signed-in role. For no user, show the sign-in path. For a signed-in user with a disallowed role, show an access message. Member rental screens pass `roles={["member"]}`. The admin layout passes `roles={["admin"]}`. If `/auth/me` returns 401, clear the token and user. If it fails because of a network error, stop loading, keep the token, and show a retry action while protected content stays behind the guard. Any protected request that returns 401 clears the session. Login 401 displays a credential error in the account form. It does not redirect. Logout always clears local token and user state, including when its request fails. The API has no approval state, rental status, or pagination contract, so these interfaces add none.

For rental edits, map `Rental.equipment?._id` to the form equipment ID, or use an empty string when the reference is missing. Map `startDate` and `returnDate` with `.slice(0, 10)` to preserve the UTC calendar date. Do not convert dates through the local timezone. Load active equipment choices. Keep a missing or inactive current equipment label as separate historic display data. Leave the selection empty and tell the user to choose active equipment. Disable save until an active choice is selected. If there are no active choices, explain that the rental cannot be edited now. Viewing and deleting remain available. Revalidate dates, including a past start date, and quantity against the selected equipment. Submit complete values for the backend's merged-value validation.
