import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { setupAdminSession } from "../helpers/admin-session";

// Contra Supabase local real (nunca mocks del cliente) — requiere
// `npx supabase start`.
let adminClient: Awaited<ReturnType<typeof setupAdminSession>>["adminClient"];
const seededIds: string[] = [];

beforeAll(async () => {
  ({ adminClient } = await setupAdminSession());
});

afterAll(async () => {
  if (!adminClient || seededIds.length === 0) return;
  await adminClient.from("financial_entries").delete().in("id", seededIds);
});

async function seedEntry(overrides: Record<string, unknown> = {}) {
  const { data, error } = await adminClient
    .from("financial_entries")
    .insert({
      type: "ingreso",
      amount: 100,
      description: "Movimiento de prueba",
      ...overrides,
    })
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(`No se pudo sembrar el movimiento de prueba: ${error?.message}`);
  }

  seededIds.push(data.id);
  return data;
}

describe("financialEntriesRepository", () => {
  it("findAll incluye un movimiento sembrado", async () => {
    const seeded = await seedEntry();
    const { financialEntriesRepository } = await import(
      "@/server/repositories/financial-entries.repository"
    );

    const all = await financialEntriesRepository.findAll();
    expect(all.some((e) => e.id === seeded.id)).toBe(true);
  });

  it("findAll filtra por tipo", async () => {
    const seeded = await seedEntry({ type: "gasto", amount: 50 });
    const { financialEntriesRepository } = await import(
      "@/server/repositories/financial-entries.repository"
    );

    const gastos = await financialEntriesRepository.findAll({ type: "gasto" });
    expect(gastos.some((e) => e.id === seeded.id)).toBe(true);
    expect(gastos.every((e) => e.type === "gasto")).toBe(true);
  });

  it("findById devuelve null si no existe", async () => {
    const { financialEntriesRepository } = await import(
      "@/server/repositories/financial-entries.repository"
    );
    const result = await financialEntriesRepository.findById("00000000-0000-0000-0000-000000000000");
    expect(result).toBeNull();
  });

  it("create inserta con los valores enviados", async () => {
    const { financialEntriesRepository } = await import(
      "@/server/repositories/financial-entries.repository"
    );
    const entry = await financialEntriesRepository.create({
      type: "ingreso",
      amount: 250.5,
      description: "Pago cliente",
      entryDate: "2026-08-20",
    });
    seededIds.push(entry.id);

    expect(entry.amount).toBe(250.5);
    expect(entry.type).toBe("ingreso");
  });

  it("update modifica solo los campos enviados", async () => {
    const seeded = await seedEntry();
    const { financialEntriesRepository } = await import(
      "@/server/repositories/financial-entries.repository"
    );

    const updated = await financialEntriesRepository.update(seeded.id, { amount: 999 });

    expect(updated.amount).toBe(999);
    expect(updated.description).toBe("Movimiento de prueba");
  });

  it("delete elimina el movimiento", async () => {
    const seeded = await seedEntry();
    const { financialEntriesRepository } = await import(
      "@/server/repositories/financial-entries.repository"
    );

    await financialEntriesRepository.delete(seeded.id);
    const result = await financialEntriesRepository.findById(seeded.id);

    expect(result).toBeNull();
    seededIds.splice(seededIds.indexOf(seeded.id), 1);
  });

  it("getTotals suma ingresos y gastos por separado", async () => {
    const income = await seedEntry({ type: "ingreso", amount: 300 });
    const expense = await seedEntry({ type: "gasto", amount: 120 });
    const { financialEntriesRepository } = await import(
      "@/server/repositories/financial-entries.repository"
    );

    const totals = await financialEntriesRepository.getTotals();

    expect(totals.income).toBeGreaterThanOrEqual(300);
    expect(totals.expense).toBeGreaterThanOrEqual(120);
    expect(totals.balance).toBe(totals.income - totals.expense);
    void income;
    void expense;
  });
});
