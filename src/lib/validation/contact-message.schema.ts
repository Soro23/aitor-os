import { z } from "zod";

export const createContactMessageSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio.").max(120, "El nombre es demasiado largo."),
  email: z.email("Introduce un email válido."),
  message: z
    .string()
    .min(10, "El mensaje debe tener al menos 10 caracteres.")
    .max(2000, "El mensaje es demasiado largo."),
  interest: z.string().max(200).optional(),
});

export type CreateContactMessageInput = z.infer<typeof createContactMessageSchema>;

export const LEAD_PIPELINE_STATUS_VALUES = [
  "nuevo",
  "contactado",
  "propuesta_enviada",
  "ganado",
  "perdido",
] as const;

export const createLeadManualSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio.").max(120, "El nombre es demasiado largo."),
  email: z.email("Introduce un email válido."),
  message: z.string().max(2000, "El mensaje es demasiado largo.").default(""),
  interest: z.string().max(200).optional(),
});

export const updateLeadPipelineSchema = z.object({
  pipelineStatus: z.enum(LEAD_PIPELINE_STATUS_VALUES),
  internalNotes: z.string().max(4000, "Las notas son demasiado largas.").optional(),
});

export type CreateLeadManualInput = z.infer<typeof createLeadManualSchema>;
export type UpdateLeadPipelineInput = z.infer<typeof updateLeadPipelineSchema>;
