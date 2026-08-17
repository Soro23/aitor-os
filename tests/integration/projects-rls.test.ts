import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/dto/database.types";
import { setupAdminSession } from "../helpers/admin-session";

// Verifica la barrera real (RLS en Postgres), no el código de la app: un
// cliente anon (sin sesión) nunca debe poder leer/escribir un proyecto no
// publicado, ni siquiera conociendo su id directamente. Requiere
// `npx supabase start`.
let adminClient: Awaited<ReturnType<typeof setupAdminSession>>["adminClient"];
let anonClient: ReturnType<typeof createSupabaseClient<Database, "asros">>;
const seededProjectIds: string[] = [];
const CONTACT_TEST_EMAIL = "visitante-rls-test@example.com";

beforeAll(async () => {
  ({ adminClient } = await setupAdminSession());
  anonClient = createSupabaseClient<Database, "asros">(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { db: { schema: "asros" } },
  );
});

afterAll(async () => {
  if (!adminClient) return;
  if (seededProjectIds.length > 0) {
    await adminClient.from("projects").delete().in("id", seededProjectIds);
  }
  await adminClient.from("contact_messages").delete().eq("email", CONTACT_TEST_EMAIL);
});

describe("RLS de projects", () => {
  it("anon no puede leer un proyecto no publicado ni conociendo su id", async () => {
    const { data: draft } = await adminClient
      .from("projects")
      .insert({ slug: `rls-draft-${Date.now()}`, name: "RLS draft", is_published: false })
      .select("id")
      .single();
    seededProjectIds.push(draft!.id);

    const { data, error } = await anonClient
      .from("projects")
      .select("*")
      .eq("id", draft!.id)
      .maybeSingle();

    expect(error).toBeNull();
    expect(data).toBeNull();
  });

  it("anon puede leer un proyecto publicado", async () => {
    const { data: published } = await adminClient
      .from("projects")
      .insert({ slug: `rls-published-${Date.now()}`, name: "RLS published", is_published: true })
      .select("id")
      .single();
    seededProjectIds.push(published!.id);

    const { data } = await anonClient
      .from("projects")
      .select("*")
      .eq("id", published!.id)
      .maybeSingle();

    expect(data?.id).toBe(published!.id);
  });

  it("anon no puede insertar un proyecto", async () => {
    const { error } = await anonClient
      .from("projects")
      .insert({ slug: `rls-anon-insert-${Date.now()}`, name: "No deberia crearse" });

    expect(error).not.toBeNull();
  });

  it("anon no puede publicar un proyecto ajeno (RLS bloquea el UPDATE)", async () => {
    const { data: draft } = await adminClient
      .from("projects")
      .insert({ slug: `rls-update-${Date.now()}`, name: "RLS update", is_published: false })
      .select("id")
      .single();
    seededProjectIds.push(draft!.id);

    const { data } = await anonClient
      .from("projects")
      .update({ is_published: true })
      .eq("id", draft!.id)
      .select("id");

    // RLS filtra la fila (0 filas afectadas) en vez de devolver un error explicito.
    expect(data ?? []).toHaveLength(0);
  });
});

describe("RLS de contact_messages", () => {
  it("anon puede INSERT pero no SELECT", async () => {
    const { error: insertError } = await anonClient.from("contact_messages").insert({
      name: "Visitante",
      email: CONTACT_TEST_EMAIL,
      message: "Hola, quiero hablar de un proyecto.",
    });
    expect(insertError).toBeNull();

    const { data: selectData } = await anonClient.from("contact_messages").select("*");
    expect(selectData ?? []).toHaveLength(0);
  });
});
