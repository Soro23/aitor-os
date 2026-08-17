create table asros.lab_experiments (
  id uuid primary key default gen_random_uuid(),
  -- GENERATED ALWAYS: el repositorio nunca lo pasa en create(), lo asigna
  -- Postgres. Presentacion como "LAB #014" es responsabilidad del View Model.
  lab_number integer generated always as identity unique,
  title text not null,
  description text,
  stack text[] not null default '{}',
  status asros.lab_experiment_status not null default 'experiment',
  github_url text,
  demo_url text,
  is_published boolean not null default false,
  is_featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_lab_experiments_is_published on asros.lab_experiments (is_published);

create trigger set_lab_experiments_updated_at
  before update on asros.lab_experiments
  for each row
  execute function asros.set_updated_at();

alter table asros.lab_experiments enable row level security;

create policy "lab_experiments_select_published"
  on asros.lab_experiments for select
  to anon, authenticated
  using (is_published = true);

create policy "lab_experiments_admin_all"
  on asros.lab_experiments for all
  to authenticated
  using (asros.is_admin())
  with check (asros.is_admin());
