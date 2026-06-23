"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/components/AuthProvider";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const { setSession } = useAuth();
  const [error, setError] = useState("");

  async function submit(formData: FormData) {
    setError("");
    try {
      const payload = Object.fromEntries(formData) as { name: string; email: string; password: string; phone?: string };
      const result = mode === "login" ? await api.login(payload) : await api.register(payload);
      setSession(result.token, result.user);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    }
  }

  return (
    <form action={submit} className="form glass" style={{ borderRadius: 8, padding: 24, width: "min(440px, 100%)" }}>
      <h1 className="title" style={{ fontSize: "2.3rem" }}>{mode === "login" ? "Login" : "Register"}</h1>
      {mode === "register" && <label className="field"><span>Ime</span><input name="name" required /></label>}
      <label className="field"><span>Email</span><input type="email" name="email" required /></label>
      {mode === "register" && <label className="field"><span>Telefon</span><input name="phone" /></label>}
      <label className="field"><span>Password</span><input type="password" name="password" minLength={8} required /></label>
      <button className="btn btn-primary">{mode === "login" ? "Login" : "Create account"}</button>
      {error && <p style={{ color: "var(--rose)" }}>{error}</p>}
    </form>
  );
}
