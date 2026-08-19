-- Copiado del script oficial de self-hosting de Supabase (docker/volumes/db/roles.sql).
-- La imagen supabase/postgres solo fija por defecto la contraseña de
-- "authenticator" a partir de POSTGRES_PASSWORD; el resto de roles de
-- servicio (supabase_auth_admin, supabase_storage_admin, pgbouncer) se
-- quedan sin contraseña utilizable si no se ejecuta esto en el init.
\set pgpass `echo "$POSTGRES_PASSWORD"`

ALTER USER authenticator WITH PASSWORD :'pgpass';
ALTER USER pgbouncer WITH PASSWORD :'pgpass';
ALTER USER supabase_auth_admin WITH PASSWORD :'pgpass';
ALTER USER supabase_storage_admin WITH PASSWORD :'pgpass';
