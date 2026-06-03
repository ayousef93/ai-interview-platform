import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export function Input({ label, error, hint, className, id, ...props }: InputProps) {
  const inputId = id || props.name || label.toLowerCase().replaceAll(" ", "-");
  return (
    <div className="grid gap-1.5">
      <label htmlFor={inputId} className="text-sm font-semibold text-zinc-300">
        {label}
      </label>
      <input
        id={inputId}
        className={cn(
          "focus-ring h-11 w-full rounded-xl border bg-white/[0.05] px-4 text-sm text-white",
          "placeholder:text-zinc-600 transition-colors",
          "hover:bg-white/[0.08] hover:border-white/[0.18]",
          error
            ? "border-red-400/50 bg-red-500/5"
            : "border-line",
          className
        )}
        {...props}
      />
      {error
        ? <p className="text-xs font-medium text-red-400">{error}</p>
        : hint
          ? <p className="text-xs text-zinc-600">{hint}</p>
          : null}
    </div>
  );
}
