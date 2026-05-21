import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { differenceInCalendarDays, format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMinutes(minutes: number) {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

export function todayISODate() {
  return format(new Date(), "yyyy-MM-dd");
}

export function computeStreak(dates: string[]) {
  const unique = [...new Set(dates)].sort().reverse();
  if (!unique.length) return 0;

  let streak = 0;
  let cursor = new Date();

  for (const d of unique) {
    const diff = differenceInCalendarDays(cursor, new Date(d));

    if (diff === 0 || diff === 1) {
      streak += 1;
      cursor = new Date(d);
    } else {
      break;
    }
  }

  return streak;
}
