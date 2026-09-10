"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createUiStyleSchema, updateUiStyleSchema } from "@/lib/validation/ui-style.schema";
import { parseOrThrowReadable } from "@/lib/validation/parse-or-throw-readable";
import { uiStylesRepository } from "@/server/repositories/ui-styles.repository";
import { uiStyleStorageRepository } from "@/server/repositories/ui-style-storage.repository";

function revalidateUiStylePaths(slug?: string) {
  revalidatePath("/garden");
  revalidatePath("/garden/estilos-ui");
  revalidatePath("/admin/estilos-ui");
  if (slug) revalidatePath(`/garden/estilos-ui/${slug}`);
}

interface UiStyleFormInput {
  coverImageFile?: File | null;
  [key: string]: unknown;
}

export async function createUiStyle(input: UiStyleFormInput) {
  await requireAdmin();
  const { coverImageFile, ...rest } = input;
  const data = parseOrThrowReadable(createUiStyleSchema, rest);

  let style = await uiStylesRepository.create(data);
  if (coverImageFile) {
    const coverImageUrl = await uiStyleStorageRepository.upload(coverImageFile, style.id, "cover");
    style = await uiStylesRepository.update(style.id, { coverImageUrl });
  }

  revalidateUiStylePaths(style.slug);
  return { success: true, style };
}

export async function updateUiStyle(id: string, input: UiStyleFormInput) {
  await requireAdmin();
  const { coverImageFile, ...rest } = input;
  const data = parseOrThrowReadable(updateUiStyleSchema, rest);

  let style = await uiStylesRepository.update(id, data);
  if (coverImageFile) {
    const coverImageUrl = await uiStyleStorageRepository.upload(coverImageFile, id, "cover");
    style = await uiStylesRepository.update(id, { coverImageUrl });
  }

  revalidateUiStylePaths(style.slug);
  return { success: true, style };
}

export async function deleteUiStyle(id: string) {
  await requireAdmin();
  const style = await uiStylesRepository.findById(id);
  await uiStylesRepository.delete(id);
  revalidateUiStylePaths(style?.slug);
  return { success: true };
}

export async function setUiStylePublished(id: string, value: boolean) {
  await requireAdmin();
  const style = await uiStylesRepository.setPublished(id, value);
  revalidateUiStylePaths(style.slug);
  return { success: true, style };
}

export async function setUiStyleFeatured(id: string, value: boolean) {
  await requireAdmin();
  const style = await uiStylesRepository.setFeatured(id, value);
  revalidateUiStylePaths(style.slug);
  return { success: true, style };
}
