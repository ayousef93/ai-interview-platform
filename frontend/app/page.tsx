import Link from "next/link";
import {
  ArrowRight, Check, Clock, MessageSquareText, ShieldCheck,
  Sparkles, Target, Star, Zap, Trophy, BarChart3
} from "lucide-react";
import { Button } from "@/components/Button";
import { Navbar } from "@/components/Navbar";

const features = [
  { icon: MessageSquareText, title: "Adaptive questions",  text: "Role-specific loops matching your seniority, stack, and focus area.",           bg:"bg-violet-500/10", border:"border-violet-500/20", ic:"text-violet-400" },
  { icon: Target,            title: "Actionable feedback", text: "Strengths, weak spots, improved answers, and concrete next steps every session.", bg:"bg-indigo-500/10", border:"border-indigo-500/20", ic:"text-indigo-400" },
  { icon: ShieldCheck,       title: "Secure & private",    text: "HttpOnly JWT cookies, credentialed API requests, zero third-party tracking.",     bg:"bg-teal-500/10",   border:"border-teal-500/20",   ic:"text-teal-400"   }
];

const steps = [
  { label:"Choose a role and interview style",       icon: Target    },
  { label:"Answer timed AI-generated questions",     icon: Clock     },
  { label:"Review scores and improve with coaching", icon: BarChart3 }
];

const testimonials = [
  { name:"Maya A.",   role:"Frontend Engineer", quote:"The feedback felt specific enough to change how I structured every answer."         },
  { name:"Daniel K.", role:"Backend Engineer",  quote:"I used it before two onsites and finally stopped rambling through system design."   },
  { name:"Sara N.",   role:"Product Manager",   quote:"The behavioral practice was direct and surprisingly close to real interviews."       }
];

const plans = [
  { name:"Free", price:"$0",  features:["3 sessions/month","Basic AI feedback","Dashboard history"],                             cta:"Get started free", hot:false },
  { name:"Pro",  price:"$19", features:["Unlimited sessions","Deep AI recommendations","Advanced analytics","Priority support"], cta:"Start Pro",        hot:true  }
];

export default function LandingPage() {
  return (
    <main className="overflow-x-hidden bg-surface">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line">
        <div className="pointer-events-none absolute inset-0 dot-grid" />
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-violet-600/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl gap-14 px-4 pb-20 pt-16 sm:px-6 md:pt-24 lg:grid-cols-2 lg:px-8">
          <div className="flex flex-col justify-center animate-fade-up">
            <span className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3.5 py-1.5 text-sm font-semibold text-violet-300">
              <Sparkles className="h-3.5 w-3.5" />
              AI interview practice for serious candidates
            </span>
            <h1 className="text-5xl font-extrabold leading-[1.08] tracking-tight text-white md:text-6xl lg:text-[68px]">
              Practice sharper.{" "}
              <span className="text-gradient">Interview calmer.</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-8 text-zinc-400">
              Rehearse realistic sessions, submit answers, and get structured AI coaching — built for engineers and PMs who take preparation seriously.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/register"><Button size="lg" icon={<ArrowRight className="h-4 w-4" />}>Start free</Button></Link>
              <Link href="/login"><Button size="lg" variant="secondary">Sign in</Button></Link>
            </div>
            <div className="mt-7 flex flex-wrap gap-5 text-sm text-zinc-500">
              {["No credit card required","Free tier","Cancel anytime"].map((t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-teal-400" /> {t}
                </span>
              ))}
            </div>
          </div>

          {/* Mock card */}
          <div className="animate-fade-up [animation-delay:180ms]">
            <div className="rounded-2xl border border-violet-500/20 bg-card/80 p-3 shadow-glow-v backdrop-blur-sm">
              <div className="mb-3 flex items-center gap-1.5 rounded-lg bg-white/[0.04] px-3 py-2">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/60" />
                <span className="ml-3 text-xs text-zinc-600">app.intervuai.com/session</span>
              </div>
              <div className="rounded-xl border border-line bg-black/30 p-4">
                <div className="mb-4 flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm font-semibold text-zinc-300">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse2" /> Live session
                  </span>
                  <span className="flex items-center gap-1.5 rounded-lg border border-violet-500/25 bg-violet-500/10 px-2.5 py-1 text-sm font-mono font-bold text-violet-300">
                    <Clock className="h-3.5 w-3.5" /> 06:42
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.07]">
                    <div className="h-full w-3/5 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500" />
                  </div>
                  <span className="text-xs font-bold text-zinc-600">3/5</span>
                </div>
                <div className="mt-4 rounded-xl border border-violet-500/20 bg-violet-500/8 p-4">
                  <span className="rounded-full border border-violet-500/30 bg-violet-500/15 px-2.5 py-0.5 text-xs font-bold text-violet-300">System Design</span>
                  <p className="mt-3 font-bold leading-snug text-white">Design a reliable notification service for a high-growth SaaS product.</p>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {["Clarify requirements","Discuss tradeoffs","Observability","Failure handling"].map((t) => (
                    <div key={t} className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/8 p-2 text-xs font-semibold text-emerald-300">
                      <Check className="h-3.5 w-3.5 shrink-0" /> {t}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-3 flex justify-end">
              <div className="flex items-center gap-2 rounded-full border border-teal-500/25 bg-teal-500/10 px-3 py-1.5 text-xs font-bold text-teal-300">
                <Zap className="h-3.5 w-3.5" /> AI scoring in real-time
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-b border-line py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-violet-300">Features</span>
            <h2 className="mt-4 text-3xl font-extrabold text-white">Everything you need to prepare</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="card-lift rounded-2xl border border-line bg-card/80 p-6 shadow-glow backdrop-blur-sm">
                  <div className={`mb-4 inline-grid h-11 w-11 place-items-center rounded-xl border ${f.bg} ${f.border} ${f.ic}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-white">{f.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-400">{f.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-b border-line py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-violet-300">How it works</span>
              <h2 className="mt-4 text-3xl font-extrabold text-white">A focused loop from practice to improvement.</h2>
              <p className="mt-3 text-zinc-400">Three steps that turn raw practice into measurable progress.</p>
            </div>
            <div className="grid gap-3">
              {steps.map((s, i) => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="flex gap-4 rounded-2xl border border-line bg-card/80 p-4 shadow-glow backdrop-blur-sm card-lift">
                    <div className="flex shrink-0 flex-col items-center gap-2">
                      <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-sm font-extrabold text-white shadow-glow-v">{i+1}</span>
                      {i < steps.length-1 && <div className="h-full w-px bg-line" />}
                    </div>
                    <div className="flex items-center gap-2 py-1">
                      <Icon className="h-4 w-4 shrink-0 text-violet-400" />
                      <p className="font-semibold text-white">{s.label}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="border-b border-line py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-violet-300">Stories</span>
            <h2 className="mt-4 text-3xl font-extrabold text-white">What candidates say</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.name} className="flex flex-col gap-4 rounded-2xl border border-line bg-card/80 p-6 shadow-glow backdrop-blur-sm">
                <div className="flex gap-0.5">{Array.from({length:5}).map((_,i)=><Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />)}</div>
                <p className="flex-1 text-sm leading-7 text-zinc-400">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3 border-t border-line pt-4">
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-sm font-extrabold text-white">{t.name[0]}</div>
                  <div>
                    <p className="text-sm font-bold text-white">{t.name}</p>
                    <p className="text-xs text-zinc-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-b border-line py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-violet-300">Pricing</span>
            <h2 className="mt-4 text-3xl font-extrabold text-white">Simple, transparent pricing</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {plans.map((p) => (
              <div key={p.name} className={p.hot
                ? "relative rounded-2xl border-2 border-violet-500/50 bg-gradient-to-br from-violet-600/20 to-indigo-600/10 p-6 shadow-glow-v backdrop-blur-sm"
                : "rounded-2xl border border-line bg-card/80 p-6 shadow-glow backdrop-blur-sm"}>
                {p.hot && <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-1 text-xs font-extrabold text-white shadow-glow-v">Most popular</span>}
                <p className="text-base font-bold text-white">{p.name}</p>
                <div className="mt-2 flex items-end gap-1">
                  <span className="text-4xl font-extrabold text-white">{p.price}</span>
                  <span className="mb-1 text-sm text-zinc-500">/mo</span>
                </div>
                <ul className="mt-5 grid gap-2.5">
                  {p.features.map((f)=>(
                    <li key={f} className="flex items-center gap-2.5 text-sm text-zinc-400">
                      <Check className="h-4 w-4 shrink-0 text-violet-400" /> {f}
                    </li>
                  ))}
                </ul>
                <Link href="/register" className="mt-6 block">
                  <Button className="w-full" variant={p.hot ? "primary" : "secondary"} icon={<ArrowRight className="h-4 w-4" />}>{p.cta}</Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden py-16">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-600/20 via-indigo-600/10 to-transparent" />
        <div className="pointer-events-none absolute inset-0 dot-grid opacity-30" />
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <Trophy className="mx-auto mb-4 h-10 w-10 text-yellow-400 animate-float" />
          <h2 className="text-3xl font-extrabold text-white md:text-4xl">Ready to interview with confidence?</h2>
          <p className="mx-auto mt-4 max-w-lg text-zinc-400">Join candidates who practice smarter. Start free — no credit card required.</p>
          <div className="mt-8 flex justify-center">
            <Link href="/register"><Button size="lg" icon={<ArrowRight className="h-4 w-4" />}>Start free today</Button></Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-line px-4 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-2 sm:flex-row sm:justify-between text-sm text-zinc-600">
          <span className="flex items-center gap-2 font-bold text-zinc-400"><Sparkles className="h-4 w-4 text-violet-500" /> IntervuAI</span>
          <span>© 2026 IntervuAI — Built for focused interview preparation.</span>
        </div>
      </footer>
    </main>
  );
}
