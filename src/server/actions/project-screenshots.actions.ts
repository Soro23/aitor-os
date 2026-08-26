"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import {
  createProjectScreenshotSchema,
  updateProjectScreenshotSchema,
} from "@/lib/validation/project-screenshot.schema";
import { projectScreenshotsRepository } from "@/server/repositories/project-screenshots.repository";
import { projectImagesRepository } from "@/server/repositories/project-images.repository";
import { projectsRepository } from "@/server/repositories/projects.repository";

async function revalidateProjectScreenshotPaths(projectId: string) {
  revalidatePath("/admin/proyectos");
  const project = await projectsRepository.findById(projectId);
  if (project) revalidatePath(`/proyectos/${project.slug}`);
}

export interface AddProjectScreenshotInput {
  projectId: string;
  file: File;
  altText?: string;
  sortOrder?: number;
}

export async function addProjectScreenshot(input: AddProjectScreenshotInput) {
  await requireAdmin();
  const imageUrl = await projectImagesRepository.upload(input.file, input.projectId, "screenshot");
  const data = createProjectScreenshotSchema.parse({
    projectId: input.projectId,
    imageUrl,
    altText: input.altText,
    sortOrder: input.sortOrder,
  });
  const screenshot = await projectScreenshotsRepository.create(data);
  await revalidateProjectScreenshotPaths(input.projectId);
  return { success: true, screenshot };
}

export async function updateProjectScreenshot(id: string, input: unknown) {
  await requireAdmin();
  const data = updateProjectScreenshotSchema.parse(input);
  const screenshot = await projectScreenshotsRepository.update(id, data);
  await revalidateProjectScreenshotPaths(screenshot.projectId);
  return { success: true, screenshot };
}

export async function removeProjectScreenshot(id: string) {
  await requireAdmin();
  const screenshot = await projectScreenshotsRepository.findById(id);
  if (!screenshot) return { success: true };

  await projectScreenshotsRepository.delete(id);
  await projectImagesRepository.remove(screenshot.imageUrl);
  await revalidateProjectScreenshotPaths(screenshot.projectId);
  return { success: true };
}
