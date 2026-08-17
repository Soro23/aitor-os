import { z } from "zod";

export const createGardenNoteRelationSchema = z
  .object({
    noteId: z.uuid("noteId debe ser un uuid válido."),
    relatedNoteId: z.uuid("relatedNoteId debe ser un uuid válido."),
  })
  .refine((data) => data.noteId !== data.relatedNoteId, {
    message: "Una nota no puede relacionarse consigo misma.",
    path: ["relatedNoteId"],
  });

export type CreateGardenNoteRelationInput = z.infer<typeof createGardenNoteRelationSchema>;
