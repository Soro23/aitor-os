import { z } from "zod";

export const createProjectScreenshotSchema = z.object({
  projectId: z.uuid("projectId debe ser un uuid valido."),
  imageUrl: z.url("URL de imagen invalida."),
  altText: z.string().optional(),
  sortOrder: z.number().int().default(0),
});

export const updateProjectScreenshotSchema = z.object({
  altText: z.string().optional(),
  sortOrder: z.number().int().optional(),
});

export type CreateProjectScreenshotInput = z.infer<typeof createProjectScreenshotSchema>;
export type UpdateProjectScreenshotInput = z.infer<typeof updateProjectScreenshotSchema>;
