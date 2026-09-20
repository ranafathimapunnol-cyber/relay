"use client";

import { FormEvent, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const token = await apiFetch<{
        access_token: string;
        token_type: string;
      }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      localStorage.setItem(
        "access_token",
        token.access_token
      );

      const user = await apiFetch<{
        id: number;
        name: string;
        email: string;
        role: string;
      }>("/api/auth/me");

      if (user.role !== "ADMIN") {
        localStorage.removeItem("access_token");
        setError(
          "This login is restricted to administrators."
        );
        return;
      }

      router.replace("/admin");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Invalid admin credentials"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="app-bg flex min-h-screen items-center justify-center px-5">
      <div className="w-full max-w-md">
        <div className="card rounded-[32px] p-8 shadow-2xl">
          <div className="mb-8 text-center">
            <div className="brand-mark mx-auto mb-5 bg-[#5a3827] text-white">
              <ShieldCheck size={22} />
            </div>

            <p className="text-xs uppercase tracking-[0.3em] text-[#806d60]">
              Relay
            </p>

            <h1 className="serif mt-2 text-4xl text-[#35231b]">
              Admin Portal
            </h1>

            <p className="mt-2 text-sm text-[#806d60]">
              Sign in to manage the Relay workspace.
            </p>
          </div>

          <form
            onSubmit={handleLogin}
            className="space-y-4"
          >
            <div>
              <label className="mb-2 block text-xs font-medium text-[#5c4030]">
                Admin email
              </label>

              <input
                type="email"
                required
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                className="glass w-full rounded-2xl px-4 py-3 outline-none"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium text-[#5c4030]">
                Password
              </label>

              <input
                type="password"
                required
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                className="glass w-full rounded-2xl px-4 py-3 outline-none"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50/70 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-[#4b3022] py-3.5 font-semibold text-white transition hover:bg-[#392419] disabled:opacity-60"
            >
              {loading
                ? "Signing in..."
                : "Sign in as administrator"}
            </button>
          </form>

          <button
            onClick={() => router.push("/login")}
            className="mt-6 w-full text-center text-sm text-[#806d60] hover:text-[#4b3022]"
          >
            ← Regular user login
          </button>
        </div>
      </div>
    </main>
  );
}
