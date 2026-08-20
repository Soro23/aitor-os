-- Plantillas de propuesta reutilizables. Coleccion 100% admin-only: sin
-- publicacion, sin ninguna policy `to anon` (ni siquiera insert).
create table public.proposal_templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  summary text,
  content text not null,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_proposal_templates_is_active on public.proposal_templates (is_active);

create trigger set_proposal_templates_updated_at
  before update on public.proposal_templates
  for each row
  execute function public.set_updated_at();

alter table public.proposal_templates enable row level security;

create policy "proposal_templates_admin_all"
  on public.proposal_templates for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());
