"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogIn, Sparkles, UserPlus } from "lucide-react";
import { Button } from "@/components/Button";
import { cn } from "@/lib/utils";

const links = [
  { href: "/#features",     label: "Features"  },
  { href: "/#pricing",      label: "Pricing"   },
  { href: "/#testimonials", label: "Stories"   }
];

export function Navbar() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-glow-v">
            <Sparkles className="h-4 w-4 text-white" />
          </span>
          <span className="text-lg font-extrabold text-gradient-subtle">IntervuAI</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium text-zinc-400 transition-colors hover:bg-white/[0.07] hover:text-white",
                pathname === l.href && "bg-white/[0.07] text-white"
              )}>
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link href="/login">
            <Button variant="ghost" size="sm" icon={<LogIn className="h-4 w-4" />}>Login</Button>
          </Link>
          <Link href="/register" className="hidden sm:block">
            <Button size="sm" icon={<UserPlus className="h-4 w-4" />}>Register</Button>
          </Link>
        </div>
      </nav>
    </header>
  );
}
