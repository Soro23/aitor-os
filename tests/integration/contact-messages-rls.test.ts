import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/dto/database.types";
import { setupAdminSession } from "../helpers/admin-session";

// Verifica RLS en Postgres: anon puede insertar un mensaje basico (formulario
// publico de contacto) pero nunca puede leer, ni mutar pipeline_status /
// internal_notes de un lead. Requiere `npx supabase start`.
let adminClient: Awaited<ReturnType<typeof setupAdminSession>>["adminClient"];
let anonClient: ReturnType<typeof createSupabaseClient<Database, "public">>;
const seededIds: string[] = [];

beforeAll(async () => {
  ({ adminClient } = await setupAdminSession());
  anonClient = createSupabaseClient<Database, "public">(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { db: { schema: "public" } },
  );
});

afterAll(async () => {
  if (!adminClient || seededIds.length === 0) return;
  await adminClient.from("contact_messages").delete().in("id", seededIds);
});

describe("RLS de contact_messages (pipeline de leads)", () => {
  it("anon puede insertar un mensaje basico (formulario publico)", async () => {
    const { data, error } = await anonClient
      .from("contact_messages")
      .insert({
        name: "Visitante anonimo",
        email: `anon-${Date.now()}@example.com`,
        message: "Hola, quiero hablar de un proyecto.",
      })
      .select("id")
      .single();

    expect(error).toBeNull();
    if (data) seededIds.push(data.id);
  });

  it("anon no puede leer mensajes existentes", async () => {
    const { data: seeded } = await adminClient
      .from("contact_messages")
      .insert({ name: "Lead privado", email: `privado-${Date.now()}@example.com`, message: "Mensaje." })
      .select("id")
      .single();
    seededIds.push(seeded!.id);

    const { data } = await anonClient.from("contact_messages").select("*").eq("id", seeded!.id).maybeSingle();
    expect(data).toBeNull();
  });

  it("anon no puede cambiar pipeline_status ni internal_notes", async () => {
    const { data: seeded } = await adminClient
      .from("contact_messages")
      .insert({ name: "Lead a proteger", email: `proteger-${Date.now()}@example.com`, message: "Mensaje." })
      .select("id")
      .single();
    seededIds.push(seeded!.id);

    const { error } = await anonClient
      .from("contact_messages")
      .update({ pipeline_status: "ganado", internal_notes: "intento anonimo" })
      .eq("id", seeded!.id);

    expect(error).not.toBeNull();

    const { data: unchanged } = await adminClient
      .from("contact_messages")
      .select("pipeline_status, internal_notes")
      .eq("id", seeded!.id)
      .single();

    expect(unchanged?.pipeline_status).toBe("nuevo");
    expect(unchanged?.internal_notes).toBeNull();
  });
});
