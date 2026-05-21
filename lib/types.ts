export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Priority = "low" | "medium" | "high" | "urgent";
export type TaskStatus = "todo" | "doing" | "done";
export type RoutinePeriod = "daily" | "weekly";
export type RoutineTime = "morning" | "evening" | "anytime";

export type Profile = {
  id: string;
  email: string | null;
  display_name: string | null;
  avatar_url: string | null;
  level: number;
  xp: number;
  productivity_score: number;
};

export type Subject = {
  id: string;
  user_id: string;
  name: string;
  color: string;
  daily_goal_minutes: number;
  target_minutes: number;
  completed_topics: number;
  total_topics: number;
};

export type DashboardStats = {
  studyMinutesToday: number;
  workoutCompletionRate: number;
  skillsLearnedThisWeek: number;
  productivityScore: number;
  level: number;
  xp: number;
  nextLevelXp: number;
  dailyStreak: number;
};
