export function levelFromXp(xp: number) {
  return Math.max(1, Math.floor(Math.sqrt(xp / 120)) + 1);
}

export function nextLevelXp(level: number) {
  return Math.pow(level, 2) * 120;
}

export function xpForAction(action: string) {
  const map: Record<string, number> = {
    study_session: 25,
    workout_log: 35,
    habit_check: 10,
    skill_log: 20,
    task_complete: 15,
    goal_complete: 100
  };

  return map[action] ?? 5;
}
