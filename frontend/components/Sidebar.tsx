"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, MessageSquarePlus, Sparkles, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard",       label: "Dashboard",    icon: BarChart3,         sub: "Overview & stats"  },
  { href: "/interview/start", label: "New Interview", icon: MessageSquarePlus, sub: "Start a session"   },
  { href: "/profile",         label: "Profile",       icon: User,              sub: "Your account"      }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="border-b border-line bg-surface/90 backdrop-blur-xl lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:border-b-0 lg:border-r">
      <div className="flex h-full flex-col p-4">

        {/* Logo */}
        <Link href="/dashboard" className="mb-8 flex items-center gap-2.5 px-2">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-glow-v">
            <Sparkles className="h-4 w-4 text-white" />
          </span>
          <div>
            <p className="text-sm font-extrabold text-gradient-subtle tracking-tight">IntervuAI</p>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600">Practice Platform</p>
          </div>
        </Link>

        <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-widest text-zinc-700">Menu</p>

        <nav className="flex gap-1 overflow-x-auto lg:grid lg:overflow-visible">
          {navItems.map((item) => {
            const Icon   = item.icon;
            const active = pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href}
                className={cn(
                  "group flex min-w-max items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-150 lg:min-w-0",
                  active
                    ? "bg-violet-600/20 text-white border-l-2 border-violet-500 pl-[10px]"
                    : "text-zinc-400 hover:bg-white/[0.06] hover:text-zinc-100"
                )}>
                <span className={cn(
                  "grid h-8 w-8 shrink-0 place-items-center rounded-lg transition-all",
                  active
                    ? "bg-violet-600/30 text-violet-300"
                    : "bg-white/[0.05] text-zinc-500 group-hover:bg-white/[0.10] group-hover:text-zinc-300"
                )}>
                  <Icon className="h-4 w-4" />
                </span>
                <div className="hidden lg:block">
                  <p className="text-sm font-semibold leading-none">{item.label}</p>
                  <p className={cn("mt-0.5 text-xs leading-none", active ? "text-violet-300/70" : "text-zinc-600")}>{item.sub}</p>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto hidden lg:block">
          <div className="rounded-xl border border-line bg-white/[0.03] p-4">
            <p className="text-xs font-semibold text-zinc-400">Ready to practice?</p>
            <p className="mt-1 text-xs leading-relaxed text-zinc-600">Start a session and get instant AI feedback on your answers.</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
