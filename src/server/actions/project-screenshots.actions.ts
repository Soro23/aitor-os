"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import {
  createProjectScreenshotSchema,
  updateProjectScreenshotSchema,
} from "@/lib/validation/project-screenshot.schema";
import { projectScreenshotsRepository } from "@/server/repositories/project-screenshots.repository";

export async function addProjectScreenshot(input: unknown) {
  await requireAdmin();
  const data = createProjectScreenshotSchema.parse(input);
  const screenshot = await projectScreenshotsRepository.create(data);
  revalidatePath("/admin/proyectos");
  return { success: true, screenshot };
}

export async function updateProjectScreenshot(id: string, input: unknown) {
  await requireAdmin();
  const data = updateProjectScreenshotSchema.parse(input);
  const screenshot = await projectScreenshotsRepository.update(id, data);
  revalidatePath("/admin/proyectos");
  return { success: true, screenshot };
}

export async function removeProjectScreenshot(id: string) {
  await requireAdmin();
  await projectScreenshotsRepository.delete(id);
  revalidatePath("/admin/proyectos");
  return { success: true };
}
