import Link from "next/link";
import RegisterForm from "@/components/RegisterForm";

export default function RegisterPage() {
  return (
    <section className="content-narrow">
      <h1>Register</h1>
      <RegisterForm />
      <p className="form-footnote">Already registered? <Link href="/login">Login</Link></p>
    </section>
  );
}
