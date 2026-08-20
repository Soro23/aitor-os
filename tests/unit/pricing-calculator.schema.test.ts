import { describe, expect, it } from "vitest";
import { pricingCalculatorInputSchema } from "@/lib/validation/pricing-calculator.schema";

const validInput = {
  estimatedHours: 40,
  hourlyRate: 50,
  complexity: "media" as const,
  marginPercent: 15,
};

describe("pricingCalculatorInputSchema", () => {
  it("acepta un input valido", () => {
    expect(pricingCalculatorInputSchema.safeParse(validInput).success).toBe(true);
  });

  it("rechaza horas cero o negativas", () => {
    expect(
      pricingCalculatorInputSchema.safeParse({ ...validInput, estimatedHours: 0 }).success,
    ).toBe(false);
    expect(
      pricingCalculatorInputSchema.safeParse({ ...validInput, estimatedHours: -5 }).success,
    ).toBe(false);
  });

  it("rechaza tarifa cero o negativa", () => {
    expect(pricingCalculatorInputSchema.safeParse({ ...validInput, hourlyRate: 0 }).success).toBe(
      false,
    );
  });

  it("rechaza margen fuera de 0-100", () => {
    expect(
      pricingCalculatorInputSchema.safeParse({ ...validInput, marginPercent: -1 }).success,
    ).toBe(false);
    expect(
      pricingCalculatorInputSchema.safeParse({ ...validInput, marginPercent: 101 }).success,
    ).toBe(false);
  });

  it("acepta margen en los limites 0 y 100", () => {
    expect(
      pricingCalculatorInputSchema.safeParse({ ...validInput, marginPercent: 0 }).success,
    ).toBe(true);
    expect(
      pricingCalculatorInputSchema.safeParse({ ...validInput, marginPercent: 100 }).success,
    ).toBe(true);
  });

  it("rechaza una complejidad fuera del enum", () => {
    expect(
      pricingCalculatorInputSchema.safeParse({ ...validInput, complexity: "extrema" }).success,
    ).toBe(false);
  });
});
