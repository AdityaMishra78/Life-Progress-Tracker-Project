import Link from "next/link";
import { BarChart3, Brain, Dumbbell, Home, Target } from "lucide-react";

const nav = [
  { href: "/dashboard", icon: Home, label: "Home" },
  { href: "/dashboard/study", icon: Brain, label: "Study" },
  { href: "/dashboard/workouts", icon: Dumbbell, label: "Gym" },
  { href: "/dashboard/goals", icon: Target, label: "Goals" },
  { href: "/dashboard/analytics", icon: BarChart3, label: "Stats" }
];

export function MobileNav() {
  return (
    <nav className="fixed inset-x-3 bottom-3 z-30 grid grid-cols-5 rounded-3xl border border-border bg-card/90 p-2 shadow-2xl backdrop-blur-xl lg:hidden">
      {nav.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="flex flex-col items-center justify-center rounded-2xl py-2 text-xs text-muted hover:bg-primary/10 hover:text-primary"
        >
          <item.icon className="mb-1 size-5" />
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
