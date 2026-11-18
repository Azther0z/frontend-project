import Link from "next/link";
import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <section className="content-narrow">
      <h1>Login</h1>
      <LoginForm />
      <p className="form-footnote">No account? <Link href="/register">Register</Link></p>
    </section>
  );
}
