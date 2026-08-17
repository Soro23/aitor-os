import { z } from "zod";

export const LAB_EXPERIMENT_STATUS_VALUES = ["experiment", "working", "archived"] as const;

const optionalUrl = z.union([z.url("URL inválida."), z.literal("")]).optional();

// lab_number no forma parte del input: lo asigna Postgres (GENERATED ALWAYS
// AS IDENTITY) en create(), nunca el formulario admin.
const baseLabExperimentFields = {
  title: z.string().min(1, "El título es obligatorio."),
  description: z.string().optional(),
  stack: z.array(z.string().min(1)).default([]),
  status: z.enum(LAB_EXPERIMENT_STATUS_VALUES).default("experiment"),
  githubUrl: optionalUrl,
  demoUrl: optionalUrl,
  isPublished: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
};

export const createLabExperimentSchema = z.object(baseLabExperimentFields);

export const updateLabExperimentSchema = z.object(baseLabExperimentFields).partial();

export type CreateLabExperimentInput = z.infer<typeof createLabExperimentSchema>;
export type UpdateLabExperimentInput = z.infer<typeof updateLabExperimentSchema>;
