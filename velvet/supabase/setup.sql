-- VELVET guestbook. Run once in Supabase: SQL Editor -> New query -> Run.

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'Yuki' check (char_length(btrim(name)) between 1 and 60),
  message text not null check (char_length(btrim(message)) between 1 and 2000),
  created_at timestamptz not null default now()
);

-- Only people listed here count as administrators (not just "any logged-in user").
create table if not exists public.admins (user_id uuid primary key references auth.users(id) on delete cascade);
alter table public.admins enable row level security;   -- no policies = invisible to the API

create or replace function public.is_admin() returns boolean
language sql security definer set search_path = public stable
as $$ select exists (select 1 from public.admins where user_id = auth.uid()) $$;

alter table public.messages enable row level security;
revoke all on public.messages from anon, authenticated;
grant insert on public.messages to anon, authenticated;
grant select, delete on public.messages to authenticated;

create policy "anyone can send"  on public.messages for insert to anon, authenticated with check (true);
create policy "admin can read"   on public.messages for select to authenticated using (public.is_admin());
create policy "admin can delete" on public.messages for delete to authenticated using (public.is_admin());

-- After creating your admin user (Authentication -> Users -> Add user), run with YOUR email:
-- insert into public.admins (user_id) select id from auth.users where email = 'you@example.com';
