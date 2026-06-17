# Supabase Setup

This app can sync Daily Tracker records through Supabase.

Local export/import stays available as a backup. Projects, roadmap items, and weekly reviews still use local browser storage only.

## 1. Create a Supabase project

1. Open Supabase.
2. Create a new project.
3. Open `Project Settings` -> `API`.
4. Copy:
   - Project URL
   - anon public key

## 2. Create the table

Open `SQL Editor` in Supabase and run:

```sql
create table if not exists public.daily_entries (
  id text primary key,
  date date not null,
  react_done boolean not null default false,
  project_done boolean not null default false,
  english_done boolean not null default false,
  movement_done boolean not null default false,
  pomodoro_count integer not null default 0,
  mood integer not null default 5,
  energy integer not null default 5,
  main_result text not null default '',
  tomorrow_focus text not null default '',
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists daily_entries_set_updated_at on public.daily_entries;

create trigger daily_entries_set_updated_at
before update on public.daily_entries
for each row
execute function public.set_updated_at();
```

The app field `pomodoros` is stored in Supabase as `pomodoro_count`.

## 3. Row Level Security

This app currently has no authentication. For a personal public demo, the simplest setup is to keep RLS disabled for `daily_entries`.

Important: without authentication, anyone who can use your deployed app and Supabase anon key can potentially read/write this table. For private real data, add Supabase Auth before enabling public cloud sync.

## 4. Local environment variables

Create a local `.env` file:

```text
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Then run:

```bash
npm run dev
```

## 5. GitHub Pages environment variables

For GitHub Pages deployment, add these repository secrets:

1. Open GitHub repository.
2. Go to `Settings`.
3. Go to `Secrets and variables` -> `Actions`.
4. Add repository secrets:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

After changing secrets, rerun the `Deploy to GitHub Pages` workflow.

