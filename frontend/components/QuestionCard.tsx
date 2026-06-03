import type { InterviewQuestionDto } from "@/types/interview";

export function QuestionCard({ question, index, total }:
  { question: InterviewQuestionDto; index: number; total: number }) {
  return (
    <div className="rounded-2xl border border-violet-500/25 bg-gradient-to-br from-violet-600/15 to-indigo-600/10 p-6 shadow-glow-v backdrop-blur-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="rounded-full border border-white/[0.12] bg-white/[0.08] px-3 py-1 text-xs font-bold uppercase tracking-wide text-zinc-300">
          Question {index + 1} / {total}
        </span>
        <span className="rounded-full border border-violet-500/30 bg-violet-500/15 px-3 py-1 text-xs font-bold uppercase tracking-wide text-violet-300">
          {question.category}
        </span>
      </div>
      <h1 className="mt-5 text-2xl font-bold leading-snug text-white md:text-3xl">{question.prompt}</h1>
    </div>
  );
}
