import { CheckCircle2, Lightbulb, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const tones = {
  good: {
    Icon:    CheckCircle2,
    header:  "bg-emerald-500/10 border-emerald-500/20 text-emerald-300",
    iconCls: "text-emerald-400",
    badge:   "bg-emerald-500/15 text-emerald-300",
    item:    "bg-emerald-500/8  border-emerald-500/15 text-emerald-200",
    dot:     "bg-emerald-400"
  },
  warn: {
    Icon:    XCircle,
    header:  "bg-amber-500/10   border-amber-500/20   text-amber-300",
    iconCls: "text-amber-400",
    badge:   "bg-amber-500/15   text-amber-300",
    item:    "bg-amber-500/8    border-amber-500/15   text-amber-200",
    dot:     "bg-amber-400"
  },
  info: {
    Icon:    Lightbulb,
    header:  "bg-indigo-500/10  border-indigo-500/20  text-indigo-300",
    iconCls: "text-indigo-400",
    badge:   "bg-indigo-500/15  text-indigo-300",
    item:    "bg-indigo-500/8   border-indigo-500/15  text-indigo-200",
    dot:     "bg-indigo-400"
  }
};

export function FeedbackCard({ title, items, tone = "info" }:
  { title: string; items: string[]; tone?: "good" | "warn" | "info" }) {
  const t = tones[tone];
  const { Icon } = t;
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-card/80 shadow-glow backdrop-blur-sm">
      <div className={cn("flex items-center gap-3 border-b px-5 py-4", t.header)}>
        <Icon className={cn("h-4 w-4 shrink-0", t.iconCls)} />
        <h2 className="text-sm font-bold">{title}</h2>
        {items.length > 0 && (
          <span className={cn("ml-auto rounded-full px-2.5 py-0.5 text-xs font-bold", t.badge)}>{items.length}</span>
        )}
      </div>
      <div className="p-5">
        {items.length ? (
          <ul className="grid gap-2">
            {items.map((item, i) => (
              <li key={i} className={cn("flex items-start gap-3 rounded-xl border p-3 text-sm leading-relaxed", t.item)}>
                <span className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", t.dot)} />
                {item}
              </li>
            ))}
          </ul>
        ) : (
          <p className="py-6 text-center text-sm text-zinc-600">No feedback available yet.</p>
        )}
      </div>
    </div>
  );
}
