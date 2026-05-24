import Link from "next/link";
import {
  Activity,
  BarChart3,
  Brain,
  CheckSquare,
  Dumbbell,
  Home,
  Sparkles,
  Target,
  History
} from "lucide-react";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/dashboard/study", label: "Study", icon: Brain },
  { href: "/dashboard/workouts", label: "Workouts", icon: Dumbbell },
  { href: "/dashboard/habits", label: "Habits", icon: CheckSquare },
  { href: "/dashboard/skills", label: "Skills", icon: Sparkles },
  { href: "/dashboard/goals", label: "Goals", icon: Target },
  { href: "/dashboard/history", label: "History", icon: History },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 }
];

export function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-r border-border/60 p-4 lg:block">
      <Link href="/dashboard" className="mb-8 flex items-center gap-3 px-2">
        <div className="flex size-11 items-center justify-center rounded-2xl bg-primary text-white shadow-glow">
          <Activity />
        </div>
        <div>
          <div className="font-black">LifeTrack</div>
          <div className="text-xs text-muted">Level up your life</div>
        </div>
      </Link>

      <nav className="space-y-2">
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-muted transition hover:bg-card/80 hover:text-foreground"
          >
            <item.icon className="size-5 transition group-hover:text-primary" />
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
