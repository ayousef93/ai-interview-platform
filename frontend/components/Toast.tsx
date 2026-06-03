"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Types ────────────────────────────────────────────── */
export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;   /* ms — default 4000, 0 = sticky */
}

interface ToastCtxValue {
  toasts: Toast[];
  toast: (opts: Omit<Toast, "id">) => void;
  success: (title: string, message?: string) => void;
  error:   (title: string, message?: string) => void;
  info:    (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  dismiss: (id: string) => void;
}

/* ── Context ──────────────────────────────────────────── */
const ToastCtx = createContext<ToastCtxValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}

/* ── Provider ─────────────────────────────────────────── */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((opts: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { ...opts, id }]);

    const duration = opts.duration ?? 4000;
    if (duration > 0) {
      setTimeout(() => dismiss(id), duration);
    }
  }, [dismiss]);

  const success = useCallback((title: string, message?: string) => toast({ type: "success", title, message }), [toast]);
  const error   = useCallback((title: string, message?: string) => toast({ type: "error",   title, message, duration: 6000 }), [toast]);
  const info    = useCallback((title: string, message?: string) => toast({ type: "info",    title, message }), [toast]);
  const warning = useCallback((title: string, message?: string) => toast({ type: "warning", title, message }), [toast]);

  return (
    <ToastCtx.Provider value={{ toasts, toast, success, error, info, warning, dismiss }}>
      {children}
      <ToastContainer toasts={toasts} dismiss={dismiss} />
    </ToastCtx.Provider>
  );
}

/* ── Styles per type ──────────────────────────────────── */
const styles: Record<ToastType, { bar: string; icon: string; bg: string; border: string; Icon: typeof CheckCircle2 }> = {
  success: { bar: "bg-emerald-500", icon: "text-emerald-400", bg: "bg-card/95", border: "border-emerald-500/25", Icon: CheckCircle2 },
  error:   { bar: "bg-red-500",     icon: "text-red-400",     bg: "bg-card/95", border: "border-red-500/25",     Icon: XCircle      },
  info:    { bar: "bg-violet-500",  icon: "text-violet-400",  bg: "bg-card/95", border: "border-violet-500/25",  Icon: Info         },
  warning: { bar: "bg-amber-500",   icon: "text-amber-400",   bg: "bg-card/95", border: "border-amber-500/25",   Icon: AlertTriangle}
};

/* ── Single toast item ────────────────────────────────── */
function ToastItem({ toast, dismiss }: { toast: Toast; dismiss: (id: string) => void }) {
  const [visible, setVisible] = useState(false);
  const s = styles[toast.type];
  const { Icon } = s;

  /* Mount animation */
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  const duration = toast.duration ?? 4000;

  /* Progress bar */
  const barRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!barRef.current || duration === 0) return;
    barRef.current.style.transition = `width ${duration}ms linear`;
    const t = setTimeout(() => { if (barRef.current) barRef.current.style.width = "0%"; }, 50);
    return () => clearTimeout(t);
  }, [duration]);

  function close() {
    setVisible(false);
    setTimeout(() => dismiss(toast.id), 300);
  }

  return (
    <div
      role="alert"
      className={cn(
        "relative w-full max-w-sm overflow-hidden rounded-2xl border backdrop-blur-sm shadow-glow",
        "transition-all duration-300 ease-out",
        s.bg, s.border,
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )}
    >
      {/* Coloured left accent bar */}
      <div className={cn("absolute left-0 inset-y-0 w-1 rounded-l-2xl", s.bar)} />

      <div className="flex items-start gap-3 px-4 py-3.5 pl-5">
        <Icon className={cn("h-5 w-5 shrink-0 mt-0.5", s.icon)} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white leading-snug">{toast.title}</p>
          {toast.message && (
            <p className="mt-0.5 text-xs text-zinc-400 leading-relaxed">{toast.message}</p>
          )}
        </div>
        <button
          onClick={close}
          className="shrink-0 rounded-lg p-1 text-zinc-600 hover:bg-white/[0.08] hover:text-zinc-300 transition-colors"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Auto-dismiss progress bar */}
      {duration > 0 && (
        <div className="h-0.5 w-full bg-white/[0.06]">
          <div ref={barRef} className={cn("h-full w-full rounded-full transition-none", s.bar, "opacity-50")} />
        </div>
      )}
    </div>
  );
}

/* ── Container (fixed, bottom-right) ─────────────────── */
function ToastContainer({ toasts, dismiss }: { toasts: Toast[]; dismiss: (id: string) => void }) {
  if (toasts.length === 0) return null;
  return (
    <div
      aria-live="polite"
      className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 items-end"
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} dismiss={dismiss} />
      ))}
    </div>
  );
}
