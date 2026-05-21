insert into public.achievements (code, title, description, icon, xp_reward, category)
values
  ('first_focus', 'First Focus', 'Complete your first study session.', 'Sparkles', 50, 'study'),
  ('seven_day_streak', '7-Day Flame', 'Maintain a 7-day streak.', 'Flame', 150, 'streak'),
  ('first_workout', 'First Rep', 'Log your first workout.', 'Dumbbell', 50, 'workout'),
  ('skill_builder', 'Skill Builder', 'Log 10 skill-learning hours.', 'Brain', 100, 'skill'),
  ('habit_machine', 'Habit Machine', 'Complete 20 habit check-ins.', 'CheckCircle2', 100, 'habit')
on conflict (code) do nothing;
