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

This app uses Supabase Auth for owner login. Public visitors can read dashboard data, but only the owner account can create, update, or delete daily entries.

Enable Row Level Security and apply the owner-only policies from:

```text
supabase/rls_daily_entries.sql
```

Important: the frontend only hides edit controls. Real protection must come from Supabase RLS policies. Do not use a `service_role` key in the frontend.

## 4. Local environment variables

Create a local `.env` file:

```text
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_OWNER_USER_ID=c9bebb57-c04b-42c2-b8c7-7d123969c3d0
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

The GitHub Actions workflow also passes:

```text
VITE_OWNER_USER_ID
```

After changing secrets, rerun the `Deploy to GitHub Pages` workflow.
