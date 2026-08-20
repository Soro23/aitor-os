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
    // Sin .select() tras el insert: como anon no tiene policy de SELECT,
    // encadenar .select() dispara el RETURNING de Postgres, que se filtra
    // por políticas SELECT y lanza 42501 si ninguna aplica — no es que el
    // insert falle, es que devolver la fila insertada falla. El formulario
    // público real (contactMessagesRepository.create) tampoco encadena
    // .select() por esta misma razón.
    const email = `anon-${Date.now()}@example.com`;
    const { error } = await anonClient.from("contact_messages").insert({
      name: "Visitante anonimo",
      email,
      message: "Hola, quiero hablar de un proyecto.",
    });

    expect(error).toBeNull();

    const { data: seeded } = await adminClient
      .from("contact_messages")
      .select("id")
      .eq("email", email)
      .single();
    if (seeded) seededIds.push(seeded.id);
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

    // Un UPDATE cuyo WHERE no matchea ninguna fila visible bajo RLS no
    // lanza error explícito (a diferencia de un INSERT bloqueado): Postgres
    // simplemente actualiza 0 filas en silencio. La prueba real de que RLS
    // bloqueó el cambio es que la fila sigue intacta, comprobado abajo.
    await anonClient
      .from("contact_messages")
      .update({ pipeline_status: "ganado", internal_notes: "intento anonimo" })
      .eq("id", seeded!.id);

    const { data: unchanged } = await adminClient
      .from("contact_messages")
      .select("pipeline_status, internal_notes")
      .eq("id", seeded!.id)
      .single();

    expect(unchanged?.pipeline_status).toBe("nuevo");
    expect(unchanged?.internal_notes).toBeNull();
  });
});
