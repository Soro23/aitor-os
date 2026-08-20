-- Amplia contact_messages con un pipeline de estados para gestionar leads
-- de servicios de consultoria, en vez de crear una tabla "leads" separada:
-- contact_messages ya es la unica fuente real de contactos entrantes.
create type public.lead_pipeline_status as enum (
  'nuevo',
  'contactado',
  'propuesta_enviada',
  'ganado',
  'perdido'
);

alter table public.contact_messages
  add column pipeline_status public.lead_pipeline_status not null default 'nuevo',
  add column internal_notes text,
  add column updated_at timestamptz not null default now();

create index idx_contact_messages_pipeline_status on public.contact_messages (pipeline_status);

create trigger set_contact_messages_updated_at
  before update on public.contact_messages
  for each row
  execute function public.set_updated_at();

-- contact_messages_insert_public no restringe columnas (with check (true)):
-- sin esto, un insert publico directo via REST podria fijar pipeline_status
-- o internal_notes con valores arbitrarios, saltandose el pipeline de leads.
create or replace function public.enforce_contact_message_insert_defaults()
returns trigger
language plpgsql
as $$
begin
  new.pipeline_status := 'nuevo';
  new.internal_notes := null;
  new.updated_at := now();
  return new;
end;
$$;

create trigger enforce_contact_message_insert_defaults
  before insert on public.contact_messages
  for each row
  execute function public.enforce_contact_message_insert_defaults();
