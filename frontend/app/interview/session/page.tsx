"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { ArrowRight, Send, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { QuestionCard } from "@/components/QuestionCard";
import { Sidebar } from "@/components/Sidebar";
import { useToast } from "@/components/Toast";
import { answerService } from "@/services/answer.service";
import { interviewService } from "@/services/interview.service";
import type { InterviewSessionDto } from "@/types/interview";
import { cn } from "@/lib/utils";

export default function InterviewSessionPage() {
  return <Suspense fallback={<Shell />}><SessionContent /></Suspense>;
}

function SessionContent() {
  const router    = useRouter();
  const params    = useSearchParams();
  const sessionId = params.get("sessionId");
  const { success, warning, error: toastError, info } = useToast();

  const [session,    setSession]    = useState<InterviewSessionDto | null>(null);
  const [idx,        setIdx]        = useState(0);
  const [answer,     setAnswer]     = useState("");
  const [seconds,    setSeconds]    = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted,  setSubmitted]  = useState(false);
  const [lastId,     setLastId]     = useState<string | null>(null);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState<string | null>(null);

  const question = session?.questions[idx];
  const total    = session?.questions.length ?? 0;
  const progress = useMemo(() => !total ? 0 : Math.round(((idx + (submitted ? 1 : 0)) / total) * 100), [idx, submitted, total]);

  useEffect(() => {
    if (!sessionId) { setLoading(false); setError("Missing interview session."); return; }
    interviewService.getSession(sessionId)
      .then((s) => {
        setSession(s);
        info("Session loaded", `${s.questions.length} questions ready — good luck!`);
      })
      .catch((e: Error) => { setError(e.message); toastError("Failed to load session", e.message); })
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  useEffect(() => {
    const t = setInterval(() => setSeconds((v) => v + 1), 1000);
    return () => clearInterval(t);
  }, [idx]);

  /* Warn when time is running long */
  useEffect(() => {
    if (seconds === 120) warning("Time check", "You've been on this question for 2 minutes.");
  }, [seconds, warning]);

  async function submitAnswer() {
    if (!sessionId || !question || !answer.trim()) {
      toastError("Empty answer", "Write your answer before submitting.");
      setError("Write an answer before submitting.");
      return;
    }
    setSubmitting(true); setError(null);
    try {
      const r = await answerService.submitAnswer({ sessionId, questionId:question.id, answer, timeSpentSeconds:seconds });
      setLastId(r.answerId);
      setSubmitted(true);
      success("Answer submitted", "Your response has been recorded.");
    } catch(e) {
      const msg = e instanceof Error ? e.message : "Unable to submit.";
      setError(msg);
      toastError("Submission failed", msg);
    } finally {
      setSubmitting(false);
    }
  }

  function next() {
    if (!session) return;
    if (idx + 1 >= total) {
      if (!lastId) { toastError("Not submitted", "Submit your final answer first."); return; }
      router.push(`/feedback?answerId=${lastId}`);
      return;
    }
    setIdx((v) => v + 1); setAnswer(""); setSeconds(0); setSubmitted(false); setLastId(null); setError(null);
  }

  const words  = answer.trim().split(/\s+/).filter(Boolean).length;
  const isLast = total > 0 && idx + 1 >= total;
  const options = question?.options ?? [];
  const isMultipleChoice = options.length > 0;

  return (
    <main className="min-h-screen bg-surface lg:pl-64">
      <Sidebar />
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {loading ? <LoadingSpinner label="Loading interview" /> : null}
        {error && (
          <div className="mb-4 rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-sm font-medium text-red-300">{error}</div>
        )}

        {!loading && !session ? (
          <Card>
            <p className="text-zinc-400">No session found.</p>
            <Link href="/interview/start" className="mt-4 inline-block"><Button>Start Interview</Button></Link>
          </Card>
        ) : null}

        {session && question ? (
          <div className="grid gap-5 animate-fade-up">
            {/* Progress bar */}
            <div className="flex items-center gap-3 rounded-2xl border border-line bg-card/80 px-4 py-3 shadow-glow backdrop-blur-sm">
              <span className="shrink-0 text-xs font-bold text-zinc-500">{idx+1}/{total}</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/[0.07]">
                <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-500" style={{width:`${progress}%`}} />
              </div>
              <span className="shrink-0 text-xs font-bold text-violet-400">{progress}%</span>
              <div className={cn(
                "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-mono text-sm font-bold tabular-nums",
                seconds > 120
                  ? "border border-amber-500/30 bg-amber-500/10 text-amber-300"
                  : "border border-violet-500/25 bg-violet-500/10 text-violet-300"
              )}>
                <Clock className="h-3.5 w-3.5" /> {fmt(seconds)}
              </div>
            </div>

            <QuestionCard question={question} index={idx} total={total} />

            <Card>
              <div className="mb-3 flex items-center justify-between">
                <label htmlFor="answer" className="text-sm font-bold text-zinc-200">
                  {isMultipleChoice ? "Select an answer" : "Your answer"}
                </label>
                {submitted && (
                  <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-300">
                    <CheckCircle2 className="h-3 w-3" /> Submitted
                  </span>
                )}
              </div>
              {isMultipleChoice ? (
                <div className="grid gap-2.5">
                  {options.map((option, i) => {
                    const selected = answer === option;
                    return (
                      <button
                        key={i}
                        type="button"
                        disabled={submitted}
                        onClick={() => setAnswer(option)}
                        className={cn(
                          "focus-ring flex w-full items-center gap-3 rounded-xl border p-4 text-left text-sm transition-colors",
                          submitted ? "cursor-not-allowed" : "hover:border-white/[0.18] hover:bg-white/[0.07]",
                          selected
                            ? "border-violet-500/50 bg-violet-500/10 text-white"
                            : "border-line bg-white/[0.05] text-zinc-200"
                        )}
                      >
                        <span className={cn(
                          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold",
                          selected ? "border-violet-400 bg-violet-500 text-white" : "border-white/20 text-zinc-400"
                        )}>
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span>{option}</span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <textarea
                  id="answer"
                  className={cn(
                    "focus-ring w-full min-h-52 resize-y rounded-xl border p-4 text-sm text-white placeholder:text-zinc-600 transition-colors",
                    submitted
                      ? "border-emerald-500/30 bg-emerald-500/5 cursor-not-allowed"
                      : "border-line bg-white/[0.05] hover:border-white/[0.18] hover:bg-white/[0.07]"
                  )}
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Structure your response clearly — mention context, tradeoffs, and outcomes where relevant."
                  disabled={submitted}
                />
              )}
              <div className="mt-4 flex items-center justify-between gap-3">
                <span className="text-xs text-zinc-600">
                  {isMultipleChoice
                    ? (answer ? "Answer selected" : "No answer selected")
                    : `${words} word${words !== 1 ? "s" : ""}`}
                </span>
                <div className="flex gap-2">
                  <Button variant="secondary" loading={submitting} disabled={submitted || !answer.trim()} icon={<Send className="h-4 w-4" />} onClick={submitAnswer}>
                    Submit answer
                  </Button>
                  <Button disabled={!submitted} icon={<ArrowRight className="h-4 w-4" />} onClick={next}>
                    {isLast ? "View feedback" : "Next question"}
                  </Button>
                </div>
              </div>
            </Card>

            <div className="flex justify-center gap-1.5">
              {session.questions.map((_, i) => (
                <div key={i} className={cn("h-2 rounded-full transition-all duration-300",
                  i < idx ? "w-4 bg-violet-500" : i === idx ? "w-7 bg-violet-400" : "w-2 bg-white/[0.10]")} />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}

const fmt = (s: number) => `${Math.floor(s/60).toString().padStart(2,"0")}:${(s%60).toString().padStart(2,"0")}`;

function Shell() {
  return (
    <main className="min-h-screen bg-surface lg:pl-64">
      <Sidebar />
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <LoadingSpinner label="Loading interview" />
      </div>
    </main>
  );
}
