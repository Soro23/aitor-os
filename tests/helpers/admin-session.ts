import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { vi } from "vitest";
import type { Database } from "@/types/dto/database.types";

/**
 * Helper para tests de repositorio/integracion contra Supabase real (nunca
 * mocks del cliente): crea (o reutiliza) un usuario admin de prueba, lo anade
 * a asros.app_admins con el cliente service-role, inicia sesión con el
 * cliente anon y mockea next/headers para que lib/supabase/server pueda
 * autenticarse con esa sesión fuera de una request real de Next.js.
 *
 * Requiere `npx supabase start` corriendo y las variables de entorno de
 * .env.test (o .env.local) cargadas.
 */

const TEST_ADMIN_EMAIL = process.env.TEST_ADMIN_EMAIL ?? "admin.test@aitor-os.local";
const TEST_ADMIN_PASSWORD = process.env.TEST_ADMIN_PASSWORD ?? "test-admin-password-123";

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Falta la variable de entorno ${name} para los tests de integracion.`);
  }
  return value;
}

export async function setupAdminSession() {
  const url = requiredEnv("NEXT_PUBLIC_SUPABASE_URL");
  const anonKey = requiredEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  const serviceRoleKey = requiredEnv("SUPABASE_SERVICE_ROLE_KEY");

  const admin = createSupabaseClient<Database, "asros">(url, serviceRoleKey, {
    db: { schema: "asros" },
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: existing } = await admin.auth.admin.listUsers();
  let userId = existing.users.find((u) => u.email === TEST_ADMIN_EMAIL)?.id;

  if (!userId) {
    const { data: created, error } = await admin.auth.admin.createUser({
      email: TEST_ADMIN_EMAIL,
      password: TEST_ADMIN_PASSWORD,
      email_confirm: true,
    });
    if (error || !created.user) {
      // Varios ficheros de test arrancan en paralelo y pueden competir para
      // crear el mismo usuario: si ya existe (otro worker gano la carrera),
      // reutilizarlo en vez de fallar.
      const { data: retry } = await admin.auth.admin.listUsers();
      const existingId = retry.users.find((u) => u.email === TEST_ADMIN_EMAIL)?.id;
      if (!existingId) {
        throw new Error(`No se pudo crear el usuario admin de prueba: ${error?.message}`);
      }
      userId = existingId;
    } else {
      userId = created.user.id;
    }
  }

  const { error: upsertError } = await admin.from("app_admins").upsert({ user_id: userId });
  if (upsertError) {
    throw new Error(`No se pudo registrar el admin de prueba en app_admins: ${upsertError.message}`);
  }

  const anon = createSupabaseClient<Database, "asros">(url, anonKey, {
    db: { schema: "asros" },
  });
  const { data: session, error: signInError } = await anon.auth.signInWithPassword({
    email: TEST_ADMIN_EMAIL,
    password: TEST_ADMIN_PASSWORD,
  });

  if (signInError || !session.session) {
    throw new Error(`No se pudo iniciar sesión como admin de prueba: ${signInError?.message}`);
  }

  const { access_token, refresh_token } = session.session;
  const cookieName = `sb-${new URL(url).hostname.split(".")[0]}-auth-token`;
  const cookieValue = JSON.stringify({ access_token, refresh_token });

  vi.doMock("next/headers", () => ({
    cookies: async () => ({
      getAll: () => [{ name: cookieName, value: cookieValue }],
      set: () => {},
    }),
  }));

  return { userId, adminClient: admin };
}

export function mockAnonSession() {
  vi.doMock("next/headers", () => ({
    cookies: async () => ({
      getAll: () => [],
      set: () => {},
    }),
  }));
}
