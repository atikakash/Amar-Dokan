"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useResolvedUser } from "@/lib/hooks/use-auth";
import { getStoredToken } from "@/lib/state/auth-store";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isLoading, isError } = useResolvedUser();

  useEffect(() => {
    if (!getStoredToken()) {
      router.replace("/login");
    }
  }, [router]);

  useEffect(() => {
    if (isError) {
      router.replace("/login");
    }
  }, [isError, router]);

  useEffect(() => {
    if (user && user.role !== "admin" && user.role !== "manager") {
      router.replace("/login");
    }
  }, [router, user]);

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface text-muted">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        Loading workspace
      </div>
    );
  }

  return <>{children}</>;
}
