-- Coleccion de edicion directa, sin flujo de publicacion: is_active en vez
-- de is_published, sin is_featured (no existe concepto de destacado aqui).
create table public.now_items (
  id uuid primary key default gen_random_uuid(),
  category public.now_item_category not null,
  title text not null,
  description text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_now_items_is_active on public.now_items (is_active);

create trigger set_now_items_updated_at
  before update on public.now_items
  for each row
  execute function public.set_updated_at();

alter table public.now_items enable row level security;

create policy "now_items_select_active"
  on public.now_items for select
  to anon, authenticated
  using (is_active = true);

create policy "now_items_admin_all"
  on public.now_items for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Coleccion de edicion directa: is_visible en vez de is_published.
create table public.stack_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category public.stack_category not null,
  usage_level public.stack_usage_level not null,
  is_visible boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_stack_items_is_visible on public.stack_items (is_visible);
create index idx_stack_items_category on public.stack_items (category);

create trigger set_stack_items_updated_at
  before update on public.stack_items
  for each row
  execute function public.set_updated_at();

alter table public.stack_items enable row level security;

create policy "stack_items_select_visible"
  on public.stack_items for select
  to anon, authenticated
  using (is_visible = true);

create policy "stack_items_admin_all"
  on public.stack_items for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());
