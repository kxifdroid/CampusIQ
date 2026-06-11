"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

type AuthMode = "signin" | "register";

export default function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const origin = typeof window !== "undefined" ? window.location.origin : (process.env.NEXT_PUBLIC_APP_URL || "");
  const absoluteCallbackUrl = origin.endsWith("/") ? origin.slice(0, -1) + callbackUrl : origin + callbackUrl;
  const [mode, setMode] = useState<AuthMode>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "register") {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });

        if (!res.ok) {
          const payload = await res.json().catch(() => null);
          throw new Error(payload?.message || "Registration failed.");
        }
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: absoluteCallbackUrl,
      });

      if (result?.error) {
        throw new Error("Invalid email or password.");
      }

      router.push(result?.url || callbackUrl);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md mx-auto rounded-3xl border border-white/[0.08] bg-[#16161E]/90 p-8 shadow-2xl shadow-black/40">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#06B6D4]">CampusIQ</p>
        <h1 className="mt-3 text-3xl font-bold text-white">
          {mode === "signin" ? "Sign in" : "Create account"}
        </h1>
        <p className="mt-2 text-sm text-white/45">
          Use your email and password to access the dashboard.
        </p>
      </div>

      <button
        type="button"
        disabled={loading}
        onClick={async () => {
          setError("");
          setLoading(true);
          try {
            const result = await signIn("credentials", { guest: "true", redirect: false, callbackUrl: absoluteCallbackUrl });
            if (result?.error) {
              setError("Guest sign-in failed.");
            } else {
              router.push(result?.url || callbackUrl);
              router.refresh();
            }
          } catch (e) {
            setError("Guest sign-in failed.");
          } finally {
            setLoading(false);
          }
        }}
        className="mb-5 flex w-full items-center justify-center rounded-xl border border-white/[0.1] bg-white/60 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-white/90"
      >
        Continue as Guest
      </button>

      <div className="mb-5 flex items-center gap-3 text-xs text-white/30">
        <div className="h-px flex-1 bg-white/[0.08]" />
        <div className="h-px flex-1 bg-white/[0.08]" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === "register" && (
          <label className="block">
            <span className="mb-2 block text-xs font-medium text-white/55">Name</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.05] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#06B6D4]/70"
              placeholder="Kasif"
              required
            />
          </label>
        )}

        <label className="block">
          <span className="block text-xs font-medium text-white/55">Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-xl border border-white/[0.08] bg-white/[0.05] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#06B6D4]/70"
            placeholder="you@example.com"
            required
          />
        </label>

        <label className="block">
          <span className="block text-xs font-medium text-white/55">Password</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-xl border border-white/[0.08] bg-white/[0.05] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#06B6D4]/70"
            placeholder="Minimum 8 characters"
            minLength={8}
            required
          />
        </label>

        {error && (
          <p className="rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] px-4 py-3 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Please wait..." : mode === "signin" ? "Sign in" : "Create account"}
        </button>
      </form>

      <button
        type="button"
        onClick={() => {
          setMode(mode === "signin" ? "register" : "signin");
          setError("");
        }}
        className="mt-6 w-full text-center text-sm text-white/50 transition hover:text-white"
      >
        {mode === "signin" ? "Need an account? Create one" : "Already have an account? Sign in"}
      </button>
    </div>
  );
}
