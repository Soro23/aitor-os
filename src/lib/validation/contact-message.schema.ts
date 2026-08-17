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
