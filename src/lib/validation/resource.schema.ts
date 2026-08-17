import { z } from "zod";

export const RESOURCE_TYPE_VALUES = [
  "herramienta",
  "libreria",
  "curso",
  "libro",
  "repo",
  "doc",
  "prompt",
  "snippet",
] as const;

const baseResourceFields = {
  name: z.string().min(1, "El nombre es obligatorio."),
  description: z.string().optional(),
  type: z.enum(RESOURCE_TYPE_VALUES),
  url: z.url("URL inválida."),
  isPublished: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
};

export const createResourceSchema = z.object(baseResourceFields);

export const updateResourceSchema = z.object(baseResourceFields).partial();

export type CreateResourceInput = z.infer<typeof createResourceSchema>;
export type UpdateResourceInput = z.infer<typeof updateResourceSchema>;
