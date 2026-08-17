create table asros.resources (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  type asros.resource_type not null,
  url text not null,
  is_published boolean not null default false,
  is_featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_resources_is_published on asros.resources (is_published);
create index idx_resources_type on asros.resources (type);

create trigger set_resources_updated_at
  before update on asros.resources
  for each row
  execute function asros.set_updated_at();

alter table asros.resources enable row level security;

create policy "resources_select_published"
  on asros.resources for select
  to anon, authenticated
  using (is_published = true);

create policy "resources_admin_all"
  on asros.resources for all
  to authenticated
  using (asros.is_admin())
  with check (asros.is_admin());
