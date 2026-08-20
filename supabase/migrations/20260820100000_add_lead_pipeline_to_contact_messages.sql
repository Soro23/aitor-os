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
-- Solo se fuerza para quien NO es admin: el alta manual de un lead desde
-- /admin (createManual, siempre con requireAdmin(), rol authenticated) y
-- cualquier insert hecho con el cliente service-role (scripts/seeds/tests,
-- bypassa RLS por completo y no lleva auth.uid()) deben poder seguir
-- fijando estos campos.
create or replace function public.enforce_contact_message_insert_defaults()
returns trigger
language plpgsql
as $$
begin
  if not (public.is_admin() or current_user = 'service_role') then
    new.pipeline_status := 'nuevo';
    new.internal_notes := null;
  end if;
  new.updated_at := now();
  return new;
end;
$$;

create trigger enforce_contact_message_insert_defaults
  before insert on public.contact_messages
  for each row
  execute function public.enforce_contact_message_insert_defaults();
