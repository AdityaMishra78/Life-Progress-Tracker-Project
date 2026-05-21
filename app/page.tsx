import Link from "next/link";
import { Button } from "@/components/ui/Button";
import {
  Activity,
  BarChart3,
  Brain,
  CheckSquare,
  Dumbbell,
  Sparkles,
  Target,
  Zap
} from "lucide-react";

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <div className="absolute inset-0 -z-10 bg-aurora" />
        <div className="flex size-20 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-500 to-cyan-500 text-white shadow-glow">
          <Activity size={36} />
        </div>
        <h1 className="mt-8 max-w-3xl bg-gradient-to-r from-violet-600 via-cyan-600 to-emerald-600 bg-clip-text text-6xl font-black tracking-tight text-transparent sm:text-7xl">
          Level Up Your Life
        </h1>
        <p className="mt-6 max-w-xl text-lg text-muted">
          Track study, workouts, habits, skills, and goals all in one place.
          Gamify your progress and build unstoppable momentum.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link href="/dashboard">
            <Button size="lg">Get started free</Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="secondary" size="lg">
              Explore dashboard
            </Button>
          </Link>
        </div>

        {/* Feature cards */}
        <div className="mt-20 grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: Brain, label: "Study tracker" },
            { icon: Dumbbell, label: "Workout logs" },
            { icon: CheckSquare, label: "Habit tracking" },
            { icon: Sparkles, label: "Skill progress" },
            { icon: Target, label: "Goal management" },
            { icon: BarChart3, label: "Analytics insights" }
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-3 rounded-2xl border border-border/50 bg-card/50 p-4"
            >
              <Icon className="size-5 text-primary" />
              <span className="font-medium">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-border/50 bg-card/30 px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-3xl font-black">How it works</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Set your targets",
                desc: "Define study hours, workout goals, habits to build, and skills to master."
              },
              {
                step: "02",
                title: "Log daily progress",
                desc: "Track every study session, workout, habit check-in, and skill hour logged."
              },
              {
                step: "03",
                title: "Level up & analyze",
                desc: "Earn XP, watch streaks grow, and see your productivity improve over time."
              }
            ].map(({ step, title, desc }) => (
              <div key={step} className="rounded-3xl border border-border/60 bg-card p-6">
                <div className="text-4xl font-black text-primary/30">{step}</div>
                <h3 className="mt-4 text-xl font-bold">{title}</h3>
                <p className="mt-2 text-sm text-muted">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 text-center">
        <div className="mx-auto max-w-2xl rounded-3xl bg-gradient-to-br from-violet-500/20 to-cyan-500/10 p-10">
          <Zap className="mx-auto size-12 text-primary" />
          <h2 className="mt-6 text-3xl font-black">
            Ready to track your progress?
          </h2>
          <p className="mt-4 text-muted">
            Start building better habits and achieving your goals today.
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="mt-8">Start your journey</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 px-6 py-8 text-center text-sm text-muted">
        &copy; {new Date().getFullYear()} LifeTrack. Built to help you level up.
      </footer>
    </main>
  );
}
