import { z } from "zod";

export const UI_STYLE_CATEGORY_VALUES = [
  "minimalistas",
  "modernos",
  "expresivos",
  "retro",
  "futuristas",
  "editoriales",
] as const;

const slugSchema = z
  .string()
  .min(1, "El slug es obligatorio.")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "El slug debe ser kebab-case (minúsculas, números y guiones).",
  );

const baseUiStyleFields = {
  slug: slugSchema,
  name: z.string().min(1, "El nombre es obligatorio."),
  category: z.enum(UI_STYLE_CATEGORY_VALUES),
  summary: z.string().optional(),
  description: z.string().optional(),
  characteristics: z.string().optional(),
  useCases: z.string().optional(),
  coverImageUrl: z.url("URL de imagen inválida.").optional(),
  isPublished: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
};

export const createUiStyleSchema = z.object(baseUiStyleFields);

export const updateUiStyleSchema = z.object(baseUiStyleFields).partial();

export type CreateUiStyleInput = z.infer<typeof createUiStyleSchema>;
export type UpdateUiStyleInput = z.infer<typeof updateUiStyleSchema>;
