"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BarChart3, Brain, MessageSquarePlus, TrendingUp, ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Sidebar } from "@/components/Sidebar";
import { StatCard } from "@/components/StatCard";
import { formatDate } from "@/lib/utils";
import { interviewService } from "@/services/interview.service";
import type { DashboardDto } from "@/types/interview";

const scoreBadge = (s: number) =>
  s >= 80 ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
: s >= 60 ? "border-amber-500/30  bg-amber-500/10  text-amber-300"
           : "border-red-500/30   bg-red-500/10    text-red-300";

export default function DashboardPage() {
  const [data, setData]       = useState<DashboardDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    interviewService.getDashboard()
      .then(setData)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-surface lg:pl-64">
      <Sidebar />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {loading ? <LoadingSpinner label="Loading dashboard" /> : null}
        {error && <div className="rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-sm font-medium text-red-300">{error}</div>}

        {data ? (
          <div className="grid gap-6 animate-fade-up">
            {/* Banner */}
            <div className="relative overflow-hidden rounded-2xl border border-violet-500/25 bg-gradient-to-br from-violet-600/20 to-indigo-600/10 p-6 shadow-glow-v backdrop-blur-sm">
              <div className="pointer-events-none absolute inset-0 dot-grid opacity-20" />
              <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-violet-400">Dashboard</p>
                  <h1 className="mt-1 text-2xl font-extrabold text-white md:text-3xl">Welcome back, {data.fullName} 👋</h1>
                  <p className="mt-2 text-sm text-zinc-400 max-w-md">Track progress, review recent attempts, and start a focused session.</p>
                </div>
                <Link href="/interview/start" className="shrink-0">
                  <Button size="lg" icon={<MessageSquarePlus className="h-4 w-4" />}>Start Interview</Button>
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-3">
              <StatCard label="Total interviews" value={data.totalInterviews}      detail="Completed sessions"  icon={<BarChart3  className="h-5 w-5" />} accent="violet" />
              <StatCard label="Average score"    value={`${data.averageScore}%`}   detail="Across all feedback" icon={<TrendingUp className="h-5 w-5" />} accent="indigo" />
              <StatCard label="Focus areas"      value={data.weakAreas.length||0}  detail="Needs attention"     icon={<Brain      className="h-5 w-5" />} accent="rose"   />
            </div>

            {/* Skills */}
            <div className="grid gap-4 lg:grid-cols-2">
              <SkillList title="Strong areas" items={data.strongAreas} empty="No strong areas yet." variant="good" />
              <SkillList title="Weak areas"   items={data.weakAreas}   empty="No weak areas yet."   variant="warn" />
            </div>

            {/* Recent */}
            <Card>
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-white">Recent interviews</h2>
                  <p className="text-xs mt-0.5 text-zinc-500">Your last practice sessions</p>
                </div>
                <Link href="/interview/start">
                  <Button variant="secondary" size="sm" icon={<ArrowRight className="h-3.5 w-3.5" />}>New session</Button>
                </Link>
              </div>
              {data.recentInterviews.length ? (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[520px] text-sm">
                    <thead>
                      <tr className="border-b border-line">
                        {["Role","Type","Score","Date"].map((h)=>(
                          <th key={h} className="pb-3 text-left text-xs font-bold uppercase tracking-wide text-zinc-600">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line/50">
                      {data.recentInterviews.map((iv)=>(
                        <tr key={iv.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-3.5 pr-4 font-semibold text-white">{iv.role}</td>
                          <td className="py-3.5 pr-4 text-zinc-400">{iv.type}</td>
                          <td className="py-3.5 pr-4">
                            <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-bold ${scoreBadge(iv.score)}`}>{iv.score}%</span>
                          </td>
                          <td className="py-3.5 text-zinc-500 flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" /> {formatDate(iv.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-line bg-white/[0.02] p-8 text-center">
                  <p className="font-semibold text-zinc-500">No interviews yet</p>
                  <p className="mt-1 text-xs text-zinc-600">Start your first session to see results here.</p>
                  <Link href="/interview/start" className="mt-4 inline-block">
                    <Button size="sm" icon={<MessageSquarePlus className="h-3.5 w-3.5" />}>Start now</Button>
                  </Link>
                </div>
              )}
            </Card>
          </div>
        ) : null}
      </div>
    </main>
  );
}

function SkillList({ title, items, empty, variant }:
  { title:string; items:string[]; empty:string; variant:"good"|"warn" }) {
  const s = variant === "good"
    ? { tag:"border-emerald-500/25 bg-emerald-500/10 text-emerald-300", dot:"bg-emerald-400", head:"text-emerald-400" }
    : { tag:"border-amber-500/25  bg-amber-500/10  text-amber-300",     dot:"bg-amber-400",   head:"text-amber-400"  };
  return (
    <Card>
      <div className="mb-4 flex items-center gap-2">
        <span className={`h-2.5 w-2.5 rounded-full ${s.dot}`} />
        <h2 className={`text-sm font-bold ${s.head}`}>{title}</h2>
        {items.length > 0 && <span className="ml-auto text-xs font-semibold text-zinc-600">{items.length} items</span>}
      </div>
      {items.length
        ? <div className="flex flex-wrap gap-2">{items.map((i)=><span key={i} className={`rounded-full border px-3 py-1 text-xs font-semibold ${s.tag}`}>{i}</span>)}</div>
        : <p className="py-4 text-center text-sm text-zinc-600">{empty}</p>}
    </Card>
  );
}
