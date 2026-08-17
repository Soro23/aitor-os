import { z } from "zod";

export const STACK_CATEGORY_VALUES = ["desarrollo", "sistemas", "infraestructura", "ia"] as const;
export const STACK_USAGE_LEVEL_VALUES = ["daily", "frequent", "learning", "exploring"] as const;

const baseStackItemFields = {
  name: z.string().min(1, "El nombre es obligatorio."),
  category: z.enum(STACK_CATEGORY_VALUES),
  usageLevel: z.enum(STACK_USAGE_LEVEL_VALUES),
  isVisible: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
};

export const createStackItemSchema = z.object(baseStackItemFields);
export const updateStackItemSchema = z.object(baseStackItemFields).partial();

export type CreateStackItemInput = z.infer<typeof createStackItemSchema>;
export type UpdateStackItemInput = z.infer<typeof updateStackItemSchema>;
