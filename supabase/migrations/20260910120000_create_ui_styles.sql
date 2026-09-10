-- Catalogo de estilos visuales de interfaz, publicado como sub-seccion del
-- Digital Garden en /garden/estilos-ui.
create type public.ui_style_category as enum (
  'minimalistas',
  'modernos',
  'expresivos',
  'retro',
  'futuristas',
  'editoriales'
);

create table public.ui_styles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category public.ui_style_category not null,
  summary text,
  description text,
  characteristics text,
  use_cases text,
  cover_image_url text,
  is_published boolean not null default false,
  is_featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_ui_styles_is_published on public.ui_styles (is_published);
create index idx_ui_styles_category on public.ui_styles (category);
create index idx_ui_styles_slug on public.ui_styles (slug);

create trigger set_ui_styles_updated_at
  before update on public.ui_styles
  for each row
  execute function public.set_updated_at();

alter table public.ui_styles enable row level security;

create policy "ui_styles_select_published"
  on public.ui_styles for select
  to anon, authenticated
  using (is_published = true);

create policy "ui_styles_admin_all"
  on public.ui_styles for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Galeria de ejemplos visuales de cada estilo.
create table public.ui_style_images (
  id uuid primary key default gen_random_uuid(),
  ui_style_id uuid not null references public.ui_styles (id) on delete cascade,
  image_url text not null,
  alt_text text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index idx_ui_style_images_ui_style_id on public.ui_style_images (ui_style_id);

alter table public.ui_style_images enable row level security;

create policy "ui_style_images_select_published"
  on public.ui_style_images for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.ui_styles s
      where s.id = ui_style_images.ui_style_id and s.is_published = true
    )
  );

create policy "ui_style_images_admin_all"
  on public.ui_style_images for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Enlaces de referencia de cada estilo (articulos, sitios de ejemplo, galerias).
create table public.ui_style_links (
  id uuid primary key default gen_random_uuid(),
  ui_style_id uuid not null references public.ui_styles (id) on delete cascade,
  label text not null,
  url text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index idx_ui_style_links_ui_style_id on public.ui_style_links (ui_style_id);

alter table public.ui_style_links enable row level security;

create policy "ui_style_links_select_published"
  on public.ui_style_links for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.ui_styles s
      where s.id = ui_style_links.ui_style_id and s.is_published = true
    )
  );

create policy "ui_style_links_admin_all"
  on public.ui_style_links for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Bucket publico para las imagenes de estilos (portada + galeria), con las
-- mismas politicas que project-images: lectura publica sobre rutas con UUID no
-- adivinable, escritura solo admin.
insert into storage.buckets (id, name, public)
values ('ui-style-images', 'ui-style-images', true)
on conflict (id) do nothing;

create policy "ui_style_images_storage_select_public"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'ui-style-images');

create policy "ui_style_images_storage_admin_insert"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'ui-style-images' and public.is_admin());

create policy "ui_style_images_storage_admin_update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'ui-style-images' and public.is_admin())
  with check (bucket_id = 'ui-style-images' and public.is_admin());

create policy "ui_style_images_storage_admin_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'ui-style-images' and public.is_admin());
