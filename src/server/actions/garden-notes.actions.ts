"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createGardenNoteSchema, updateGardenNoteSchema } from "@/lib/validation/garden-note.schema";
import { gardenNotesRepository } from "@/server/repositories/garden-notes.repository";

function revalidateGardenPaths(slug?: string) {
  revalidatePath("/");
  revalidatePath("/garden");
  revalidatePath("/admin/garden");
  if (slug) revalidatePath(`/garden/${slug}`);
}

export async function createGardenNote(input: unknown) {
  await requireAdmin();
  const data = createGardenNoteSchema.parse(input);
  const note = await gardenNotesRepository.create(data);
  revalidateGardenPaths(note.slug);
  return { success: true, note };
}

export async function updateGardenNote(id: string, input: unknown) {
  await requireAdmin();
  const data = updateGardenNoteSchema.parse(input);
  const note = await gardenNotesRepository.update(id, data);
  revalidateGardenPaths(note.slug);
  return { success: true, note };
}

export async function deleteGardenNote(id: string) {
  await requireAdmin();
  const note = await gardenNotesRepository.findById(id);
  await gardenNotesRepository.delete(id);
  revalidateGardenPaths(note?.slug);
  return { success: true };
}

export async function setGardenNotePublished(id: string, value: boolean) {
  await requireAdmin();
  const note = await gardenNotesRepository.setPublished(id, value);
  revalidateGardenPaths(note.slug);
  return { success: true, note };
}

export async function setGardenNoteFeatured(id: string, value: boolean) {
  await requireAdmin();
  const note = await gardenNotesRepository.setFeatured(id, value);
  revalidateGardenPaths(note.slug);
  return { success: true, note };
}
