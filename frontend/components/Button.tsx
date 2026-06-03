import { Loader2 } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "white";
type Size    = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  loading?: boolean;
  icon?: ReactNode;
  size?: Size;
}

const variants: Record<Variant, string> = {
  primary:   "bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500 shadow-btn",
  secondary: "border border-white/[0.14] bg-white/[0.07] text-white hover:bg-white/[0.12] hover:border-white/[0.22]",
  ghost:     "text-zinc-300 hover:bg-white/[0.08] hover:text-white",
  danger:    "border border-red-400/30 bg-red-500/10 text-red-300 hover:bg-red-500/20 hover:border-red-400/50",
  white:     "bg-white text-violet-700 font-bold border-2 border-white/40 hover:bg-violet-50 shadow-md"
};

const sizes: Record<Size, string> = {
  sm: "h-9  px-3.5 text-sm  gap-1.5 rounded-lg",
  md: "h-10 px-4   text-sm  gap-2   rounded-xl",
  lg: "h-11 px-5   text-sm  gap-2   rounded-xl"
};

export function Button({
  className, variant = "primary", loading, icon, size = "md",
  children, disabled, ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "focus-ring inline-flex items-center justify-center font-semibold",
        "transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.97]",
        variants[variant], sizes[size], className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading
        ? <Loader2 className="h-4 w-4 animate-spin shrink-0" />
        : icon ? <span className="shrink-0">{icon}</span> : null}
      {children}
    </button>
  );
}
