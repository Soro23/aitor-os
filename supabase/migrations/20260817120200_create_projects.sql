create table public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  problem text,
  solution text,
  technologies text[] not null default '{}',
  architecture text,
  status public.project_status not null default 'idea',
  progress smallint not null default 0 check (progress between 0 and 100),
  github_url text,
  demo_url text,
  learnings text,
  next_steps text,
  is_published boolean not null default false,
  is_featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_projects_is_published on public.projects (is_published);
create index idx_projects_is_featured on public.projects (is_featured);
create index idx_projects_slug on public.projects (slug);

create trigger set_projects_updated_at
  before update on public.projects
  for each row
  execute function public.set_updated_at();

alter table public.projects enable row level security;

create policy "projects_select_published"
  on public.projects for select
  to anon, authenticated
  using (is_published = true);

create policy "projects_admin_all"
  on public.projects for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Galeria de capturas de un proyecto (1-N).
create table public.project_screenshots (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  image_url text not null,
  alt_text text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index idx_project_screenshots_project_id on public.project_screenshots (project_id);

alter table public.project_screenshots enable row level security;

create policy "project_screenshots_select_published"
  on public.project_screenshots for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.projects p
      where p.id = project_screenshots.project_id
        and p.is_published = true
    )
  );

create policy "project_screenshots_admin_all"
  on public.project_screenshots for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());
