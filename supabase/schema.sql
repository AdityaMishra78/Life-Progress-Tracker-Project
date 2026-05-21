create extension if not exists "uuid-ossp";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  avatar_url text,
  level int not null default 1,
  xp int not null default 0,
  productivity_score int not null default 0,
  theme text not null default 'system',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.subjects (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  color text not null default '#8b5cf6',
  icon text default 'BookOpen',
  daily_goal_minutes int not null default 60,
  target_minutes int not null default 1200,
  completed_topics int not null default 0,
  total_topics int not null default 10,
  created_at timestamptz not null default now()
);

create table if not exists public.study_topics (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  subject_id uuid not null references public.subjects(id) on delete cascade,
  title text not null,
  notes text,
  completed boolean not null default false,
  revision_due_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.study_sessions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  subject_id uuid references public.subjects(id) on delete set null,
  duration_minutes int not null check (duration_minutes >= 0),
  session_type text not null default 'focus',
  notes text,
  started_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.workout_routines (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  description text,
  weekday int check (weekday between 0 and 6),
  created_at timestamptz not null default now()
);

create table if not exists public.exercises (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  muscle_group text,
  created_at timestamptz not null default now()
);

create table if not exists public.workout_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  routine_id uuid references public.workout_routines(id) on delete set null,
  title text not null,
  duration_minutes int not null default 45,
  completed_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.exercise_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  workout_log_id uuid not null references public.workout_logs(id) on delete cascade,
  exercise_id uuid references public.exercises(id) on delete set null,
  sets int not null default 3,
  reps int not null default 10,
  weight numeric not null default 0,
  is_pr boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.body_measurements (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  weight numeric,
  body_fat numeric,
  chest numeric,
  waist numeric,
  hips numeric,
  arms numeric,
  legs numeric,
  measured_at timestamptz not null default now()
);

create table if not exists public.skills (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  category text,
  description text,
  progress int not null default 0 check (progress between 0 and 100),
  target_hours int not null default 100,
  resource_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.skill_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  skill_id uuid not null references public.skills(id) on delete cascade,
  hours numeric not null default 1,
  milestone text,
  notes text,
  logged_at timestamptz not null default now()
);

create table if not exists public.habits (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  description text,
  period text not null default 'daily',
  routine text not null default 'anytime',
  color text not null default '#22c55e',
  reminder_time time,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.habit_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  habit_id uuid not null references public.habits(id) on delete cascade,
  completed_on date not null default current_date,
  completed boolean not null default true,
  created_at timestamptz not null default now(),
  unique(user_id, habit_id, completed_on)
);

create table if not exists public.goals (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  category text not null default 'personal',
  priority text not null default 'medium',
  progress int not null default 0 check (progress between 0 and 100),
  deadline date,
  completed boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  goal_id uuid references public.goals(id) on delete set null,
  title text not null,
  status text not null default 'todo',
  priority text not null default 'medium',
  due_date date,
  completed boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.achievements (
  id uuid primary key default uuid_generate_v4(),
  code text unique not null,
  title text not null,
  description text not null,
  icon text not null default 'Trophy',
  xp_reward int not null default 50,
  category text not null default 'general'
);

create table if not exists public.user_achievements (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  achievement_id uuid not null references public.achievements(id) on delete cascade,
  unlocked_at timestamptz not null default now(),
  unique(user_id, achievement_id)
);

create table if not exists public.streaks (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null,
  current_count int not null default 0,
  longest_count int not null default 0,
  last_activity_date date,
  freezes_available int not null default 1,
  updated_at timestamptz not null default now(),
  unique(user_id, type)
);

create table if not exists public.analytics_events (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  event_type text not null,
  metadata jsonb not null default '{}',
  occurred_at timestamptz not null default now()
);

create table if not exists public.push_subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  endpoint text not null,
  subscription jsonb not null,
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  );

  insert into public.streaks (user_id, type)
  values
    (new.id, 'study'),
    (new.id, 'workout'),
    (new.id, 'habit'),
    (new.id, 'overall');

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_touch_updated_at
before update on public.profiles
for each row execute function public.touch_updated_at();

create index if not exists idx_subjects_user on public.subjects(user_id);
create index if not exists idx_study_sessions_user_started on public.study_sessions(user_id, started_at desc);
create index if not exists idx_workout_logs_user_completed on public.workout_logs(user_id, completed_at desc);
create index if not exists idx_habit_logs_user_date on public.habit_logs(user_id, completed_on desc);
create index if not exists idx_tasks_user_status on public.tasks(user_id, status);
create index if not exists idx_goals_user_deadline on public.goals(user_id, deadline);
create index if not exists idx_skills_user on public.skills(user_id);
