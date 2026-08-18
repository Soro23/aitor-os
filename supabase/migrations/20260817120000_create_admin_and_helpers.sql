-- Funcion reutilizable para mantener updated_at en cada UPDATE.
create or replace function public.set_updated_at()
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
create table public.app_admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.app_admins enable row level security;
-- Sin policies: RLS deniega lectura/escritura publica total. Solo el
-- cliente admin (service role, que bypassa RLS) o is_admin() (security
-- definer) pueden leer esta tabla.

-- Frontera real de autorizacion: is_admin() comprueba auth.uid() contra
-- app_admins. Toda politica de escritura de una tabla editorial usa esta
-- funcion, nunca "auth.uid() is not null" a secas.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.app_admins where user_id = auth.uid()
  );
$$;
