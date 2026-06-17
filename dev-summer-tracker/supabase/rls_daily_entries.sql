alter table public.daily_entries enable row level security;

revoke insert, update, delete on public.daily_entries from anon;

grant select on public.daily_entries to anon, authenticated;
grant insert, update, delete on public.daily_entries to authenticated;

drop policy if exists "Anyone can read daily entries" on public.daily_entries;
drop policy if exists "Only owner can insert daily entries" on public.daily_entries;
drop policy if exists "Only owner can update daily entries" on public.daily_entries;
drop policy if exists "Only owner can delete daily entries" on public.daily_entries;

create policy "Anyone can read daily entries"
on public.daily_entries
for select
to anon, authenticated
using (true);

create policy "Only owner can insert daily entries"
on public.daily_entries
for insert
to authenticated
with check (
  (select auth.uid()) = 'c9bebb57-c04b-42c2-b8c7-7d123969c3d0'::uuid
);

create policy "Only owner can update daily entries"
on public.daily_entries
for update
to authenticated
using (
  (select auth.uid()) = 'c9bebb57-c04b-42c2-b8c7-7d123969c3d0'::uuid
)
with check (
  (select auth.uid()) = 'c9bebb57-c04b-42c2-b8c7-7d123969c3d0'::uuid
);

create policy "Only owner can delete daily entries"
on public.daily_entries
for delete
to authenticated
using (
  (select auth.uid()) = 'c9bebb57-c04b-42c2-b8c7-7d123969c3d0'::uuid
);
