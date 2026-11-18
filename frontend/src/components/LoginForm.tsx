"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ErrorMessage } from "@/components/Feedback";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    try {
      const result = await signIn("credentials", { email, password, redirect: false });
      if (!result || result.error) {
        throw new Error(result?.error === "CredentialsSignin" ? "Email or password is incorrect." : "The rental service is unavailable. Please try again.");
      }
      router.push("/");
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Login failed. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="form-stack" onSubmit={submit}>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <label className="field"><span>Email</span><input autoComplete="email" onChange={(event) => setEmail(event.target.value)} required type="email" value={email} /></label>
      <label className="field"><span>Password</span><input autoComplete="current-password" onChange={(event) => setPassword(event.target.value)} required type="password" value={password} /></label>
      <button className="button button-primary" disabled={pending} type="submit">{pending ? "Logging in…" : "Login"}</button>
    </form>
  );
}
