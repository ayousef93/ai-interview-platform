import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  detail?: string;
  icon?: ReactNode;
  accent?: "violet" | "indigo" | "teal" | "rose";
}

const accents = {
  violet: { icon: "bg-violet-500/15 text-violet-300 border-violet-500/25", top: "border-t-violet-500" },
  indigo: { icon: "bg-indigo-500/15 text-indigo-300 border-indigo-500/25", top: "border-t-indigo-500" },
  teal:   { icon: "bg-teal-500/15   text-teal-300   border-teal-500/25",   top: "border-t-teal-500"   },
  rose:   { icon: "bg-rose-500/15   text-rose-300   border-rose-500/25",   top: "border-t-rose-500"   }
};

export function StatCard({ label, value, detail, icon, accent = "violet" }: StatCardProps) {
  const a = accents[accent];
  return (
    <div className={cn("rounded-2xl border-t-4 border border-line bg-card/80 p-5 backdrop-blur-sm shadow-glow card-lift", a.top)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-zinc-500">{label}</p>
          <p className="mt-1.5 text-3xl font-extrabold text-white">{value}</p>
          {detail && <p className="mt-1 text-xs font-medium text-zinc-600">{detail}</p>}
        </div>
        {icon && (
          <div className={cn("rounded-xl border p-2.5 shrink-0 mt-0.5", a.icon)}>{icon}</div>
        )}
      </div>
    </div>
  );
}
