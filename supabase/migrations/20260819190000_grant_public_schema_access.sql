-- Supabase dejo de auto-exponer tablas/vistas/secuencias/funciones nuevas del
-- schema public a los roles de la Data API (anon, authenticated, service_role)
-- sin GRANT explicito ("auto_expose_new_tables", deprecado, se elimina el
-- 2026-10-30 - ver supabase/config.toml). Sin esto, ni siquiera el cliente
-- service role (que bypassa RLS) puede tocar las tablas: bypassar RLS no
-- sustituye al GRANT de base de Postgres.
--
-- Este GRANT es la frontera de "puede tocar la tabla", no la de autorizacion
-- real: esa la siguen imponiendo las RLS policies de cada tabla (o su
-- ausencia total, como en app_admins). Replica el comportamiento estandar de
-- Supabase para las tablas ya creadas y, via ALTER DEFAULT PRIVILEGES, para
-- las que cree cualquier migracion futura.

grant usage on schema public to anon, authenticated, service_role;

grant all on all tables in schema public to anon, authenticated, service_role;
grant all on all sequences in schema public to anon, authenticated, service_role;
grant all on all routines in schema public to anon, authenticated, service_role;

alter default privileges in schema public
  grant all on tables to anon, authenticated, service_role;
alter default privileges in schema public
  grant all on sequences to anon, authenticated, service_role;
alter default privileges in schema public
  grant all on routines to anon, authenticated, service_role;
