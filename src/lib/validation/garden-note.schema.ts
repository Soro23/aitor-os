import { z } from "zod";

export const GARDEN_NOTE_CATEGORY_VALUES = ["sistemas", "desarrollo", "ia", "ideas"] as const;
export const GARDEN_NOTE_STATUS_VALUES = ["seed", "growing", "evergreen"] as const;

const slugSchema = z
  .string()
  .min(1, "El slug es obligatorio.")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "El slug debe ser kebab-case (minúsculas, números y guiones).",
  );

const baseGardenNoteFields = {
  slug: slugSchema,
  title: z.string().min(1, "El título es obligatorio."),
  category: z.enum(GARDEN_NOTE_CATEGORY_VALUES),
  status: z.enum(GARDEN_NOTE_STATUS_VALUES).default("seed"),
  content: z.string().optional(),
  examples: z.string().optional(),
  commands: z.string().optional(),
  referencesText: z.string().optional(),
  isPublished: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
};

export const createGardenNoteSchema = z.object(baseGardenNoteFields);

export const updateGardenNoteSchema = z.object(baseGardenNoteFields).partial();

export type CreateGardenNoteInput = z.infer<typeof createGardenNoteSchema>;
export type UpdateGardenNoteInput = z.infer<typeof updateGardenNoteSchema>;
