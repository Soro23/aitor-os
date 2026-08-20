import { describe, expect, it } from "vitest";
import { calculateProjectPrice } from "@/lib/pricing/calculate-project-price";

describe("calculateProjectPrice", () => {
  it("calcula el precio base sin ajustes con complejidad baja y margen 0%", () => {
    const result = calculateProjectPrice({
      estimatedHours: 10,
      hourlyRate: 50,
      complexity: "baja",
      marginPercent: 0,
    });

    expect(result.base).toBe(500);
    expect(result.adjusted).toBe(500);
    expect(result.total).toBe(500);
  });

  it("aplica el multiplicador de complejidad media", () => {
    const result = calculateProjectPrice({
      estimatedHours: 10,
      hourlyRate: 50,
      complexity: "media",
      marginPercent: 0,
    });

    expect(result.adjusted).toBe(625);
  });

  it("aplica el multiplicador de complejidad alta", () => {
    const result = calculateProjectPrice({
      estimatedHours: 10,
      hourlyRate: 50,
      complexity: "alta",
      marginPercent: 0,
    });

    expect(result.adjusted).toBe(800);
  });

  it("aplica el margen sobre el importe ajustado", () => {
    const result = calculateProjectPrice({
      estimatedHours: 10,
      hourlyRate: 50,
      complexity: "baja",
      marginPercent: 20,
    });

    expect(result.total).toBe(600);
  });

  it("el rango sugerido siempre encierra al total", () => {
    const result = calculateProjectPrice({
      estimatedHours: 40,
      hourlyRate: 45,
      complexity: "media",
      marginPercent: 15,
    });

    expect(result.rangeLow).toBeLessThan(result.total);
    expect(result.rangeHigh).toBeGreaterThan(result.total);
  });

  it("redondea a 2 decimales", () => {
    const result = calculateProjectPrice({
      estimatedHours: 7,
      hourlyRate: 33.33,
      complexity: "media",
      marginPercent: 10,
    });

    for (const value of Object.values(result)) {
      expect(Math.abs(value * 100 - Math.round(value * 100))).toBeLessThan(1e-9);
    }
  });
});
