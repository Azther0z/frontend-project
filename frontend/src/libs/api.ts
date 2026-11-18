import type {
  ApiFailure,
  ApiSuccess,
  AuthResponse,
  Equipment,
  LoginInput,
  RegisterInput,
  Rental,
  RentalInput,
} from "../../interface";

const apiOrigin = (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000").replace(/\/$/, "");

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(path: string, init: RequestInit = {}, token?: string): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body) headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  let response: Response;
  try {
    response = await fetch(`${apiOrigin}/api/v1${path}`, { ...init, headers, cache: "no-store" });
  } catch {
    throw new ApiError("Cannot reach the equipment rental service. Check the API address and try again.", 0);
  }

  const payload = (await response.json().catch(() => null)) as ApiSuccess<T> | ApiFailure | null;
  if (!response.ok || !payload || payload.success === false) {
    throw new ApiError(
      payload && "error" in payload ? payload.error : "The request failed. Please try again.",
      response.status,
    );
  }
  return payload.data as T;
}

export const authApi = {
  login(input: LoginInput) {
    return request<AuthResponse>("/auth/login", { method: "POST", body: JSON.stringify(input) });
  },
  register(input: RegisterInput) {
    return request<AuthResponse>("/auth/register", { method: "POST", body: JSON.stringify(input) });
  },
  logout(token: string) {
    return request<void>("/auth/logout", { method: "GET" }, token);
  },
};

export const equipmentApi = {
  list(token?: string) {
    return request<Equipment[]>("/equipment", {}, token);
  },
  get(id: string, token?: string) {
    return request<Equipment>(`/equipment/${encodeURIComponent(id)}`, {}, token);
  },
};

export const rentalsApi = {
  list(token: string) {
    return request<Rental[]>("/rentals", {}, token);
  },
  get(id: string, token: string) {
    return request<Rental>(`/rentals/${encodeURIComponent(id)}`, {}, token);
  },
  create(input: RentalInput, token: string) {
    return request<Rental>("/rentals", { method: "POST", body: JSON.stringify(input) }, token);
  },
  update(id: string, input: RentalInput, token: string) {
    return request<Rental>(`/rentals/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: JSON.stringify(input),
    }, token);
  },
  remove(id: string, token: string) {
    return request<unknown>(`/rentals/${encodeURIComponent(id)}`, { method: "DELETE" }, token);
  },
};

export function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Something went wrong. Please try again.";
}
