import { z } from "zod";

export const MAX_IMAGES_PER_UI_STYLE = 12;

export const createUiStyleImageSchema = z.object({
  uiStyleId: z.uuid("uiStyleId debe ser un uuid válido."),
  imageUrl: z.url("URL de imagen inválida."),
  altText: z.string().optional(),
  sortOrder: z.number().int().default(0),
});

export const updateUiStyleImageSchema = z.object({
  altText: z.string().optional(),
  sortOrder: z.number().int().optional(),
});

export type CreateUiStyleImageInput = z.infer<typeof createUiStyleImageSchema>;
export type UpdateUiStyleImageInput = z.infer<typeof updateUiStyleImageSchema>;
