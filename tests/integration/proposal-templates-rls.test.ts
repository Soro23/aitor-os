import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/dto/database.types";
import { setupAdminSession } from "../helpers/admin-session";

// Verifica RLS en Postgres: proposal_templates es 100% admin-only, sin
// ninguna policy `to anon` (ni siquiera insert). Requiere `npx supabase start`.
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
  await adminClient.from("proposal_templates").delete().in("id", seededIds);
});

describe("RLS de proposal_templates", () => {
  it("anon no puede leer plantillas", async () => {
    const { data: seeded } = await adminClient
      .from("proposal_templates")
      .insert({ name: "Plantilla privada", content: "Contenido." })
      .select("id")
      .single();
    seededIds.push(seeded!.id);

    const { data } = await anonClient.from("proposal_templates").select("*").eq("id", seeded!.id).maybeSingle();
    expect(data).toBeNull();
  });

  it("anon no puede insertar una plantilla", async () => {
    const { error } = await anonClient
      .from("proposal_templates")
      .insert({ name: "Intento anonimo", content: "Contenido." });

    expect(error).not.toBeNull();
  });

  it("anon no puede actualizar una plantilla existente", async () => {
    const { data: seeded } = await adminClient
      .from("proposal_templates")
      .insert({ name: "Plantilla a proteger", content: "Contenido." })
      .select("id")
      .single();
    seededIds.push(seeded!.id);

    const { error } = await anonClient
      .from("proposal_templates")
      .update({ name: "Modificada por anon" })
      .eq("id", seeded!.id);

    expect(error).not.toBeNull();
  });

  it("admin puede leer y actualizar plantillas", async () => {
    const { data: seeded } = await adminClient
      .from("proposal_templates")
      .insert({ name: "Plantilla admin", content: "Contenido." })
      .select("id")
      .single();
    seededIds.push(seeded!.id);

    const { data, error } = await adminClient
      .from("proposal_templates")
      .update({ name: "Actualizada por admin" })
      .eq("id", seeded!.id)
      .select("name")
      .single();

    expect(error).toBeNull();
    expect(data?.name).toBe("Actualizada por admin");
  });
});
