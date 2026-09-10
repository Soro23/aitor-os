"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import {
  createUiStyleImageSchema,
  updateUiStyleImageSchema,
  MAX_IMAGES_PER_UI_STYLE,
} from "@/lib/validation/ui-style-image.schema";
import { parseOrThrowReadable } from "@/lib/validation/parse-or-throw-readable";
import { uiStyleImagesRepository } from "@/server/repositories/ui-style-images.repository";
import { uiStyleStorageRepository } from "@/server/repositories/ui-style-storage.repository";
import { uiStylesRepository } from "@/server/repositories/ui-styles.repository";

async function revalidateUiStyleImagePaths(uiStyleId: string) {
  revalidatePath("/admin/estilos-ui");
  revalidatePath("/garden/estilos-ui");
  const style = await uiStylesRepository.findById(uiStyleId);
  if (style) revalidatePath(`/garden/estilos-ui/${style.slug}`);
}

export interface AddUiStyleImageInput {
  uiStyleId: string;
  file: File;
}

export async function addUiStyleImage(input: AddUiStyleImageInput) {
  await requireAdmin();

  const existing = await uiStyleImagesRepository.findByUiStyleId(input.uiStyleId);
  if (existing.length >= MAX_IMAGES_PER_UI_STYLE) {
    throw new Error(`Máximo ${MAX_IMAGES_PER_UI_STYLE} imágenes por estilo.`);
  }

  const imageUrl = await uiStyleStorageRepository.upload(input.file, input.uiStyleId, "gallery");
  const data = parseOrThrowReadable(createUiStyleImageSchema, {
    uiStyleId: input.uiStyleId,
    imageUrl,
    sortOrder: existing.length,
  });
  const image = await uiStyleImagesRepository.create(data);

  await revalidateUiStyleImagePaths(input.uiStyleId);
  return { success: true, image };
}

export async function updateUiStyleImage(id: string, input: unknown) {
  await requireAdmin();
  const data = parseOrThrowReadable(updateUiStyleImageSchema, input);
  const image = await uiStyleImagesRepository.update(id, data);
  await revalidateUiStyleImagePaths(image.uiStyleId);
  return { success: true, image };
}

export async function removeUiStyleImage(id: string) {
  await requireAdmin();
  const image = await uiStyleImagesRepository.findById(id);
  if (!image) return { success: true };

  await uiStyleImagesRepository.delete(id);
  await uiStyleStorageRepository.remove(image.imageUrl);
  await revalidateUiStyleImagePaths(image.uiStyleId);
  return { success: true };
}
