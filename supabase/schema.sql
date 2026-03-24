create extension if not exists pgcrypto;

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  author_name text not null check (char_length(trim(author_name)) between 1 and 40),
  title text not null check (char_length(trim(title)) between 1 and 120),
  body text not null check (char_length(trim(body)) between 1 and 2000),
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  author_name text not null check (char_length(trim(author_name)) between 1 and 40),
  body text not null check (char_length(trim(body)) between 1 and 800),
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists posts_created_at_idx
  on public.posts (created_at desc);

create index if not exists comments_post_id_created_at_idx
  on public.comments (post_id, created_at asc);

grant usage on schema public to anon, authenticated;
grant select, insert on public.posts to anon, authenticated;
grant select, insert on public.comments to anon, authenticated;

alter table public.posts enable row level security;
alter table public.comments enable row level security;

drop policy if exists "Public can read posts" on public.posts;
create policy "Public can read posts"
  on public.posts
  for select
  using (true);

drop policy if exists "Public can insert posts" on public.posts;
create policy "Public can insert posts"
  on public.posts
  for insert
  with check (true);

drop policy if exists "Public can read comments" on public.comments;
create policy "Public can read comments"
  on public.comments
  for select
  using (true);

drop policy if exists "Public can insert comments" on public.comments;
create policy "Public can insert comments"
  on public.comments
  for insert
  with check (true);
