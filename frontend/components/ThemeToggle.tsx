"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const dark = theme === "dark";

  return (
    <button
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "focus-ring relative flex h-8 w-14 items-center rounded-full border transition-all duration-300",
        dark
          ? "border-slate-600 bg-slate-700"
          : "border-slate-300 bg-slate-100",
        className
      )}
    >
      {/* Track icons */}
      <Sun  className="absolute left-1.5 h-4 w-4 text-amber-500" />
      <Moon className="absolute right-1.5 h-4 w-4 text-slate-400 dark:text-indigo-300" />

      {/* Thumb */}
      <span className={cn(
        "absolute h-6 w-6 rounded-full shadow-sm transition-all duration-300",
        dark
          ? "translate-x-7 bg-indigo-500"
          : "translate-x-1 bg-white border border-slate-200"
      )} />
    </button>
  );
}
