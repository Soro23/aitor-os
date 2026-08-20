import { describe, expect, it } from "vitest";
import { createFinancialEntrySchema } from "@/lib/validation/financial-entry.schema";

const validInput = {
  type: "ingreso" as const,
  amount: 500,
  category: "Desarrollo web",
  description: "Anticipo proyecto X",
  entryDate: "2026-08-20",
};

describe("createFinancialEntrySchema", () => {
  it("acepta un movimiento válido", () => {
    expect(createFinancialEntrySchema.safeParse(validInput).success).toBe(true);
  });

  it("acepta un movimiento con leadId vinculado", () => {
    const result = createFinancialEntrySchema.safeParse({
      ...validInput,
      leadId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    });
    expect(result.success).toBe(true);
  });

  it("rechaza un importe negativo o cero", () => {
    expect(createFinancialEntrySchema.safeParse({ ...validInput, amount: 0 }).success).toBe(false);
    expect(createFinancialEntrySchema.safeParse({ ...validInput, amount: -10 }).success).toBe(false);
  });

  it("rechaza sin descripción", () => {
    const result = createFinancialEntrySchema.safeParse({ ...validInput, description: "" });
    expect(result.success).toBe(false);
  });

  it("rechaza un tipo fuera del enum", () => {
    const result = createFinancialEntrySchema.safeParse({ ...validInput, type: "otro" });
    expect(result.success).toBe(false);
  });

  it("rechaza un leadId que no es uuid", () => {
    const result = createFinancialEntrySchema.safeParse({ ...validInput, leadId: "no-es-un-uuid" });
    expect(result.success).toBe(false);
  });
});
