-- Create enum for invoice status
create type invoice_status as enum (
  'PENDING',
  'PAID',
  'CANCELLED'
);

-- Create invoices table
create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  invoice_number text not null unique,
  amount decimal(12, 2) not null,
  status invoice_status default 'PENDING',
  due_date timestamp with time zone,
  paid_at timestamp with time zone,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.invoices enable row level security;

-- Users can view their own invoices
create policy "Users can view their own invoices" on public.invoices
  for select using (auth.uid() = user_id);

-- Admins can view all invoices
create policy "Admins can view all invoices" on public.invoices
  for select using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  );

-- Admins can insert invoices
create policy "Admins can insert invoices" on public.invoices
  for insert with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  );

-- Admins can update invoices
create policy "Admins can update invoices" on public.invoices
  for update using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  );

-- Create index for faster queries
create index if not exists invoices_project_id_idx on public.invoices(project_id);
create index if not exists invoices_user_id_idx on public.invoices(user_id);
