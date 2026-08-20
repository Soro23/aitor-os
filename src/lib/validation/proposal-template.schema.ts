import { z } from "zod";

const baseProposalTemplateFields = {
  name: z.string().min(1, "El nombre es obligatorio."),
  summary: z.string().optional(),
  content: z.string().min(1, "El contenido es obligatorio."),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
};

export const createProposalTemplateSchema = z.object(baseProposalTemplateFields);
export const updateProposalTemplateSchema = z.object(baseProposalTemplateFields).partial();

export type CreateProposalTemplateInput = z.infer<typeof createProposalTemplateSchema>;
export type UpdateProposalTemplateInput = z.infer<typeof updateProposalTemplateSchema>;
