create table if not exists public.posts (
  id bigint generated always as identity primary key,
  author text not null check (char_length(btrim(author)) between 1 and 40),
  title text not null check (char_length(btrim(title)) between 1 and 120),
  content text not null check (char_length(btrim(content)) between 1 and 2000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_posts_created_at_desc on public.posts (created_at desc);

create or replace function public.set_posts_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_posts_updated_at on public.posts;
create trigger trg_posts_updated_at
before update on public.posts
for each row
execute function public.set_posts_updated_at();

alter table public.posts enable row level security;
alter table public.posts force row level security;

grant usage on schema public to anon, authenticated;
grant select, insert, delete on table public.posts to anon, authenticated;

drop policy if exists "Allow read posts" on public.posts;
drop policy if exists "Allow insert posts" on public.posts;
drop policy if exists "Allow delete posts" on public.posts;

create policy "Allow read posts"
on public.posts
for select
to anon, authenticated
using (true);

create policy "Allow insert posts"
on public.posts
for insert
to anon, authenticated
with check (true);

create policy "Allow delete posts"
on public.posts
for delete
to anon, authenticated
using (true);
