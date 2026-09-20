"use client";

import {
  Eye,
  EyeOff,
  ArrowRight,
  LockKeyhole,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { apiFetch } from "@/lib/api";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

type LoginResponse = {
  access_token: string;
  token_type: string;
};

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) return;

    apiFetch<User>("/api/auth/me")
      .then((user) => {
        router.replace(
          user.role === "ADMIN"
            ? "/admin"
            : "/dashboard"
        );
      })
      .catch(() => {
        localStorage.removeItem("access_token");
      });
  }, [router]);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const result = await apiFetch<LoginResponse>(
        "/api/auth/login",
        {
          method: "POST",
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      localStorage.setItem(
        "access_token",
        result.access_token
      );

      const user = await apiFetch<User>(
        "/api/auth/me"
      );

      if (user.role === "ADMIN") {
        router.replace("/admin");
      } else {
        router.replace("/dashboard");
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Invalid email or password"
      );

      localStorage.removeItem("access_token");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#1c120d] px-5 py-10">

      {/* ================= BACKGROUND ================= */}

      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/desert-bg.png')",
        }}
      />

      {/* Dark cinematic overlay */}
      <div className="absolute inset-0 bg-black/35" />

      {/* Warm gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#24150e]/40 via-transparent to-[#120b08]/65" />

      {/* Soft glow */}
      <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d2a77d]/10 blur-[120px]" />


      {/* ================= NAVBAR ================= */}

      <header className="absolute inset-x-0 top-0 z-30">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-6 lg:px-10">

          <Link
            href="/"
            className="group flex items-center gap-2 text-white"
          >
            <span className="serif text-2xl font-semibold tracking-tight">
              Relay
            </span>

            <span className="h-1.5 w-1.5 rounded-full bg-[#e5bd96] transition group-hover:scale-125" />
          </Link>

          <Link
            href="/register"
            className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-medium text-white/85 backdrop-blur-md transition hover:bg-white/15 hover:text-white"
          >
            Create account
          </Link>

        </div>
      </header>


      {/* ================= LOGIN ================= */}

      <div className="relative z-20 w-full max-w-[430px]">

        {/* Small brand heading */}
        <div className="mb-6 text-center text-white">

          <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.3em] text-white/55">
            Welcome back
          </p>

          <h1 className="serif text-3xl tracking-tight sm:text-4xl">
            Sign in to Relay
          </h1>

          <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-white/60">
            Continue to your workspace and keep your work moving.
          </p>

        </div>


        {/* ================= GLASS CARD ================= */}

        <div className="rounded-[30px] border border-white/20 bg-[#f5e9dc]/90 p-6 shadow-[0_25px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl sm:p-8">

          {/* Icon + title */}
          <div className="mb-7 flex items-center gap-4">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#60402d] text-white shadow-lg">
              <LockKeyhole size={19} />
            </div>

            <div>
              <h2 className="text-base font-semibold text-[#4f3425]">
                Your workspace
              </h2>

              <p className="mt-0.5 text-xs text-[#907969]">
                Enter your details to continue
              </p>
            </div>

          </div>


          {/* Error */}
          {error && (
            <div className="mb-5 rounded-2xl border border-red-200/80 bg-red-50/80 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}


          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Email */}
            <div>
              <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wide text-[#705444]">
                Email address
              </label>

              <input
                type="email"
                required
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="you@example.com"
                autoComplete="email"
                className="w-full rounded-2xl border border-[#76523d]/15 bg-white/70 px-4 py-3.5 text-sm text-[#4f3425] outline-none transition placeholder:text-[#b4a092] focus:border-[#76523d]/40 focus:bg-white/90 focus:ring-4 focus:ring-[#76523d]/10"
              />
            </div>


            {/* Password */}
            <div>

              <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wide text-[#705444]">
                Password
              </label>

              <div className="relative">

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  required
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="w-full rounded-2xl border border-[#76523d]/15 bg-white/70 px-4 py-3.5 pr-12 text-sm text-[#4f3425] outline-none transition placeholder:text-[#b4a092] focus:border-[#76523d]/40 focus:bg-white/90 focus:ring-4 focus:ring-[#76523d]/10"
                />

                <button
                  type="button"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-xl p-2 text-[#806858] transition hover:bg-[#60402d]/5 hover:text-[#4f3425]"
                >
                  {showPassword ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}
                </button>

              </div>

            </div>


            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-[#60402d] px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#60402d]/20 transition duration-300 hover:-translate-y-0.5 hover:bg-[#503426] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Signing in..."
                : "Continue"}

              {!loading && (
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 transition-transform group-hover:translate-x-1">
                  <ArrowRight size={14} />
                </span>
              )}
            </button>

          </form>


          {/* Account note */}
          <div className="mt-6 border-t border-[#76523d]/10 pt-5 text-center">

            <p className="text-sm text-[#806858]">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-semibold text-[#60402d] transition hover:text-[#3f281c]"
              >
                Create one
              </Link>
            </p>

          </div>

        </div>


        {/* Back link */}
        <div className="mt-6 text-center">

          <Link
            href="/"
            className="text-xs text-white/55 transition hover:text-white"
          >
            ← Back to Relay
          </Link>

        </div>

      </div>

    </main>
  );
}