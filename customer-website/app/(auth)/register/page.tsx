"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { apiErrorMessage } from "@/lib/api/client";
import { useRegister } from "@/lib/hooks/use-auth";

export default function RegisterPage() {
  const router = useRouter();
  const register = useRegister();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "",
  });

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await register.mutateAsync(form);
    router.replace("/");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface px-4 py-8">
      <section className="w-full max-w-lg rounded-lg border border-border bg-panel p-6 shadow-soft">
        <div className="mb-6">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-md bg-leaf-600 text-white">
            <UserPlus className="h-5 w-5" />
          </div>
          <h1 className="text-2xl font-semibold text-ink">Create account</h1>
          <p className="mt-1 text-sm text-muted">Register as a customer and start shopping.</p>
        </div>
        <form className="grid gap-4" onSubmit={submit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name">
              <Input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
            </Field>
            <Field label="Phone">
              <Input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
            </Field>
          </div>
          <Field label="Email">
            <Input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Password">
              <Input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
            </Field>
            <Field label="Confirm Password">
              <Input type="password" value={form.password_confirmation} onChange={(event) => setForm({ ...form, password_confirmation: event.target.value })} required />
            </Field>
          </div>
          {register.isError ? <p className="rounded-md bg-red-50 p-3 text-sm text-danger">{apiErrorMessage(register.error)}</p> : null}
          <Button disabled={register.isPending}>
            {register.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Create Account
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-muted">
          Already registered?{" "}
          <Link href="/login" className="font-medium text-leaf-700">
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
}
