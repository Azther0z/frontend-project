import "next-auth";
import "next-auth/jwt";
import type { Role } from "../../interface";

declare module "next-auth" {
  interface Session {
    backendToken?: string;
    user: {
      id: string;
      role: Role;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface User {
    id: string;
    role: Role;
    backendToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: Role;
    backendToken?: string;
  }
}
