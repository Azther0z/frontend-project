# Shared contracts

Proposed TypeScript contracts for Poom to review before implementation. The
field shapes below follow the pinned backend; the app and API files remain
uncreated, and these component boundaries are proposals pending agreement.

The backend uses MongoDB IDs as strings in JSON. Login and registration responses use `id`; `/auth/me` uses `_id`;
equipment and rental records use `_id`. Keep request data separate from read
data. Rental input sends an ID in the field named `equipment`. Date inputs are
`YYYY-MM-DD`; dates returned by the API are ISO date-time strings.

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

`Rental.equipment` and `Rental.user` may be `null` if a referenced record no
longer exists. The backend's successful rental reads populate both references.
Login and registration return a safe user object with `id` and no `tel`;
`/auth/me` returns a Mongoose user with `_id`, `tel`, and `createdAt`. Keep
`AuthUser` as the normalized frontend state shape and map `_id` to `id` when
restoring the session. `Equipment` and `Rental` have `createdAt` and `updatedAt`
because their Mongoose schemas enable timestamps.
An update omits unchanged fields; the equipment key remains `equipment`, not
`equipmentID`. Equipment and rental update functions take partial inputs, while
the reusable forms submit complete values.

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

These are proposed return-value signatures; the route paths are listed in [API.md](API.md).
Protected calls receive the token and send `Authorization: Bearer <token>`.
The backend returns `{ success: false, error: string }`; normalize it to
`ApiError` with the HTTP status and readable message. A 401 clears the context
and session storage. A 403 stays an access error. Backend authorization remains
the authority; hiding a control is not access control.

## Auth context and components

```tsx
import type { ReactNode } from "react";

export interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  loading: boolean; // token restoration and /auth/me are still running
  login(input: LoginInput): Promise<void>;
  register(input: RegisterInput): Promise<void>;
  logout(): Promise<void>;
}

export interface AccessGuardProps {
  roles: Role[];
  children: ReactNode;
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

export interface RentalFormProps {
  mode: "create" | "edit";
  equipmentChoices: Equipment[];
  initialValues?: RentalInput;
  onSubmit(values: RentalInput): Promise<void>;
  pending: boolean;
  error: string | null;
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
```

 Pages own loading, API calls, navigation, and refresh after a successful
change. Forms own their field state and report complete values; page callbacks
call the API and keep values visible on failure. `AccessGuard` waits while
`loading` is true, then renders its children for an allowed signed-in role. For
no user, show the sign-in path; for a signed-in disallowed role, show an access
message. Member rental screens pass `roles={["member"]}`; the admin layout
passes `roles={["admin"]}`. The API has no approval state, rental status, or
pagination contract, so these interfaces add none.
