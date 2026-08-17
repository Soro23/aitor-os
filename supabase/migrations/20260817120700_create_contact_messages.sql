-- Bandeja de entrada del formulario de contacto. Unica tabla con INSERT
-- publico sin SELECT publico: la proteccion aqui es RLS insert-only, no
-- requireAdmin() (submitContactMessage es la unica Server Action de
-- escritura publica del sistema).
create table asros.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  -- Texto libre, no ENUM: project-concept.md lo presenta como ejemplos
  -- ilustrativos ("Development, AI projects...") no como vocabulario cerrado.
  interest text,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create index idx_contact_messages_is_read on asros.contact_messages (is_read);

alter table asros.contact_messages enable row level security;

create policy "contact_messages_insert_public"
  on asros.contact_messages for insert
  to anon, authenticated
  with check (true);

create policy "contact_messages_admin_all"
  on asros.contact_messages for all
  to authenticated
  using (asros.is_admin())
  with check (asros.is_admin());
