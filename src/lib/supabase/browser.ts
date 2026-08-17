import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/dto/database.types";

/**
 * Cliente Supabase para Client Components.
 * Usa la anon key: respeta RLS, nunca hace bypass.
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
