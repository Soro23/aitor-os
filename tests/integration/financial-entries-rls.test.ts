import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/dto/database.types";
import { setupAdminSession } from "../helpers/admin-session";

// Verifica RLS en Postgres: financial_entries es 100% admin-only, sin
// ninguna policy `to anon`. Requiere `npx supabase start`.
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
  await adminClient.from("financial_entries").delete().in("id", seededIds);
});

describe("RLS de financial_entries", () => {
  it("anon no puede leer movimientos", async () => {
    const { data: seeded } = await adminClient
      .from("financial_entries")
      .insert({ type: "ingreso", amount: 100, description: "Movimiento privado" })
      .select("id")
      .single();
    seededIds.push(seeded!.id);

    const { data } = await anonClient.from("financial_entries").select("*").eq("id", seeded!.id).maybeSingle();
    expect(data).toBeNull();
  });

  it("anon no puede insertar un movimiento", async () => {
    const { error } = await anonClient
      .from("financial_entries")
      .insert({ type: "gasto", amount: 20, description: "Intento anonimo" });

    expect(error).not.toBeNull();
  });

  it("anon no puede actualizar un movimiento existente", async () => {
    const { data: seeded } = await adminClient
      .from("financial_entries")
      .insert({ type: "ingreso", amount: 100, description: "Movimiento a proteger" })
      .select("id")
      .single();
    seededIds.push(seeded!.id);

    const { error } = await anonClient
      .from("financial_entries")
      .update({ amount: 999 })
      .eq("id", seeded!.id);

    expect(error).not.toBeNull();
  });

  it("admin puede leer y actualizar movimientos", async () => {
    const { data: seeded } = await adminClient
      .from("financial_entries")
      .insert({ type: "ingreso", amount: 100, description: "Movimiento admin" })
      .select("id")
      .single();
    seededIds.push(seeded!.id);

    const { data, error } = await adminClient
      .from("financial_entries")
      .update({ amount: 150 })
      .eq("id", seeded!.id)
      .select("amount")
      .single();

    expect(error).toBeNull();
    expect(data?.amount).toBe(150);
  });
});
