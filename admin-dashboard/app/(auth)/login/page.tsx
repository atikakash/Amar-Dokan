"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, LockKeyhole, Mail } from "lucide-react";
import { apiErrorMessage } from "@/lib/api/client";
import { useLogin } from "@/lib/hooks/use-auth";
import { clearSession, getStoredToken } from "@/lib/state/auth-store";

export default function LoginPage() {
  const router = useRouter();
  const login = useLogin();
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("password");
  const [roleError, setRoleError] = useState("");

  useEffect(() => {
    if (getStoredToken()) router.replace("/dashboard");
  }, [router]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const session = await login.mutateAsync({ email, password });

    if (session.user.role === "admin" || session.user.role === "manager") {
      router.replace("/dashboard");
      return;
    }

    clearSession();
    setRoleError("This account is not allowed to access the admin dashboard.");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface px-4 py-8">
      <section className="w-full max-w-md rounded-lg border border-border bg-panel p-6 shadow-soft">
        <div className="mb-6">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-md bg-brand-600 text-white">
            <LockKeyhole className="h-5 w-5" />
          </div>
          <h1 className="text-2xl font-semibold text-ink">Admin sign in</h1>
          <p className="mt-1 text-sm text-muted">Use an admin or manager account to continue.</p>
        </div>

        <form className="grid gap-4" onSubmit={submit}>
          <label className="grid gap-1.5 text-sm font-medium text-ink">
            Email
            <span className="flex h-10 items-center gap-2 rounded-md border border-border bg-panel px-3">
              <Mail className="h-4 w-4 text-muted" />
              <input
                className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </span>
          </label>

          <label className="grid gap-1.5 text-sm font-medium text-ink">
            Password
            <input
              className="h-10 rounded-md border border-border bg-panel px-3 text-sm outline-none"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          {login.isError || roleError ? (
            <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{roleError || apiErrorMessage(login.error)}</p>
          ) : null}

          <button
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-brand-600 px-4 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-70"
            disabled={login.isPending}
          >
            {login.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Sign in
          </button>
        </form>
      </section>
    </main>
  );
}
