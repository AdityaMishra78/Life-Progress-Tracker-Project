import { AnimatedCard } from "@/components/ui/AnimatedCard";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { memo } from "react";

const tones = {
  orange: "from-orange-500 to-amber-400",
  purple: "from-violet-500 to-fuchsia-400",
  cyan: "from-cyan-500 to-blue-400",
  green: "from-emerald-500 to-lime-400",
  pink: "from-pink-500 to-rose-400"
};

export const StatCard = memo(function StatCard({
  title,
  value,
  icon: Icon,
  tone
}: {
  title: string;
  value: string | number;
  icon: LucideIcon;
  tone: keyof typeof tones;
}) {
  return (
    <AnimatedCard>
      <div
        className={cn(
            "mb-5 flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg",
            tones[tone]
          )}
      >
        <Icon />
      </div>
      <p className="text-sm text-muted">{title}</p>
      <p className="mt-1 text-3xl font-black tracking-tight">{value}</p>
    </AnimatedCard>
  );
});
