"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import type { User } from "@/lib/types";

const AuthContext = createContext<{
  user: User | null;
  token: string | null;
  setSession: (token: string, user: User) => void;
  logout: () => void;
} | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("sala_token");
    if (!storedToken) return;
    setToken(storedToken);
    api.me(storedToken).then(({ user }) => setUser(user)).catch(() => localStorage.removeItem("sala_token"));
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      setSession: (nextToken: string, nextUser: User) => {
        localStorage.setItem("sala_token", nextToken);
        setToken(nextToken);
        setUser(nextUser);
      },
      logout: () => {
        localStorage.removeItem("sala_token");
        setToken(null);
        setUser(null);
      }
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
