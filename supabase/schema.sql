create extension if not exists "pgcrypto";

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text,
  created_at timestamp with time zone default now()
);

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete set null,
  title text,
  goal text,
  target_audience text,
  status text default 'draft',
  created_at timestamp with time zone default now()
);

create table if not exists interview_answers (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  step text,
  question text,
  answer text,
  order_index integer,
  created_at timestamp with time zone default now()
);

create table if not exists generated_outputs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  output_type text,
  content jsonb,
  created_at timestamp with time zone default now()
);
