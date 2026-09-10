import { z } from "zod";

export const MAX_LINKS_PER_UI_STYLE = 12;

export const createUiStyleLinkSchema = z.object({
  uiStyleId: z.uuid("uiStyleId debe ser un uuid válido."),
  label: z.string().min(1, "El texto del enlace es obligatorio."),
  url: z.url("URL inválida."),
  sortOrder: z.number().int().default(0),
});

export const updateUiStyleLinkSchema = z.object({
  label: z.string().min(1, "El texto del enlace es obligatorio.").optional(),
  url: z.url("URL inválida.").optional(),
  sortOrder: z.number().int().optional(),
});

export type CreateUiStyleLinkInput = z.infer<typeof createUiStyleLinkSchema>;
export type UpdateUiStyleLinkInput = z.infer<typeof updateUiStyleLinkSchema>;
