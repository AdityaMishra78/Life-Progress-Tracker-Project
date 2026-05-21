alter table public.profiles enable row level security;
alter table public.subjects enable row level security;
alter table public.study_topics enable row level security;
alter table public.study_sessions enable row level security;
alter table public.workout_routines enable row level security;
alter table public.exercises enable row level security;
alter table public.workout_logs enable row level security;
alter table public.exercise_logs enable row level security;
alter table public.body_measurements enable row level security;
alter table public.skills enable row level security;
alter table public.skill_logs enable row level security;
alter table public.habits enable row level security;
alter table public.habit_logs enable row level security;
alter table public.goals enable row level security;
alter table public.tasks enable row level security;
alter table public.achievements enable row level security;
alter table public.user_achievements enable row level security;
alter table public.streaks enable row level security;
alter table public.analytics_events enable row level security;
alter table public.push_subscriptions enable row level security;

create policy "Users can view own profile"
on public.profiles for select
using (auth.uid() = id);

create policy "Users can update own profile"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "Authenticated users can view achievements"
on public.achievements for select
to authenticated
using (true);

create policy "Owner select subjects" on public.subjects for select using (auth.uid() = user_id);
create policy "Owner insert subjects" on public.subjects for insert with check (auth.uid() = user_id);
create policy "Owner update subjects" on public.subjects for update using (auth.uid() = user_id);
create policy "Owner delete subjects" on public.subjects for delete using (auth.uid() = user_id);

create policy "Owner select study_topics" on public.study_topics for select using (auth.uid() = user_id);
create policy "Owner insert study_topics" on public.study_topics for insert with check (auth.uid() = user_id);
create policy "Owner update study_topics" on public.study_topics for update using (auth.uid() = user_id);
create policy "Owner delete study_topics" on public.study_topics for delete using (auth.uid() = user_id);

create policy "Owner select study_sessions" on public.study_sessions for select using (auth.uid() = user_id);
create policy "Owner insert study_sessions" on public.study_sessions for insert with check (auth.uid() = user_id);
create policy "Owner update study_sessions" on public.study_sessions for update using (auth.uid() = user_id);
create policy "Owner delete study_sessions" on public.study_sessions for delete using (auth.uid() = user_id);

create policy "Owner select workout_routines" on public.workout_routines for select using (auth.uid() = user_id);
create policy "Owner insert workout_routines" on public.workout_routines for insert with check (auth.uid() = user_id);
create policy "Owner update workout_routines" on public.workout_routines for update using (auth.uid() = user_id);
create policy "Owner delete workout_routines" on public.workout_routines for delete using (auth.uid() = user_id);

create policy "Owner select exercises" on public.exercises for select using (auth.uid() = user_id);
create policy "Owner insert exercises" on public.exercises for insert with check (auth.uid() = user_id);
create policy "Owner update exercises" on public.exercises for update using (auth.uid() = user_id);
create policy "Owner delete exercises" on public.exercises for delete using (auth.uid() = user_id);

create policy "Owner select workout_logs" on public.workout_logs for select using (auth.uid() = user_id);
create policy "Owner insert workout_logs" on public.workout_logs for insert with check (auth.uid() = user_id);
create policy "Owner update workout_logs" on public.workout_logs for update using (auth.uid() = user_id);
create policy "Owner delete workout_logs" on public.workout_logs for delete using (auth.uid() = user_id);

create policy "Owner select exercise_logs" on public.exercise_logs for select using (auth.uid() = user_id);
create policy "Owner insert exercise_logs" on public.exercise_logs for insert with check (auth.uid() = user_id);
create policy "Owner update exercise_logs" on public.exercise_logs for update using (auth.uid() = user_id);
create policy "Owner delete exercise_logs" on public.exercise_logs for delete using (auth.uid() = user_id);

create policy "Owner select body_measurements" on public.body_measurements for select using (auth.uid() = user_id);
create policy "Owner insert body_measurements" on public.body_measurements for insert with check (auth.uid() = user_id);
create policy "Owner update body_measurements" on public.body_measurements for update using (auth.uid() = user_id);
create policy "Owner delete body_measurements" on public.body_measurements for delete using (auth.uid() = user_id);

create policy "Owner select skills" on public.skills for select using (auth.uid() = user_id);
create policy "Owner insert skills" on public.skills for insert with check (auth.uid() = user_id);
create policy "Owner update skills" on public.skills for update using (auth.uid() = user_id);
create policy "Owner delete skills" on public.skills for delete using (auth.uid() = user_id);

create policy "Owner select skill_logs" on public.skill_logs for select using (auth.uid() = user_id);
create policy "Owner insert skill_logs" on public.skill_logs for insert with check (auth.uid() = user_id);
create policy "Owner update skill_logs" on public.skill_logs for update using (auth.uid() = user_id);
create policy "Owner delete skill_logs" on public.skill_logs for delete using (auth.uid() = user_id);

create policy "Owner select habits" on public.habits for select using (auth.uid() = user_id);
create policy "Owner insert habits" on public.habits for insert with check (auth.uid() = user_id);
create policy "Owner update habits" on public.habits for update using (auth.uid() = user_id);
create policy "Owner delete habits" on public.habits for delete using (auth.uid() = user_id);

create policy "Owner select habit_logs" on public.habit_logs for select using (auth.uid() = user_id);
create policy "Owner insert habit_logs" on public.habit_logs for insert with check (auth.uid() = user_id);
create policy "Owner update habit_logs" on public.habit_logs for update using (auth.uid() = user_id);
create policy "Owner delete habit_logs" on public.habit_logs for delete using (auth.uid() = user_id);

create policy "Owner select goals" on public.goals for select using (auth.uid() = user_id);
create policy "Owner insert goals" on public.goals for insert with check (auth.uid() = user_id);
create policy "Owner update goals" on public.goals for update using (auth.uid() = user_id);
create policy "Owner delete goals" on public.goals for delete using (auth.uid() = user_id);

create policy "Owner select tasks" on public.tasks for select using (auth.uid() = user_id);
create policy "Owner insert tasks" on public.tasks for insert with check (auth.uid() = user_id);
create policy "Owner update tasks" on public.tasks for update using (auth.uid() = user_id);
create policy "Owner delete tasks" on public.tasks for delete using (auth.uid() = user_id);

create policy "Owner select user_achievements" on public.user_achievements for select using (auth.uid() = user_id);
create policy "Owner insert user_achievements" on public.user_achievements for insert with check (auth.uid() = user_id);

create policy "Owner select streaks" on public.streaks for select using (auth.uid() = user_id);
create policy "Owner insert streaks" on public.streaks for insert with check (auth.uid() = user_id);
create policy "Owner update streaks" on public.streaks for update using (auth.uid() = user_id);

create policy "Owner select analytics_events" on public.analytics_events for select using (auth.uid() = user_id);
create policy "Owner insert analytics_events" on public.analytics_events for insert with check (auth.uid() = user_id);

create policy "Owner select push_subscriptions" on public.push_subscriptions for select using (auth.uid() = user_id);
create policy "Owner insert push_subscriptions" on public.push_subscriptions for insert with check (auth.uid() = user_id);
create policy "Owner delete push_subscriptions" on public.push_subscriptions for delete using (auth.uid() = user_id);
