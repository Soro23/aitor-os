import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/dto/database.types";

/**
 * Cliente Supabase con SUPABASE_SERVICE_ROLE_KEY — bypassa RLS.
 *
 * SOLO para scripts de administracion (seed, migraciones de datos,
 * tareas de mantenimiento). NUNCA importar este modulo desde algo
 * que atienda una request publica: app/**, server/actions/*,
 * server/repositories/* de uso normal.
 */
export function createAdminClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
