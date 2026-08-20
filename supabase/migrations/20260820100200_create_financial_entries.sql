-- Registro de ingresos/gastos. Coleccion 100% admin-only: sin publicacion,
-- sin ninguna policy `to anon`. lead_id referencia contact_messages (el
-- lead tracker de la Fase 1) para poder vincular un cobro a su origen.
create type public.financial_entry_type as enum ('ingreso', 'gasto');

create table public.financial_entries (
  id uuid primary key default gen_random_uuid(),
  type public.financial_entry_type not null,
  amount numeric(10,2) not null check (amount > 0),
  -- Texto libre, no ENUM: igual que contact_messages.interest, no hay
  -- vocabulario de categorias cerrado especificado.
  category text,
  description text not null,
  entry_date date not null default current_date,
  lead_id uuid references public.contact_messages (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_financial_entries_entry_date on public.financial_entries (entry_date);
create index idx_financial_entries_type on public.financial_entries (type);
create index idx_financial_entries_lead_id on public.financial_entries (lead_id);

create trigger set_financial_entries_updated_at
  before update on public.financial_entries
  for each row
  execute function public.set_updated_at();

alter table public.financial_entries enable row level security;

create policy "financial_entries_admin_all"
  on public.financial_entries for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());
