"use client";

import { Suspense } from "react";
import SignInForm from "@/components/auth/SignInForm";
import { useTheme } from "@/components/theme/ThemeProvider";
import { Sun, Moon } from "lucide-react";

export default function SignInPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-12 transition-colors duration-500">
      {/* Dynamic Background Gradients */}
      {theme === "dark" ? (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(6,182,212,0.18),transparent_28%),radial-gradient(circle_at_78%_16%,rgba(124,58,237,0.22),transparent_30%),linear-gradient(135deg,#0D0D12,#111827_52%,#0D0D12)] transition-opacity duration-500" />
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(6,182,212,0.08),transparent_28%),radial-gradient(circle_at_78%_16%,rgba(124,58,237,0.1),transparent_30%),linear-gradient(135deg,#F9F8FF,#E8E6FF_52%,#F9F8FF)] transition-opacity duration-500" />
      )}
      
      {/* Floating Theme Toggle Switch (Same type as home navbar) */}
      <div className="fixed top-6 right-6 z-50">
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl text-slate-600 dark:text-[#6B6B8A] bg-white dark:bg-[#16161E] hover:bg-slate-100 dark:hover:bg-[#F0EEFF] border border-slate-200 dark:border-[#E4E2F0] shadow-sm transition-all duration-300"
          aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
        >
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </div>

      <div className="absolute left-1/2 top-1/2 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-slate-200/20 dark:border-white/[0.04]" />
      
      <div className="relative z-10 w-full">
        <Suspense fallback={null}>
          <SignInForm />
        </Suspense>
      </div>
    </main>
  );
}
