import { AnimatedCard } from "@/components/ui/AnimatedCard";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { memo } from "react";

const tones = {
  orange: "from-neutral-900 via-neutral-700 to-neutral-500 dark:from-neutral-100 dark:via-neutral-300 dark:to-neutral-500",
  purple: "from-neutral-800 to-neutral-400 dark:from-neutral-200 dark:to-neutral-600",
  cyan: "from-neutral-950 via-neutral-800 to-neutral-600 dark:from-neutral-50 dark:via-neutral-200 dark:to-neutral-400",
  green: "from-neutral-700 to-neutral-300 dark:from-neutral-300 dark:to-neutral-700",
  pink: "from-neutral-900 to-neutral-500 dark:from-neutral-100 dark:to-neutral-500"
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
