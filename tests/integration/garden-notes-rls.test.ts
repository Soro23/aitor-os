import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/dto/database.types";
import { setupAdminSession } from "../helpers/admin-session";

// Verifica RLS en Postgres: anon nunca lee/escribe una nota no publicada, ni
// una relacion que involucre una nota no publicada. Requiere `npx supabase start`.
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
  await adminClient.from("garden_notes").delete().in("id", seededIds);
});

describe("RLS de garden_notes", () => {
  it("anon no puede leer una nota no publicada ni conociendo su id", async () => {
    const { data: draft } = await adminClient
      .from("garden_notes")
      .insert({ slug: `rls-draft-${Date.now()}`, title: "RLS draft", category: "ideas", is_published: false })
      .select("id")
      .single();
    seededIds.push(draft!.id);

    const { data } = await anonClient.from("garden_notes").select("*").eq("id", draft!.id).maybeSingle();
    expect(data).toBeNull();
  });

  it("anon no puede relacionar dos notas (RLS bloquea el INSERT)", async () => {
    const { data: noteA } = await adminClient
      .from("garden_notes")
      .insert({ slug: `rls-rel-a-${Date.now()}`, title: "A", category: "ideas", is_published: true })
      .select("id")
      .single();
    const { data: noteB } = await adminClient
      .from("garden_notes")
      .insert({ slug: `rls-rel-b-${Date.now()}`, title: "B", category: "ideas", is_published: true })
      .select("id")
      .single();
    seededIds.push(noteA!.id, noteB!.id);

    const { error } = await anonClient
      .from("garden_note_relations")
      .insert({ note_id: noteA!.id, related_note_id: noteB!.id });

    expect(error).not.toBeNull();
  });
});
