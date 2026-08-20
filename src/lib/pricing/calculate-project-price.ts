export type PricingComplexity = "baja" | "media" | "alta";

export interface PricingInput {
  estimatedHours: number;
  hourlyRate: number;
  complexity: PricingComplexity;
  marginPercent: number;
}

export interface PricingEstimate {
  base: number;
  adjusted: number;
  total: number;
  rangeLow: number;
  rangeHigh: number;
}

const COMPLEXITY_MULTIPLIERS: Record<PricingComplexity, number> = {
  baja: 1,
  media: 1.25,
  alta: 1.6,
};

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

/** Estima un precio de proyecto a partir de horas, tarifa, complejidad y margen deseado. */
export function calculateProjectPrice(input: PricingInput): PricingEstimate {
  const base = input.estimatedHours * input.hourlyRate;
  const adjusted = base * COMPLEXITY_MULTIPLIERS[input.complexity];
  const total = adjusted * (1 + input.marginPercent / 100);

  return {
    base: round2(base),
    adjusted: round2(adjusted),
    total: round2(total),
    rangeLow: round2(total * 0.9),
    rangeHigh: round2(total * 1.15),
  };
}
