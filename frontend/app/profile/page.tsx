"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LogOut, Mail, User, BarChart3, TrendingUp, Award } from "lucide-react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Sidebar } from "@/components/Sidebar";
import { StatCard } from "@/components/StatCard";
import { useToast } from "@/components/Toast";
import { authService } from "@/services/auth.service";
import { interviewService } from "@/services/interview.service";
import type { UserDto } from "@/types/auth";
import type { DashboardDto } from "@/types/interview";

export default function ProfilePage() {
  const router = useRouter();
  const { success, error: toastError } = useToast();
  const [user, setUser]           = useState<UserDto | null>(null);
  const [dashboard, setDashboard] = useState<DashboardDto | null>(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    Promise.all([authService.me(), interviewService.getDashboard()])
      .then(([p, s]) => { setUser(p); setDashboard(s); })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  async function logout() {
    setLoggingOut(true);
    try {
      await authService.logout();
      success("Signed out", "Come back soon! Keep practising.");
      router.push("/login");
    } catch(e) {
      const msg = e instanceof Error ? e.message : "Unable to logout.";
      setError(msg);
      toastError("Sign-out failed", msg);
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <main className="min-h-screen bg-surface lg:pl-64">
      <Sidebar />
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {loading ? <LoadingSpinner label="Loading profile" /> : null}
        {error && (
          <div className="mb-4 rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-sm font-medium text-red-300">{error}</div>
        )}

        {user ? (
          <div className="grid gap-6 animate-fade-up">
            {/* Profile header */}
            <div className="relative overflow-hidden rounded-2xl border border-violet-500/25 bg-gradient-to-br from-violet-600/20 to-indigo-600/10 p-6 shadow-glow-v backdrop-blur-sm">
              <div className="pointer-events-none absolute inset-0 dot-grid opacity-20" />
              <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
                <div className="flex items-center gap-5">
                  <div className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl border-2 border-violet-500/40 bg-gradient-to-br from-violet-600/30 to-indigo-600/20 text-4xl font-extrabold text-white shadow-glow-v">
                    {user.fullName?.[0]?.toUpperCase() ?? "U"}
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-violet-400">Profile</p>
                    <h1 className="mt-0.5 text-2xl font-extrabold text-white md:text-3xl">{user.fullName}</h1>
                    <p className="mt-1.5 flex items-center gap-2 text-sm text-zinc-400">
                      <Mail className="h-4 w-4 shrink-0" /> {user.email}
                    </p>
                  </div>
                </div>
                <Button variant="danger" size="sm" loading={loggingOut} icon={<LogOut className="h-4 w-4" />} onClick={logout}>
                  Sign out
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-3">
              <StatCard label="Interviews"   value={dashboard?.totalInterviews ?? 0}    detail="Sessions completed" icon={<BarChart3  className="h-5 w-5" />} accent="violet" />
              <StatCard label="Avg score"    value={`${dashboard?.averageScore ?? 0}%`} detail="Current benchmark"  icon={<TrendingUp className="h-5 w-5" />} accent="indigo" />
              <StatCard label="Strong areas" value={dashboard?.strongAreas.length ?? 0} detail="Recognised skills"  icon={<Award      className="h-5 w-5" />} accent="teal"   />
            </div>

            {/* Account + Skills */}
            <div className="grid gap-5 lg:grid-cols-2">
              <Card>
                <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-zinc-600">Account details</h2>
                <dl className="grid gap-3">
                  {[
                    { icon: User, label:"Full name",     value: user.fullName },
                    { icon: Mail, label:"Email address", value: user.email    }
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-center gap-3 rounded-xl border border-line bg-white/[0.03] px-4 py-3">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-violet-500/25 bg-violet-500/10 text-violet-300">
                        <Icon className="h-4 w-4" />
                      </span>
                      <div>
                        <dt className="text-[10px] font-bold uppercase tracking-wide text-zinc-600">{label}</dt>
                        <dd className="text-sm font-semibold text-white">{value}</dd>
                      </div>
                    </div>
                  ))}
                </dl>
              </Card>

              <Card>
                <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-zinc-600">Skill summary</h2>
                {(dashboard?.strongAreas.length ?? 0) > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {dashboard!.strongAreas.map((area) => (
                      <span key={area} className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">{area}</span>
                    ))}
                  </div>
                ) : (
                  <p className="py-4 text-center text-sm text-zinc-600">Complete interviews to see your strong areas here.</p>
                )}
                {(dashboard?.weakAreas.length ?? 0) > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {dashboard!.weakAreas.map((area) => (
                      <span key={area} className="rounded-full border border-amber-500/25 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-300">{area}</span>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}
