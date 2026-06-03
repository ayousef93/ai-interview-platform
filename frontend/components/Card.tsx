import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: "sm" | "md" | "lg";
}

const pads = { sm: "p-4", md: "p-5 sm:p-6", lg: "p-6 sm:p-8" };

export function Card({ className, padding = "md", ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-line bg-card/80 backdrop-blur-sm shadow-glow",
        pads[padding],
        className
      )}
      {...props}
    />
  );
}
