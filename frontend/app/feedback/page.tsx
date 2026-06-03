"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { RotateCcw, Trophy } from "lucide-react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { FeedbackCard } from "@/components/FeedbackCard";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Sidebar } from "@/components/Sidebar";
import { useToast } from "@/components/Toast";
import { feedbackService } from "@/services/feedback.service";
import type { FeedbackDto } from "@/types/feedback";

function ScoreRing({ score }: { score: number }) {
  const r = 52, circ = 2 * Math.PI * r, fill = (score / 100) * circ;
  const color = score >= 80 ? "#34d399" : score >= 60 ? "#fbbf24" : "#f87171";
  const label = score >= 80 ? "Excellent 🎉" : score >= 60 ? "Good job 👍" : "Keep going 💪";
  return (
    <div className="relative inline-flex flex-col items-center">
      <svg width="128" height="128" viewBox="0 0 128 128">
        <circle cx="64" cy="64" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
        <circle cx="64" cy="64" r={r} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={`${fill} ${circ}`} strokeLinecap="round" transform="rotate(-90 64 64)"
          style={{filter:`drop-shadow(0 0 8px ${color}70)`}} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-extrabold text-white">{score}%</span>
        <span className="text-[11px] font-semibold text-zinc-400">{label}</span>
      </div>
    </div>
  );
}

export default function FeedbackPage() {
  return <Suspense fallback={<Shell />}><FeedbackContent /></Suspense>;
}

function FeedbackContent() {
  const answerId = useSearchParams().get("answerId");
  const { success, info, error: toastError } = useToast();
  const [feedback, setFeedback] = useState<FeedbackDto | null>(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);

  useEffect(() => {
    if (!answerId) { setLoading(false); setError("Missing submitted answer."); return; }
    feedbackService.getFeedback(answerId)
      .then((f) => {
        setFeedback(f);
        if (f.overallScore >= 80) {
          success("Great score!", `You scored ${f.overallScore}% — excellent work.`);
        } else if (f.overallScore >= 60) {
          info("Feedback ready", `You scored ${f.overallScore}%. See your recommendations below.`);
        } else {
          toastError("Room to improve", `You scored ${f.overallScore}%. Check the tips to improve.`);
        }
      })
      .catch((e: Error) => { setError(e.message); toastError("Could not load feedback", e.message); })
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answerId]);

  return (
    <main className="min-h-screen bg-surface lg:pl-64">
      <Sidebar />
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {loading ? <LoadingSpinner label="Analysing your answer…" /> : null}
        {error && <div className="rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-sm font-medium text-red-300">{error}</div>}

        {feedback ? (
          <div className="grid gap-5 animate-fade-up">
            {/* Score header */}
            <div className="relative overflow-hidden rounded-2xl border border-violet-500/25 bg-gradient-to-br from-violet-600/20 to-indigo-600/10 p-6 shadow-glow-v backdrop-blur-sm">
              <div className="pointer-events-none absolute inset-0 dot-grid opacity-20" />
              <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                  <ScoreRing score={feedback.overallScore} />
                  <div>
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-yellow-400" />
                      <p className="text-xs font-bold uppercase tracking-widest text-violet-400">Interview feedback</p>
                    </div>
                    <h1 className="mt-1 text-2xl font-extrabold text-white">Session complete!</h1>
                    <p className="mt-1 text-sm text-zinc-400">Scored on clarity, depth, structure & relevance.</p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs">
                      {[
                        {label:`${feedback.strengths.length} strengths`,       cls:"border-emerald-500/30 bg-emerald-500/10 text-emerald-300"},
                        {label:`${feedback.weaknesses.length} weaknesses`,     cls:"border-amber-500/30  bg-amber-500/10  text-amber-300"  },
                        {label:`${feedback.recommendations.length} tips`,      cls:"border-indigo-500/30 bg-indigo-500/10 text-indigo-300" }
                      ].map(b=>(
                        <span key={b.label} className={`rounded-full border px-2.5 py-1 font-bold ${b.cls}`}>{b.label}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <Link href="/interview/start" className="shrink-0">
                  <Button variant="secondary" icon={<RotateCcw className="h-4 w-4" />}>Retry</Button>
                </Link>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <FeedbackCard title="Strengths"  items={feedback.strengths}  tone="good" />
              <FeedbackCard title="Weaknesses" items={feedback.weaknesses} tone="warn" />
            </div>

            <Card>
              <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-zinc-600">Improved answer</h2>
              <div className="rounded-xl border border-line bg-white/[0.03] p-4">
                <p className="whitespace-pre-line text-sm leading-7 text-zinc-300">
                  {feedback.improvedAnswer || "No improved answer available yet."}
                </p>
              </div>
            </Card>

            <FeedbackCard title="AI recommendations" items={feedback.recommendations} tone="info" />

            <div className="rounded-2xl border border-violet-500/25 bg-violet-500/8 p-6 text-center">
              <p className="text-lg font-extrabold text-white">Ready to improve? 🚀</p>
              <p className="mt-1.5 text-sm text-zinc-400">Practice weak areas to push your score higher.</p>
              <Link href="/interview/start" className="mt-4 inline-block">
                <Button icon={<RotateCcw className="h-4 w-4" />}>Practice again</Button>
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}

function Shell() {
  return (
    <main className="min-h-screen bg-surface lg:pl-64">
      <Sidebar />
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <LoadingSpinner label="Analysing your answer…" />
      </div>
    </main>
  );
}
