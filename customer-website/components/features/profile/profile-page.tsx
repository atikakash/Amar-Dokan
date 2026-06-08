"use client";

import { FormEvent, useEffect, useState } from "react";
import { Loader2, LogOut, MailCheck } from "lucide-react";
import { AuthGuard } from "@/components/auth/auth-guard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Field, Input } from "@/components/ui/input";
import { SectionHeading } from "@/components/ui/section-heading";
import { apiErrorMessage } from "@/lib/api/client";
import { authApi } from "@/lib/api/endpoints";
import { useLogout, useProfileUpdate, useResolvedUser } from "@/lib/hooks/use-auth";

export function ProfilePage() {
  const { user } = useResolvedUser();
  const update = useProfileUpdate();
  const logout = useLogout();
  const [saved, setSaved] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", password_confirmation: "" });

  useEffect(() => {
    if (user) setForm((current) => ({ ...current, name: user.name, email: user.email, phone: user.phone ?? "" }));
  }, [user]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await update.mutateAsync({
      name: form.name,
      email: form.email,
      phone: form.phone,
      password: form.password || undefined,
      password_confirmation: form.password_confirmation || undefined,
    });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  }

  async function resendVerification() {
    await authApi.resendVerification();
    setVerificationSent(true);
  }

  return (
    <AuthGuard>
      <SectionHeading title="Profile" description="Manage your customer account and contact details." />
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader title="Account Details" />
          <CardContent>
            <form className="grid gap-4" onSubmit={submit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Name">
                  <Input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
                </Field>
                <Field label="Email">
                  <Input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
                </Field>
                <Field label="Phone">
                  <Input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
                </Field>
                <div />
                <Field label="New Password">
                  <Input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
                </Field>
                <Field label="Confirm Password">
                  <Input type="password" value={form.password_confirmation} onChange={(event) => setForm({ ...form, password_confirmation: event.target.value })} />
                </Field>
              </div>
              {update.isError ? <p className="text-sm text-danger">{apiErrorMessage(update.error)}</p> : null}
              <div className="flex items-center justify-end gap-3">
                {saved ? <span className="text-sm text-leaf-700">Saved</span> : null}
                <Button disabled={update.isPending}>
                  {update.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Save Profile
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        <Card className="h-fit">
          <CardHeader title="Account Status" />
          <CardContent className="grid gap-3">
            <div className="rounded-md border border-border bg-surface p-3 text-sm">
              <p className="font-medium text-ink">Email verification</p>
              <p className="mt-1 text-muted">{user?.email_verified_at ? "Your email is verified." : "Your email is not verified yet."}</p>
            </div>
            {!user?.email_verified_at ? (
              <Button type="button" variant="secondary" onClick={resendVerification}>
                <MailCheck className="h-4 w-4" />
                {verificationSent ? "Sent" : "Resend Verification"}
              </Button>
            ) : null}
            <Button type="button" variant="danger" onClick={logout}>
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  );
}
