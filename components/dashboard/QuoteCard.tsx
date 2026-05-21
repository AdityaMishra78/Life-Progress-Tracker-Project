import { AnimatedCard } from "@/components/ui/AnimatedCard";

const quotes = [
  "Small steps every day compound into an unrecognizable future.",
  "Discipline is self-respect in motion.",
  "Win the next hour. The day will follow.",
  "Your streak is proof that your future self can trust you."
];

export function QuoteCard() {
  const quote = quotes[new Date().getDay() % quotes.length];

  return (
    <AnimatedCard className="bg-gradient-to-br from-violet-500/20 to-cyan-500/10">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
        Daily motivation
      </p>
      <blockquote className="mt-4 text-2xl font-black leading-tight">
        &ldquo;{quote}&rdquo;
      </blockquote>
      <p className="mt-5 text-sm text-muted">Today&apos;s quest: complete one focused action.</p>
    </AnimatedCard>
  );
}
