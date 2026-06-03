"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { UserPlus, Sparkles, MessageSquareText, Target, Trophy } from "lucide-react";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { useToast } from "@/components/Toast";
import { authService } from "@/services/auth.service";
import { useAsyncAction } from "@/hooks/useAsyncAction";

const bullets = [
  { icon: MessageSquareText, text: "Adaptive AI questions for your role & level" },
  { icon: Target,            text: "Structured feedback with improved answers"   },
  { icon: Trophy,            text: "Track progress and master weak areas"        }
];

export default function RegisterPage() {
  const router = useRouter();
  const { success, error: toastError } = useToast();
  const [fullName, setFullName]       = useState("");
  const [email, setEmail]             = useState("");
  const [password, setPassword]       = useState("");
  const [confirmPassword, setConfirm] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string,string>>({});
  const { run, loading, error }       = useAsyncAction(authService.register);

  async function onSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    const errs: Record<string,string> = {};
    if (fullName.trim().length < 2)   errs.fullName        = "Enter your full name.";
    if (!email.includes("@"))         errs.email           = "Enter a valid email.";
    if (password.length < 8)          errs.password        = "Min. 8 characters.";
    if (password !== confirmPassword) errs.confirmPassword = "Passwords do not match.";
    setFieldErrors(errs);
    if (Object.keys(errs).length) return;

    try {
      await run({ fullName, email, password });
      success("Account created! 🎉", "Welcome to IntervuAI. Let's start practising.");
      router.push("/dashboard");
    } catch {
      toastError("Registration failed", error || "Could not create account. Try again.");
    }
  }

  return (
    <main className="grid min-h-screen bg-surface lg:grid-cols-2">
      {/* Branding panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden border-r border-line bg-panel p-10 lg:flex">
        <div className="pointer-events-none absolute inset-0 dot-grid opacity-40" />
        <div className="pointer-events-none absolute -left-20 -top-20 h-80 w-80 rounded-full bg-violet-600/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-indigo-600/10 blur-3xl" />
        <Link href="/" className="relative flex items-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-glow-v">
            <Sparkles className="h-5 w-5 text-white" />
          </span>
          <span className="text-lg font-extrabold text-gradient-subtle">IntervuAI</span>
        </Link>
        <div className="relative">
          <h2 className="text-3xl font-extrabold leading-snug text-white">Start practicing today — free, no credit card needed.</h2>
          <ul className="mt-8 grid gap-4">
            {bullets.map((b) => {
              const Icon = b.icon;
              return (
                <li key={b.text} className="flex items-center gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-violet-500/30 bg-violet-500/15 text-violet-300">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="text-sm font-semibold text-zinc-300">{b.text}</span>
                </li>
              );
            })}
          </ul>
        </div>
        <p className="relative text-xs text-zinc-600">© 2026 IntervuAI</p>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center bg-surface px-6 py-12">
        <div className="w-full max-w-sm animate-fade-up">
          <Link href="/" className="mb-8 flex items-center gap-2.5 lg:hidden">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600">
              <Sparkles className="h-4 w-4 text-white" />
            </span>
            <span className="text-lg font-extrabold text-gradient-subtle">IntervuAI</span>
          </Link>
          <div className="mb-8">
            <h1 className="text-2xl font-extrabold text-white">Create your account 🚀</h1>
            <p className="mt-1.5 text-sm text-zinc-400">Join thousands of candidates practising smarter.</p>
          </div>
          <div className="rounded-2xl border border-line bg-card/80 p-6 shadow-glow backdrop-blur-sm">
            <form className="grid gap-4" onSubmit={onSubmit}>
              <Input label="Full Name"        name="fullName"        value={fullName}        onChange={(e)=>setFullName(e.target.value)}  error={fieldErrors.fullName}        autoComplete="name"         placeholder="Jane Smith"        />
              <Input label="Email"            name="email"           type="email"            value={email}           onChange={(e)=>setEmail(e.target.value)}    error={fieldErrors.email}           autoComplete="email"        placeholder="you@example.com"   />
              <Input label="Password"         name="password"        type="password"         value={password}        onChange={(e)=>setPassword(e.target.value)} error={fieldErrors.password}        autoComplete="new-password" placeholder="Min. 8 characters" />
              <Input label="Confirm Password" name="confirmPassword" type="password"         value={confirmPassword} onChange={(e)=>setConfirm(e.target.value)}  error={fieldErrors.confirmPassword} autoComplete="new-password" placeholder="Repeat password"    />
              {error && <div className="rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-sm font-medium text-red-300">{error}</div>}
              <Button loading={loading} size="lg" icon={<UserPlus className="h-4 w-4" />} className="mt-1 w-full">Create account</Button>
            </form>
          </div>
          <p className="mt-5 text-center text-sm text-zinc-500">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-violet-400 hover:text-violet-300 transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
