-- Create enum for project status
create type project_status as enum (
  'BELUM_DIPESAN',
  'MENUNGGU_PEMBAYARAN',
  'SEDANG_DIKERJAKAN',
  'SELESAI'
);

-- Create projects table
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  full_name text not null,
  whatsapp text not null,
  email text not null,
  description text not null,
  budget_range text not null,
  status project_status default 'BELUM_DIPESAN',
  admin_notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.projects enable row level security;

-- Users can view their own projects
create policy "Users can view their own projects" on public.projects
  for select using (auth.uid() = user_id);

-- Users can insert their own projects
create policy "Users can insert their own projects" on public.projects
  for insert with check (auth.uid() = user_id);

-- Admins can view all projects
create policy "Admins can view all projects" on public.projects
  for select using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  );

-- Admins can update any project
create policy "Admins can update all projects" on public.projects
  for update using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  );

-- Create index for faster queries
create index if not exists projects_user_id_idx on public.projects(user_id);
create index if not exists projects_status_idx on public.projects(status);
