"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createResourceSchema, updateResourceSchema } from "@/lib/validation/resource.schema";
import { resourcesRepository } from "@/server/repositories/resources.repository";

function revalidateResourcePaths() {
  revalidatePath("/recursos");
  revalidatePath("/admin/recursos");
}

export async function createResource(input: unknown) {
  await requireAdmin();
  const data = createResourceSchema.parse(input);
  const resource = await resourcesRepository.create(data);
  revalidateResourcePaths();
  return { success: true, resource };
}

export async function updateResource(id: string, input: unknown) {
  await requireAdmin();
  const data = updateResourceSchema.parse(input);
  const resource = await resourcesRepository.update(id, data);
  revalidateResourcePaths();
  return { success: true, resource };
}

export async function deleteResource(id: string) {
  await requireAdmin();
  await resourcesRepository.delete(id);
  revalidateResourcePaths();
  return { success: true };
}

export async function setResourcePublished(id: string, value: boolean) {
  await requireAdmin();
  const resource = await resourcesRepository.setPublished(id, value);
  revalidateResourcePaths();
  return { success: true, resource };
}

export async function setResourceFeatured(id: string, value: boolean) {
  await requireAdmin();
  const resource = await resourcesRepository.setFeatured(id, value);
  revalidateResourcePaths();
  return { success: true, resource };
}
