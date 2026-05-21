import { AnimatedCard } from "@/components/ui/AnimatedCard";
import { Trophy } from "lucide-react";

export function GamificationPanel({
  level,
  xp,
  nextLevelXp
}: {
  level: number;
  xp: number;
  nextLevelXp: number;
}) {
  const progress = Math.min(100, Math.round((xp / nextLevelXp) * 100));

  return (
    <AnimatedCard>
      <div className="flex items-center gap-3">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-yellow-400/15 text-yellow-400">
          <Trophy />
        </div>
        <div>
          <h2 className="text-xl font-black">Level {level}</h2>
          <p className="text-sm text-muted">{xp} XP earned</p>
        </div>
      </div>

      <div className="mt-6">
        <div className="mb-2 flex justify-between text-sm">
          <span>Next level</span>
          <span>{progress}%</span>
        </div>
        <div className="h-3 rounded-full bg-muted/15">
          <div
            className="h-full rounded-full bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-2 text-center text-xs">
        {["Focus", "Consistency", "Strength"].map((badge) => (
          <div key={badge} className="rounded-2xl bg-card/70 p-3">
            🏅
            <div className="mt-1 font-semibold">{badge}</div>
          </div>
        ))}
      </div>
    </AnimatedCard>
  );
}
