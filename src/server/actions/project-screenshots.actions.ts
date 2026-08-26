"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import {
  createProjectScreenshotSchema,
  updateProjectScreenshotSchema,
  MAX_SCREENSHOTS_PER_PROJECT,
} from "@/lib/validation/project-screenshot.schema";
import { projectScreenshotsRepository } from "@/server/repositories/project-screenshots.repository";
import { projectImagesRepository } from "@/server/repositories/project-images.repository";
import { projectsRepository } from "@/server/repositories/projects.repository";

async function revalidateProjectScreenshotPaths(projectId: string) {
  revalidatePath("/admin/proyectos");
  const project = await projectsRepository.findById(projectId);
  if (project) revalidatePath(`/proyectos/${project.slug}`);
}

export interface AddProjectScreenshotsInput {
  projectId: string;
  files: File[];
}

export async function addProjectScreenshots(input: AddProjectScreenshotsInput) {
  await requireAdmin();
  if (input.files.length === 0) return { success: true, screenshots: [] };

  const existing = await projectScreenshotsRepository.findByProjectId(input.projectId);
  if (existing.length + input.files.length > MAX_SCREENSHOTS_PER_PROJECT) {
    throw new Error(
      `Máximo ${MAX_SCREENSHOTS_PER_PROJECT} capturas por proyecto (ya hay ${existing.length}).`,
    );
  }

  const screenshots = [];
  for (const [index, file] of input.files.entries()) {
    const imageUrl = await projectImagesRepository.upload(file, input.projectId, "screenshot");
    const data = createProjectScreenshotSchema.parse({
      projectId: input.projectId,
      imageUrl,
      sortOrder: existing.length + index,
    });
    screenshots.push(await projectScreenshotsRepository.create(data));
  }

  await revalidateProjectScreenshotPaths(input.projectId);
  return { success: true, screenshots };
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
