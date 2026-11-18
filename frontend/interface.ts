export type Role = "member" | "admin";

export interface AuthResponse {
  id: string;
  name: string;
  email: string;
  role: Role;
  token: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput extends LoginInput {
  name: string;
  tel: string;
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

export type RentalEquipment = Pick<
  Equipment,
  "_id" | "name" | "category" | "description" | "quantity" | "rentalRate" | "isActive"
>;

export type EquipmentInput = Pick<Equipment, "name" | "category" | "description" | "quantity" | "rentalRate">;
export type EquipmentUpdate = Partial<EquipmentInput>;

export interface RentalUser {
  _id: string;
  name: string;
  email: string;
  tel: string;
  role: Role;
}

export interface Rental {
  _id: string;
  equipment: RentalEquipment | null;
  user: RentalUser | null;
  quantity: number;
  startDate: string;
  returnDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface RentalInput {
  equipment: string;
  quantity: number;
  startDate: string;
  returnDate: string;
}

export type RentalUpdate = Partial<RentalInput>;

export interface DateRangeValue {
  startDate: string | null;
  returnDate: string | null;
}

export interface RentalCost {
  days: number;
  total: number;
  currency: "THB";
}

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
