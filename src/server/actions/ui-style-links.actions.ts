"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import {
  createUiStyleLinkSchema,
  updateUiStyleLinkSchema,
  MAX_LINKS_PER_UI_STYLE,
} from "@/lib/validation/ui-style-link.schema";
import { parseOrThrowReadable } from "@/lib/validation/parse-or-throw-readable";
import { uiStyleLinksRepository } from "@/server/repositories/ui-style-links.repository";
import { uiStylesRepository } from "@/server/repositories/ui-styles.repository";

async function revalidateUiStyleLinkPaths(uiStyleId: string) {
  revalidatePath("/admin/estilos-ui");
  revalidatePath("/garden/estilos-ui");
  const style = await uiStylesRepository.findById(uiStyleId);
  if (style) revalidatePath(`/garden/estilos-ui/${style.slug}`);
}

export async function addUiStyleLink(input: unknown) {
  await requireAdmin();
  const data = parseOrThrowReadable(createUiStyleLinkSchema, input);

  const existing = await uiStyleLinksRepository.findByUiStyleId(data.uiStyleId);
  if (existing.length >= MAX_LINKS_PER_UI_STYLE) {
    throw new Error(`Máximo ${MAX_LINKS_PER_UI_STYLE} enlaces por estilo.`);
  }

  const link = await uiStyleLinksRepository.create({ ...data, sortOrder: existing.length });
  await revalidateUiStyleLinkPaths(data.uiStyleId);
  return { success: true, link };
}

export async function updateUiStyleLink(id: string, input: unknown) {
  await requireAdmin();
  const data = parseOrThrowReadable(updateUiStyleLinkSchema, input);
  const link = await uiStyleLinksRepository.update(id, data);
  await revalidateUiStyleLinkPaths(link.uiStyleId);
  return { success: true, link };
}

export async function removeUiStyleLink(id: string) {
  await requireAdmin();
  const link = await uiStyleLinksRepository.findById(id);
  if (!link) return { success: true };

  await uiStyleLinksRepository.delete(id);
  await revalidateUiStyleLinkPaths(link.uiStyleId);
  return { success: true };
}
