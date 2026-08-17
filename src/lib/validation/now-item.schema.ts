import { z } from "zod";

export const NOW_ITEM_CATEGORY_VALUES = ["building", "learning", "exploring"] as const;

const baseNowItemFields = {
  category: z.enum(NOW_ITEM_CATEGORY_VALUES),
  title: z.string().min(1, "El título es obligatorio."),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
};

export const createNowItemSchema = z.object(baseNowItemFields);
export const updateNowItemSchema = z.object(baseNowItemFields).partial();

export type CreateNowItemInput = z.infer<typeof createNowItemSchema>;
export type UpdateNowItemInput = z.infer<typeof updateNowItemSchema>;
