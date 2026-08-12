-- Run this once in Supabase SQL Editor.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text not null default 'User',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can read their own profile"
on public.profiles for select
using (auth.uid() = id);

create policy "Users can insert their own profile"
on public.profiles for insert
with check (auth.uid() = id);

create policy "Users can update their own profile"
on public.profiles for update
using (auth.uid() = id);

-- In Supabase Storage, create a PUBLIC bucket named: avatars
-- Then add policies allowing authenticated users to upload/update files
-- under their own user-id folder. The exact dashboard policy UI can be used.
