create table if not exists public.posts (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete set null,
  author text not null default '회원',
  title text not null check (char_length(btrim(title)) between 1 and 120),
  content text not null check (char_length(btrim(content)) between 1 and 2000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_posts_created_at_desc on public.posts (created_at desc);
create index if not exists idx_posts_user_id on public.posts (user_id);

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

create or replace function public.set_post_owner_on_insert()
returns trigger
language plpgsql
as $$
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  new.user_id = auth.uid();
  new.author = coalesce(auth.jwt() ->> 'email', '회원');
  return new;
end;
$$;

drop trigger if exists trg_posts_set_owner on public.posts;
create trigger trg_posts_set_owner
before insert on public.posts
for each row
execute function public.set_post_owner_on_insert();

alter table public.posts enable row level security;
alter table public.posts force row level security;

grant usage on schema public to anon, authenticated;
grant select on table public.posts to anon, authenticated;
grant insert, update, delete on table public.posts to authenticated;
grant usage, select on sequence public.posts_id_seq to authenticated;

drop policy if exists "Allow read posts" on public.posts;
drop policy if exists "Allow insert posts" on public.posts;
drop policy if exists "Allow delete posts" on public.posts;
drop policy if exists "Allow update posts" on public.posts;
drop policy if exists "Allow anon read posts" on public.posts;
drop policy if exists "Allow anon insert posts" on public.posts;
drop policy if exists "Allow anon delete posts" on public.posts;

create policy "Allow read posts"
on public.posts
for select
to anon, authenticated
using (true);

create policy "Allow insert own posts"
on public.posts
for insert
to authenticated
with check (auth.uid() is not null and user_id = auth.uid());

create policy "Allow update own posts"
on public.posts
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Allow delete own posts"
on public.posts
for delete
to authenticated
using (auth.uid() = user_id);
