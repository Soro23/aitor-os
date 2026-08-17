"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createGardenNoteRelationSchema } from "@/lib/validation/garden-note-relation.schema";
import { gardenNoteRelationsRepository } from "@/server/repositories/garden-note-relations.repository";

export async function addGardenNoteRelation(input: unknown) {
  await requireAdmin();
  const data = createGardenNoteRelationSchema.parse(input);
  await gardenNoteRelationsRepository.addRelation(data.noteId, data.relatedNoteId);
  revalidatePath("/admin/garden");
  revalidatePath("/garden");
  return { success: true };
}

export async function removeGardenNoteRelation(noteId: string, relatedNoteId: string) {
  await requireAdmin();
  await gardenNoteRelationsRepository.removeRelation(noteId, relatedNoteId);
  revalidatePath("/admin/garden");
  revalidatePath("/garden");
  return { success: true };
}
