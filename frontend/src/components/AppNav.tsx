"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { authApi } from "@/libs/api";

export default function AppNav() {
  const { data: session, status } = useSession();
  const router = useRouter();

  async function logout() {
    if (session?.backendToken) {
      try {
        await authApi.logout(session.backendToken);
      } catch {
        // The local session must end even when the backend logout request fails.
      }
    }
    await signOut({ redirect: false });
    router.push("/");
    router.refresh();
  }

  return (
    <header className="site-header">
      <nav className="nav-inner" aria-label="Main navigation">
        <Link className="nav-home" href="/">Home</Link>
        <div className="nav-links">
          <Link href="/equipments">Equipment</Link>
          {status === "authenticated" ? (
            <>
              <Link href="/rentals">Rental</Link>
              {session.user.role === "admin" && <span className="role-label">You are admin</span>}
              <button className="link-button" onClick={logout} type="button">Logout</button>
            </>
          ) : (
            <>
              <Link href="/register">Register</Link>
              <Link href="/login">Login</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
