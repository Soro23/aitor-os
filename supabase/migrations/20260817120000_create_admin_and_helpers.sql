-- Schema propio de la aplicacion (no "public"): separa las tablas de
-- negocio del schema por defecto de Postgres/Supabase.
create schema if not exists asros;

grant usage on schema asros to anon, authenticated, service_role;

-- Estas reglas se aplican automaticamente a todo objeto creado en asros a
-- partir de aqui (esta y las siguientes migraciones). RLS es la barrera
-- real fila a fila; estos GRANT son el equivalente al comportamiento por
-- defecto que Supabase ya aplica sobre el schema "public".
alter default privileges in schema asros
  grant select, insert, update, delete on tables to anon, authenticated, service_role;

alter default privileges in schema asros
  grant usage, select on sequences to anon, authenticated, service_role;

alter default privileges in schema asros
  grant execute on functions to anon, authenticated, service_role;

-- Funcion reutilizable para mantener updated_at en cada UPDATE.
create or replace function asros.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Lista de user_id autorizados como administrador (single-admin, defensa
-- en profundidad: aunque el registro publico este desactivado, ningun
-- usuario autenticado tiene permisos de escritura si no esta aqui).
create table asros.app_admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table asros.app_admins enable row level security;
-- Sin policies: RLS deniega lectura/escritura publica total. Solo el
-- cliente admin (service role, que bypassa RLS) o is_admin() (security
-- definer) pueden leer esta tabla.

-- Frontera real de autorizacion: is_admin() comprueba auth.uid() contra
-- app_admins. Toda politica de escritura de una tabla editorial usa esta
-- funcion, nunca "auth.uid() is not null" a secas.
create or replace function asros.is_admin()
returns boolean
language sql
security definer
set search_path = asros
stable
as $$
  select exists (
    select 1 from asros.app_admins where user_id = auth.uid()
  );
$$;
