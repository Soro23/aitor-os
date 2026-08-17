"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createNowItemSchema, updateNowItemSchema } from "@/lib/validation/now-item.schema";
import { nowItemsRepository } from "@/server/repositories/now-items.repository";

function revalidateNowPaths() {
  revalidatePath("/");
  revalidatePath("/now");
  revalidatePath("/dashboard");
  revalidatePath("/admin/now");
}

export async function createNowItem(input: unknown) {
  await requireAdmin();
  const data = createNowItemSchema.parse(input);
  const item = await nowItemsRepository.create(data);
  revalidateNowPaths();
  return { success: true, item };
}

export async function updateNowItem(id: string, input: unknown) {
  await requireAdmin();
  const data = updateNowItemSchema.parse(input);
  const item = await nowItemsRepository.update(id, data);
  revalidateNowPaths();
  return { success: true, item };
}

export async function deleteNowItem(id: string) {
  await requireAdmin();
  await nowItemsRepository.delete(id);
  revalidateNowPaths();
  return { success: true };
}

export async function setNowItemActive(id: string, value: boolean) {
  await requireAdmin();
  const item = await nowItemsRepository.setActive(id, value);
  revalidateNowPaths();
  return { success: true, item };
}
