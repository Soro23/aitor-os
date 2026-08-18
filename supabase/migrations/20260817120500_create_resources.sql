create table public.resources (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  type public.resource_type not null,
  url text not null,
  is_published boolean not null default false,
  is_featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_resources_is_published on public.resources (is_published);
create index idx_resources_type on public.resources (type);

create trigger set_resources_updated_at
  before update on public.resources
  for each row
  execute function public.set_updated_at();

alter table public.resources enable row level security;

create policy "resources_select_published"
  on public.resources for select
  to anon, authenticated
  using (is_published = true);

create policy "resources_admin_all"
  on public.resources for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());
