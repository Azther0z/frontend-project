"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import type { Role } from "../../interface";
import { authApi, errorMessage } from "@/libs/api";
import { ErrorMessage } from "@/components/Feedback";

export default function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [tel, setTel] = useState("");
  const [role, setRole] = useState<Role>("member");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setPending(true);
    setError("");
    try {
      await authApi.register({ name, email, tel, role, password });
      const result = await signIn("credentials", { email, password, redirect: false });
      if (!result || result.error) throw new Error("Your account was created, but automatic login failed. Please log in.");
      router.push("/");
      router.refresh();
    } catch (cause) {
      setError(errorMessage(cause));
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="form-stack" onSubmit={submit}>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <label className="field"><span>Name</span><input autoComplete="name" onChange={(event) => setName(event.target.value)} required value={name} /></label>
      <label className="field"><span>Email</span><input autoComplete="email" onChange={(event) => setEmail(event.target.value)} required type="email" value={email} /></label>
      <label className="field"><span>Tel</span><input autoComplete="tel" onChange={(event) => setTel(event.target.value)} required type="tel" value={tel} /></label>
      <label className="field"><span>Role</span><select onChange={(event) => setRole(event.target.value as Role)} value={role}><option value="member">Member</option><option value="admin">Admin</option></select></label>
      <label className="field"><span>Password</span><input autoComplete="new-password" onChange={(event) => setPassword(event.target.value)} required type="password" value={password} /></label>
      <label className="field"><span>Confirm Password</span><input autoComplete="new-password" onChange={(event) => setConfirmPassword(event.target.value)} required type="password" value={confirmPassword} /></label>
      <button className="button button-primary" disabled={pending} type="submit">{pending ? "Registering…" : "Register"}</button>
    </form>
  );
}
