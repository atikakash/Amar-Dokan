"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/lib/api/endpoints";
import type { User } from "@/lib/api/types";
import { clearSession, getStoredToken, getStoredUser, storeSession, storeUser } from "@/lib/state/auth-store";

export function useAuthState() {
  const [token, setToken] = useState<string | null>(null);
  const [cachedUser, setCachedUser] = useState<User | null>(null);

  useEffect(() => {
    setToken(getStoredToken());
    setCachedUser(getStoredUser());
  }, []);

  return { token, cachedUser, setToken, setCachedUser };
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ["auth", "profile"],
    queryFn: authApi.profile,
    retry: false,
    staleTime: 60_000,
    enabled: typeof window !== "undefined" && Boolean(getStoredToken()),
  });
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (session) => {
      storeSession(session.access_token, session.user);
      queryClient.setQueryData(["auth", "profile"], session.user);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useCallback(async () => {
    try {
      if (getStoredToken()) {
        await authApi.logout();
      }
    } finally {
      clearSession();
      queryClient.clear();
      window.location.href = "/login";
    }
  }, [queryClient]);
}

export function useResolvedUser() {
  const { cachedUser } = useAuthState();
  const profile = useCurrentUser();

  useEffect(() => {
    if (profile.data) storeUser(profile.data);
  }, [profile.data]);

  return useMemo(
    () => ({
      user: profile.data ?? cachedUser,
      isLoading: profile.isLoading && !cachedUser,
      isError: profile.isError,
    }),
    [cachedUser, profile.data, profile.isError, profile.isLoading],
  );
}
