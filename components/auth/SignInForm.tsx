"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import { TextBoxComponent } from "@syncfusion/ej2-react-inputs";

type AuthMode = "signin" | "register";

export default function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
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
        callbackUrl,
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
    <div className="w-full max-w-md mx-auto rounded-3xl border border-[#E4E2F0] dark:border-white/[0.08] bg-white/80 dark:bg-[#16161E]/90 p-8 shadow-xl dark:shadow-2xl shadow-slate-200/40 dark:shadow-black/40 backdrop-blur-md transition-all duration-300">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#06B6D4]">CampusIQ</p>
        <h1 className="mt-3 text-3xl font-bold text-slate-800 dark:text-white">
          {mode === "signin" ? "Sign in" : "Create account"}
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-white/45">
          Use your email and password to access the dashboard.
        </p>
      </div>

      <ButtonComponent
        disabled={loading}
        onClick={async () => {
          setError("");
          setLoading(true);
          try {
            await signIn("google", { callbackUrl });
          } catch (e) {
            setError("Google sign-in failed.");
            setLoading(false);
          }
        }}
        cssClass="e-outline mb-3 w-full justify-center rounded-xl bg-slate-100 dark:bg-[#2A2B36]/80 px-4 py-3 text-sm font-semibold text-slate-700 dark:text-white transition hover:bg-slate-200 dark:hover:bg-[#323340]/90"
      >
        <svg className="mr-2 h-4 w-4 inline-block" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
          <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
        </svg>
        Sign in with Google
      </ButtonComponent>

      <ButtonComponent
        disabled={loading}
        onClick={async () => {
          setError("");
          setLoading(true);
          try {
            const result = await signIn("credentials", { guest: "true", redirect: false, callbackUrl });
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
        cssClass="mb-5 w-full justify-center rounded-xl bg-slate-200/85 dark:bg-white/60 px-4 py-3 text-sm font-semibold text-slate-800 dark:text-slate-950 transition hover:bg-slate-300 dark:hover:bg-white/95"
      >
        Continue as Guest
      </ButtonComponent>

      <div className="mb-5 flex items-center gap-3 text-xs text-slate-400 dark:text-white/30">
        <div className="h-px flex-1 bg-slate-200 dark:bg-white/[0.08]" />
        <span>or use credentials</span>
        <div className="h-px flex-1 bg-slate-200 dark:bg-white/[0.08]" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === "register" && (
          <div className="block">
            <span className="mb-2 block text-xs font-medium text-slate-600 dark:text-white/55">Name</span>
            <TextBoxComponent
              value={name}
              change={(e: any) => setName(e.value || "")}
              placeholder="Kasif"
              cssClass="e-outline w-full rounded-xl bg-slate-50 dark:bg-white/[0.05] text-slate-800 dark:text-white"
              htmlAttributes={{ required: "required" }}
            />
          </div>
        )}

        <div className="block">
          <span className="mb-2 block text-xs font-medium text-slate-600 dark:text-white/55">Email</span>
          <TextBoxComponent
            type="email"
            value={email}
            change={(e: any) => setEmail(e.value || "")}
            placeholder="you@example.com"
            cssClass="e-outline w-full rounded-xl bg-slate-50 dark:bg-white/[0.05] text-slate-800 dark:text-white"
            htmlAttributes={{ required: "required" }}
          />
        </div>

        <div className="block">
          <span className="mb-2 block text-xs font-medium text-slate-600 dark:text-white/55">Password</span>
          <TextBoxComponent
            type="password"
            value={password}
            change={(e: any) => setPassword(e.value || "")}
            placeholder="Minimum 8 characters"
            cssClass="e-outline w-full rounded-xl bg-slate-50 dark:bg-white/[0.05] text-slate-800 dark:text-white"
            htmlAttributes={{ required: "required" }}
          />
        </div>

        {error && (
          <p className="rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </p>
        )}

        <ButtonComponent
          type="submit"
          disabled={loading}
          cssClass="e-primary w-full rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] px-4 py-3 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Please wait..." : mode === "signin" ? "Sign in" : "Create account"}
        </ButtonComponent>
      </form>

      <button
        type="button"
        onClick={() => {
          setMode(mode === "signin" ? "register" : "signin");
          setError("");
        }}
        className="mt-6 w-full text-center text-sm text-slate-500 dark:text-white/50 transition hover:text-slate-800 dark:hover:text-white"
      >
        {mode === "signin" ? "Need an account? Create one" : "Already have an account? Sign in"}
      </button>
    </div>
  );
}
