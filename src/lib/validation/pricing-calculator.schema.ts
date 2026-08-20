import { z } from "zod";

export const PRICING_COMPLEXITY_VALUES = ["baja", "media", "alta"] as const;

export const pricingCalculatorInputSchema = z.object({
  estimatedHours: z.number().positive("Las horas deben ser mayores que 0."),
  hourlyRate: z.number().positive("La tarifa debe ser mayor que 0."),
  complexity: z.enum(PRICING_COMPLEXITY_VALUES),
  marginPercent: z.number().min(0, "El margen no puede ser negativo.").max(100, "El margen no puede superar el 100%."),
});

export type PricingCalculatorInput = z.infer<typeof pricingCalculatorInputSchema>;
