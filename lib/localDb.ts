"use client";

// Client-side Local Storage Database Utility

export interface Subject {
  id: string;
  name: string;
  color: string;
}

export interface StudySession {
  id: string;
  subject_id: string;
  duration_minutes: number;
  session_type: string;
  notes: string;
  started_at: string;
  subjects?: { name: string; color: string };
}

export interface WorkoutLog {
  id: string;
  title: string;
  duration_minutes: number;
  notes: string;
  completed_at: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  deadline: string | null;
  progress: number;
  completed: boolean;
  created_at: string;
}

export interface Habit {
  id: string;
  name: string;
  description: string;
  period: string;
  routine: string;
  color: string;
  active: boolean;
}

export interface HabitLog {
  id: string;
  habit_id: string;
  completed_on: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  description: string;
  target_hours: number;
  progress: number;
  created_at: string;
}

export interface SkillLog {
  id: string;
  skill_id: string;
  hours: number;
  logged_at: string;
}

// Helpers to read/write raw local storage collections
function getLocalItem<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : [];
}

function setLocalItem<T>(key: string, list: T[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(list));
}

// UUID generator fallback
function uuid() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// WORKOUTS
export const localDb = {
  getWorkouts(): WorkoutLog[] {
    return getLocalItem<WorkoutLog>("local_db_workout_logs");
  },
  saveWorkout(title: string, duration: number, notes: string): WorkoutLog {
    const list = this.getWorkouts();
    const item: WorkoutLog = {
      id: uuid(),
      title,
      duration_minutes: duration,
      notes,
      completed_at: new Date().toISOString(),
    };
    setLocalItem("local_db_workout_logs", [item, ...list]);
    return item;
  },
  deleteWorkout(id: string) {
    const list = this.getWorkouts().filter((item) => item.id !== id);
    setLocalItem("local_db_workout_logs", list);
  },

  // STUDY SESSIONS & SUBJECTS
  getSubjects(): Subject[] {
    return getLocalItem<Subject>("local_db_subjects");
  },
  saveSubject(name: string): Subject {
    const list = this.getSubjects();
    const existing = list.find((s) => s.name.toLowerCase() === name.toLowerCase());
    if (existing) return existing;

    const colors = ["#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#ec4899"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const item: Subject = {
      id: uuid(),
      name,
      color: randomColor,
    };
    setLocalItem("local_db_subjects", [...list, item]);
    return item;
  },
  getStudySessions(): StudySession[] {
    const sessions = getLocalItem<StudySession>("local_db_study_sessions");
    const subjects = this.getSubjects();
    return sessions.map((s) => {
      const sub = subjects.find((x) => x.id === s.subject_id);
      return {
        ...s,
        subjects: sub ? { name: sub.name, color: sub.color } : { name: "General Study", color: "#8b5cf6" },
      };
    });
  },
  saveStudySession(subjectName: string, duration: number, sessionType: string, notes: string): StudySession {
    const subject = this.saveSubject(subjectName);
    const list = getLocalItem<StudySession>("local_db_study_sessions");
    const item: StudySession = {
      id: uuid(),
      subject_id: subject.id,
      duration_minutes: duration,
      session_type: sessionType,
      notes,
      started_at: new Date().toISOString(),
    };
    setLocalItem("local_db_study_sessions", [item, ...list]);
    return item;
  },
  deleteStudySession(id: string) {
    const list = getLocalItem<StudySession>("local_db_study_sessions").filter((item) => item.id !== id);
    setLocalItem("local_db_study_sessions", list);
  },

  // GOALS
  getGoals(): Goal[] {
    return getLocalItem<Goal>("local_db_goals");
  },
  saveGoal(title: string, description: string, category: string, priority: string, deadline: string): Goal {
    const list = this.getGoals();
    const item: Goal = {
      id: uuid(),
      title,
      description,
      category,
      priority,
      deadline: deadline || null,
      progress: 0,
      completed: false,
      created_at: new Date().toISOString(),
    };
    setLocalItem("local_db_goals", [item, ...list]);
    return item;
  },
  updateGoalProgress(id: string, progress: number): Goal | null {
    const list = this.getGoals();
    const index = list.findIndex((g) => g.id === id);
    if (index === -1) return null;

    const completed = progress === 100;
    list[index] = { ...list[index], progress, completed };
    setLocalItem("local_db_goals", list);
    return list[index];
  },
  deleteGoal(id: string) {
    const list = this.getGoals().filter((item) => item.id !== id);
    setLocalItem("local_db_goals", list);
  },

  // HABITS & HABIT LOGS
  getHabits(): Habit[] {
    return getLocalItem<Habit>("local_db_habits");
  },
  saveHabit(name: string, description: string, period: string, routine: string, color: string): Habit {
    const list = this.getHabits();
    const item: Habit = {
      id: uuid(),
      name,
      description,
      period,
      routine,
      color,
      active: true,
    };
    setLocalItem("local_db_habits", [...list, item]);
    return item;
  },
  getHabitLogs(): HabitLog[] {
    return getLocalItem<HabitLog>("local_db_habit_logs");
  },
  toggleHabitLog(habitId: string): boolean {
    const logs = this.getHabitLogs();
    const today = new Date().toISOString().split("T")[0];
    const existingIndex = logs.findIndex((log) => log.habit_id === habitId && log.completed_on === today);

    if (existingIndex > -1) {
      // Remove it
      logs.splice(existingIndex, 1);
      setLocalItem("local_db_habit_logs", logs);
      return false; // Not completed now
    } else {
      // Add it
      const newLog: HabitLog = {
        id: uuid(),
        habit_id: habitId,
        completed_on: today,
      };
      setLocalItem("local_db_habit_logs", [...logs, newLog]);
      return true; // Completed now
    }
  },
  deleteHabit(id: string) {
    const list = this.getHabits().filter((item) => item.id !== id);
    setLocalItem("local_db_habits", list);
    const logs = this.getHabitLogs().filter((log) => log.habit_id !== id);
    setLocalItem("local_db_habit_logs", logs);
  },

  // SKILLS & SKILL LOGS
  getSkills(): Skill[] {
    return getLocalItem<Skill>("local_db_skills");
  },
  saveSkill(name: string, category: string, description: string, targetHours: number): Skill {
    const list = this.getSkills();
    const item: Skill = {
      id: uuid(),
      name,
      category,
      description,
      target_hours: targetHours,
      progress: 0,
      created_at: new Date().toISOString(),
    };
    setLocalItem("local_db_skills", [item, ...list]);
    return item;
  },
  getSkillLogs(): SkillLog[] {
    return getLocalItem<SkillLog>("local_db_skill_logs");
  },
  saveSkillLog(skillId: string, hours: number): SkillLog {
    const logs = this.getSkillLogs();
    const log: SkillLog = {
      id: uuid(),
      skill_id: skillId,
      hours,
      logged_at: new Date().toISOString(),
    };
    setLocalItem("local_db_skill_logs", [log, ...logs]);

    // Recalculate progress for the parent skill
    const skills = this.getSkills();
    const skillIndex = skills.findIndex((s) => s.id === skillId);
    if (skillIndex > -1) {
      const skill = skills[skillIndex];
      const totalHours = getLocalItem<SkillLog>("local_db_skill_logs")
        .filter((l) => l.skill_id === skillId)
        .reduce((sum, l) => sum + Number(l.hours), 0);
      const progress = Math.min(100, Math.round((totalHours / skill.target_hours) * 100));
      skills[skillIndex] = { ...skill, progress };
      setLocalItem("local_db_skills", skills);
    }

    return log;
  },
  deleteSkill(id: string) {
    const list = this.getSkills().filter((item) => item.id !== id);
    setLocalItem("local_db_skills", list);
    const logs = this.getSkillLogs().filter((log) => log.skill_id !== id);
    setLocalItem("local_db_skill_logs", logs);
  },

  // CENTRAL STATISTICS CALCULATION
  getDashboardData() {
    const studySessions = this.getStudySessions();
    const workouts = this.getWorkouts();
    const habits = this.getHabits();
    const habitLogs = this.getHabitLogs();
    const skillLogs = this.getSkillLogs();
    const goals = this.getGoals();

    const today = new Date().toISOString().split("T")[0];

    // Today's Study Minutes
    const studyMinutesToday = studySessions
      .filter((s) => s.started_at && s.started_at.startsWith(today))
      .reduce((sum, s) => sum + Number(s.duration_minutes || 0), 0);

    // Workout rate (workouts this month vs a target of 12)
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const workoutsThisMonth = workouts.filter(
      (w) => w.completed_at && new Date(w.completed_at) >= startOfMonth
    ).length;
    const workoutCompletionRate = Math.min(100, Math.round((workoutsThisMonth / 12) * 100));

    // Skills learned this week
    const startOfWeek = new Date();
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    startOfWeek.setDate(diff);
    startOfWeek.setHours(0, 0, 0, 0);
    const skillsLearnedThisWeek = skillLogs.filter(
      (s) => s.logged_at && new Date(s.logged_at) >= startOfWeek
    ).length;

    // Completed Habits Today
    const completedHabitsCount = habitLogs.filter((l) => l.completed_on === today).length;
    const totalHabitsCount = habits.filter((h) => h.active).length;

    // Productivity Score
    const productivityScore = Math.min(
      100,
      Math.round(
        studyMinutesToday * 0.45 +
          workoutsThisMonth * 4 +
          completedHabitsCount * 8 +
          skillsLearnedThisWeek * 5
      )
    );

    // XP & Level calculations
    const xp =
      studySessions.reduce((sum, s) => sum + s.duration_minutes, 0) +
      workouts.length * 50 +
      habitLogs.length * 10 +
      skillLogs.reduce((sum, s) => sum + Math.round(s.hours * 25), 0);

    const level = Math.max(1, Math.floor(Math.sqrt(xp / 100)) + 1);
    const nextLevelXp = Math.round(Math.pow(level, 2) * 100);

    // Streak count (simplified local streak calculation based on activity)
    const allActivityDates = new Set([
      ...studySessions.map((s) => s.started_at.split("T")[0]),
      ...workouts.map((w) => w.completed_at.split("T")[0]),
      ...habitLogs.map((h) => h.completed_on),
      ...skillLogs.map((s) => s.logged_at.split("T")[0]),
    ]);

    let streak = 0;
    let checkDate = new Date();
    while (true) {
      const dateStr = checkDate.toISOString().split("T")[0];
      if (allActivityDates.has(dateStr)) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        // If yesterday was also inactive, break
        if (streak === 0) {
          checkDate.setDate(checkDate.getDate() - 1);
          const yesterdayStr = checkDate.toISOString().split("T")[0];
          if (allActivityDates.has(yesterdayStr)) {
            checkDate = new Date(checkDate);
            continue;
          }
        }
        break;
      }
    }

    // Weekly Chart Data
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const weekly = days.map((d) => ({ day: d, study: 0, workout: 0 }));

    studySessions
      .filter((s) => s.started_at && new Date(s.started_at) >= startOfWeek)
      .forEach((s) => {
        const idx = new Date(s.started_at).getDay();
        const normalized = idx === 0 ? 6 : idx - 1;
        weekly[normalized].study += s.duration_minutes;
      });

    workouts
      .filter((w) => w.completed_at && new Date(w.completed_at) >= startOfWeek)
      .forEach((w) => {
        const idx = new Date(w.completed_at).getDay();
        const normalized = idx === 0 ? 6 : idx - 1;
        weekly[normalized].workout += 1;
      });

    return {
      stats: {
        studyMinutesToday,
        workoutCompletionRate,
        skillsLearnedThisWeek,
        productivityScore,
        level,
        xp,
        nextLevelXp,
        dailyStreak: streak,
        workoutsToday: workouts.filter((w) => w.completed_at && w.completed_at.startsWith(today)).length,
        completedHabitsCount,
        totalHabitsCount,
      },
      weekly,
      goals: goals.slice(0, 5),
    };
  },

  getAnalyticsData() {
    const studySessions = this.getStudySessions();
    const workouts = this.getWorkouts();
    const habitLogs = this.getHabitLogs();
    const skillLogs = this.getSkillLogs();

    const studyMinutes = studySessions.reduce((sum, s) => sum + s.duration_minutes, 0);
    const workoutsCount = workouts.length;
    const habitStreak = this.getDashboardData().stats.dailyStreak;
    const xpGained = this.getDashboardData().stats.xp;

    const startOfWeek = new Date();
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    startOfWeek.setHours(0, 0, 0, 0);

    const weeklyData = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => ({
      day,
      study: 0,
      workout: 0,
    }));

    studySessions
      .filter((s) => s.started_at && new Date(s.started_at) >= startOfWeek)
      .forEach((s) => {
        const idx = new Date(s.started_at).getDay();
        const normalized = idx === 0 ? 6 : idx - 1;
        weeklyData[normalized].study += s.duration_minutes;
      });

    workouts
      .filter((w) => w.completed_at && new Date(w.completed_at) >= startOfWeek)
      .forEach((w) => {
        const idx = new Date(w.completed_at).getDay();
        const normalized = idx === 0 ? 6 : idx - 1;
        weeklyData[normalized].workout += 1;
      });

    const studyVal = studyMinutes;
    const workoutVal = workouts.reduce((sum, w) => sum + w.duration_minutes, 0);
    const habitVal = habitLogs.length * 15;
    const skillVal = skillLogs.reduce((sum, s) => sum + Number(s.hours), 0) * 60;
    const hasData = studyVal + workoutVal + habitVal + skillVal > 0;

    const balanceData = [
      { name: "Study", value: hasData ? studyVal : 25, color: "#171717" },
      { name: "Workout", value: hasData ? workoutVal : 25, color: "#525252" },
      { name: "Habits", value: hasData ? habitVal : 25, color: "#909090" },
      { name: "Skills", value: hasData ? skillVal : 25, color: "#d4d4d4" },
    ];

    // Heatmap data over last 28 days
    const heatmapDataMap: Record<string, number> = {};
    const now = new Date();
    for (let i = 0; i < 28; i++) {
      const d = new Date();
      d.setDate(now.getDate() - (27 - i));
      const dateStr = d.toISOString().split("T")[0];
      heatmapDataMap[dateStr] = 0;
    }

    studySessions.forEach((s) => {
      const dateStr = s.started_at.split("T")[0];
      if (dateStr in heatmapDataMap) heatmapDataMap[dateStr] += 1;
    });

    workouts.forEach((w) => {
      const dateStr = w.completed_at.split("T")[0];
      if (dateStr in heatmapDataMap) heatmapDataMap[dateStr] += 1;
    });

    habitLogs.forEach((l) => {
      if (l.completed_on in heatmapDataMap) heatmapDataMap[l.completed_on] += 1;
    });

    skillLogs.forEach((s) => {
      const dateStr = s.logged_at.split("T")[0];
      if (dateStr in heatmapDataMap) heatmapDataMap[dateStr] += 1;
    });

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const heatmapData = Object.entries(heatmapDataMap).map(([dateStr, value]) => {
      const parsed = new Date(dateStr);
      return {
        date: `${months[parsed.getMonth()]} ${parsed.getDate()}`,
        value,
      };
    });

    return {
      studyMinutes,
      workouts: workoutsCount,
      habitStreak,
      xpGained,
      weeklyData,
      balanceData,
      heatmapData,
    };
  },
};
