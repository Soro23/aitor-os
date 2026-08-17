"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createStackItemSchema, updateStackItemSchema } from "@/lib/validation/stack-item.schema";
import { stackItemsRepository } from "@/server/repositories/stack-items.repository";

function revalidateStackPaths() {
  revalidatePath("/stack");
  revalidatePath("/admin/stack");
}

export async function createStackItem(input: unknown) {
  await requireAdmin();
  const data = createStackItemSchema.parse(input);
  const item = await stackItemsRepository.create(data);
  revalidateStackPaths();
  return { success: true, item };
}

export async function updateStackItem(id: string, input: unknown) {
  await requireAdmin();
  const data = updateStackItemSchema.parse(input);
  const item = await stackItemsRepository.update(id, data);
  revalidateStackPaths();
  return { success: true, item };
}

export async function deleteStackItem(id: string) {
  await requireAdmin();
  await stackItemsRepository.delete(id);
  revalidateStackPaths();
  return { success: true };
}

export async function setStackItemVisible(id: string, value: boolean) {
  await requireAdmin();
  const item = await stackItemsRepository.setVisible(id, value);
  revalidateStackPaths();
  return { success: true, item };
}
