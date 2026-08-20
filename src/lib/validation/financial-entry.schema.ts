import { z } from "zod";

export const FINANCIAL_ENTRY_TYPE_VALUES = ["ingreso", "gasto"] as const;

const baseFinancialEntryFields = {
  type: z.enum(FINANCIAL_ENTRY_TYPE_VALUES),
  amount: z.number().positive("El importe debe ser mayor que 0."),
  category: z.string().optional(),
  description: z.string().min(1, "La descripción es obligatoria."),
  entryDate: z.string().min(1, "La fecha es obligatoria."),
  leadId: z.string().uuid().optional(),
};

export const createFinancialEntrySchema = z.object(baseFinancialEntryFields);
export const updateFinancialEntrySchema = z.object(baseFinancialEntryFields).partial();

export type CreateFinancialEntryInput = z.infer<typeof createFinancialEntrySchema>;
export type UpdateFinancialEntryInput = z.infer<typeof updateFinancialEntrySchema>;
