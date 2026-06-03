"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { WandSparkles, Briefcase, Layers, Users, Database, LineChart, Server } from "lucide-react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Sidebar } from "@/components/Sidebar";
import { useToast } from "@/components/Toast";
import { interviewService } from "@/services/interview.service";
import type { InterviewConfigDto, InterviewLevel, InterviewRole, InterviewType } from "@/types/interview";
import { useAsyncAction } from "@/hooks/useAsyncAction";
import { cn } from "@/lib/utils";

const roles: { value: InterviewRole; icon: typeof Briefcase; desc: string }[] = [
  { value:"Frontend Engineer",   icon:Layers,    desc:"React, CSS, performance"    },
  { value:"Backend Engineer",    icon:Server,    desc:"APIs, databases, systems"   },
  { value:"Full Stack Engineer", icon:Briefcase, desc:"End-to-end development"     },
  { value:"Data Scientist",      icon:Database,  desc:"ML, analysis, pipelines"    },
  { value:"Product Manager",     icon:Users,     desc:"Strategy, roadmaps, metrics"},
  { value:"DevOps Engineer",     icon:LineChart, desc:"CI/CD, infra, reliability"  }
];

const levels: { value: InterviewLevel; desc: string; emoji: string }[] = [
  { value:"Junior",    desc:"0–2 yrs", emoji:"🌱" },
  { value:"Mid-level", desc:"2–5 yrs", emoji:"⚡" },
  { value:"Senior",    desc:"5–8 yrs", emoji:"🚀" },
  { value:"Staff",     desc:"8+ yrs",  emoji:"🏆" }
];

const types: { value: InterviewType; desc: string; emoji: string }[] = [
  { value:"Behavioral",    desc:"Culture & soft skills",    emoji:"💬" },
  { value:"Technical",     desc:"Coding & problem solving", emoji:"💻" },
  { value:"System Design", desc:"Architecture & scale",     emoji:"🏗️" },
  { value:"Mixed",         desc:"All of the above",         emoji:"🎯" }
];

export default function StartInterviewPage() {
  const router = useRouter();
  const { info, error: toastError } = useToast();
  const [config, setConfig] = useState<InterviewConfigDto>({ role:"Frontend Engineer", level:"Mid-level", type:"Technical" });
  const { run, loading, error } = useAsyncAction(interviewService.startInterview);

  async function onSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    try {
      info("Generating questions…", `Creating a ${config.type} session for ${config.role}`);
      const s = await run(config);
      router.push(`/interview/session?sessionId=${s.id}`);
    } catch {
      toastError("Failed to start session", error || "Could not generate questions. Please try again.");
    }
  }

  const tile = (active: boolean) => cn(
    "flex flex-col items-start gap-2 rounded-xl border p-3 text-left transition-all duration-150 cursor-pointer",
    active
      ? "border-violet-500/50 bg-violet-500/15 shadow-glow-v"
      : "border-line bg-white/[0.03] hover:border-white/[0.18] hover:bg-white/[0.06]"
  );

  const tileCenter = (active: boolean) => cn(
    "flex flex-col items-center gap-1 rounded-xl border p-4 text-center transition-all duration-150 cursor-pointer",
    active
      ? "border-violet-500/50 bg-violet-500/15 shadow-glow-v"
      : "border-line bg-white/[0.03] hover:border-white/[0.18] hover:bg-white/[0.06]"
  );

  return (
    <main className="min-h-screen bg-surface lg:pl-64">
      <Sidebar />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 animate-fade-up">
          <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-violet-300">New Interview</span>
          <h1 className="mt-3 text-2xl font-extrabold text-white md:text-3xl">Configure your session</h1>
          <p className="mt-2 text-sm text-zinc-400">Choose your role, level, and type to generate tailored questions.</p>
        </div>

        <form className="grid gap-5 animate-fade-up [animation-delay:80ms]" onSubmit={onSubmit}>
          {/* Role */}
          <Card padding="sm">
            <p className="mb-3 px-1 text-sm font-bold text-white">Role</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {roles.map(({ value, icon: Icon, desc }) => {
                const active = config.role === value;
                return (
                  <button key={value} type="button" onClick={() => setConfig((p) => ({ ...p, role: value }))} className={tile(active)}>
                    <span className={cn("rounded-lg p-1.5", active ? "bg-violet-500/25 text-violet-300" : "bg-white/[0.06] text-zinc-500")}>
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className={cn("text-xs font-bold leading-tight", active ? "text-violet-200" : "text-zinc-300")}>{value}</span>
                    <span className="text-[11px] leading-tight text-zinc-600">{desc}</span>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Level + Type side by side */}
          <div className="grid gap-5 lg:grid-cols-2">
            <Card padding="sm">
              <p className="mb-3 px-1 text-sm font-bold text-white">Seniority level</p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                {levels.map(({ value, desc, emoji }) => {
                  const active = config.level === value;
                  return (
                    <button key={value} type="button" onClick={() => setConfig((p) => ({ ...p, level: value }))} className={tileCenter(active)}>
                      <span className="text-2xl">{emoji}</span>
                      <span className={cn("text-sm font-bold", active ? "text-violet-200" : "text-zinc-300")}>{value}</span>
                      <span className="text-[11px] text-zinc-600">{desc}</span>
                    </button>
                  );
                })}
              </div>
            </Card>

            <Card padding="sm">
              <p className="mb-3 px-1 text-sm font-bold text-white">Interview type</p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                {types.map(({ value, desc, emoji }) => {
                  const active = config.type === value;
                  return (
                    <button key={value} type="button" onClick={() => setConfig((p) => ({ ...p, type: value }))} className={tileCenter(active)}>
                      <span className="text-2xl">{emoji}</span>
                      <span className={cn("text-sm font-bold", active ? "text-violet-200" : "text-zinc-300")}>{value}</span>
                      <span className="text-[11px] text-zinc-600">{desc}</span>
                    </button>
                  );
                })}
              </div>
            </Card>
          </div>

          {error && <div className="rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-sm font-medium text-red-300">{error}</div>}
          <Button loading={loading} size="lg" icon={<WandSparkles className="h-4 w-4" />}>Generate questions</Button>
        </form>
      </div>
    </main>
  );
}
