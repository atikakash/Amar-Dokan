"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { apiErrorMessage } from "@/lib/api/client";
import { useLogin } from "@/lib/hooks/use-auth";
import { getStoredToken } from "@/lib/state/auth-store";

export default function LoginPage() {
  const router = useRouter();
  const login = useLogin();
  const [email, setEmail] = useState("customer@example.com");
  const [password, setPassword] = useState("password");

  useEffect(() => {
    if (getStoredToken()) router.replace("/");
  }, [router]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await login.mutateAsync({ email, password });
    router.replace("/");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface px-4 py-8">
      <section className="w-full max-w-md rounded-lg border border-border bg-panel p-6 shadow-soft">
        <div className="mb-6">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-md bg-leaf-600 text-white">
            <LockKeyhole className="h-5 w-5" />
          </div>
          <h1 className="text-2xl font-semibold text-ink">Sign in</h1>
          <p className="mt-1 text-sm text-muted">Access cart, checkout, orders, profile, and wishlist.</p>
        </div>
        <form className="grid gap-4" onSubmit={submit}>
          <Field label="Email">
            <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </Field>
          <Field label="Password">
            <Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          </Field>
          {login.isError ? <p className="rounded-md bg-red-50 p-3 text-sm text-danger">{apiErrorMessage(login.error)}</p> : null}
          <Button disabled={login.isPending}>
            {login.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Sign in
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-muted">
          New customer?{" "}
          <Link href="/register" className="font-medium text-leaf-700">
            Create an account
          </Link>
        </p>
      </section>
    </main>
  );
}
