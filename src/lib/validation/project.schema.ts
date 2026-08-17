import { z } from "zod";

export const PROJECT_STATUS_VALUES = [
  "idea",
  "en_desarrollo",
  "beta",
  "finalizado",
  "paused",
] as const;

const slugSchema = z
  .string()
  .min(1, "El slug es obligatorio.")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "El slug debe ser kebab-case (minúsculas, números y guiones).",
  );

const optionalUrl = z.union([z.url("URL invalida."), z.literal("")]).optional();

const baseProjectFields = {
  slug: slugSchema,
  name: z.string().min(1, "El nombre es obligatorio."),
  description: z.string().optional(),
  problem: z.string().optional(),
  solution: z.string().optional(),
  technologies: z.array(z.string().min(1)).default([]),
  architecture: z.string().optional(),
  status: z.enum(PROJECT_STATUS_VALUES).default("idea"),
  progress: z.number().int().min(0).max(100).default(0),
  githubUrl: optionalUrl,
  demoUrl: optionalUrl,
  learnings: z.string().optional(),
  nextSteps: z.string().optional(),
  isPublished: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
};

export const createProjectSchema = z.object(baseProjectFields);

export const updateProjectSchema = z.object(baseProjectFields).partial();

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
