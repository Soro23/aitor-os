"use server";

import { revalidatePath } from "next/cache";
import { ZodError } from "zod";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createProjectSchema, updateProjectSchema } from "@/lib/validation/project.schema";
import { projectsRepository } from "@/server/repositories/projects.repository";
import { projectImagesRepository } from "@/server/repositories/project-images.repository";

function parseOrThrowReadable<T>(schema: { parse: (input: unknown) => T }, input: unknown): T {
  try {
    return schema.parse(input);
  } catch (err) {
    if (err instanceof ZodError) {
      const detail = err.issues.map((issue) => `${issue.path.join(".") || "campo"}: ${issue.message}`).join(" · ");
      throw new Error(detail);
    }
    throw err;
  }
}

function revalidateProjectPaths(slug?: string) {
  revalidatePath("/");
  revalidatePath("/proyectos");
  revalidatePath("/admin/proyectos");
  if (slug) revalidatePath(`/proyectos/${slug}`);
}

interface ProjectFormInput {
  coverImageFile?: File | null;
  [key: string]: unknown;
}

export async function createProject(input: ProjectFormInput) {
  await requireAdmin();
  const { coverImageFile, ...rest } = input;
  const data = parseOrThrowReadable(createProjectSchema, rest);

  let project = await projectsRepository.create(data);
  if (coverImageFile) {
    const coverImageUrl = await projectImagesRepository.upload(coverImageFile, project.id, "cover");
    project = await projectsRepository.update(project.id, { coverImageUrl });
  }

  revalidateProjectPaths(project.slug);
  return { success: true, project };
}

export async function updateProject(id: string, input: ProjectFormInput) {
  await requireAdmin();
  const { coverImageFile, ...rest } = input;
  const data = parseOrThrowReadable(updateProjectSchema, rest);

  let project = await projectsRepository.update(id, data);
  if (coverImageFile) {
    const coverImageUrl = await projectImagesRepository.upload(coverImageFile, id, "cover");
    project = await projectsRepository.update(id, { coverImageUrl });
  }

  revalidateProjectPaths(project.slug);
  return { success: true, project };
}

export async function deleteProject(id: string) {
  await requireAdmin();
  const project = await projectsRepository.findById(id);
  await projectsRepository.delete(id);
  revalidateProjectPaths(project?.slug);
  return { success: true };
}

export async function setProjectPublished(id: string, value: boolean) {
  await requireAdmin();
  const project = await projectsRepository.setPublished(id, value);
  revalidateProjectPaths(project.slug);
  return { success: true, project };
}

export async function setProjectFeatured(id: string, value: boolean) {
  await requireAdmin();
  const project = await projectsRepository.setFeatured(id, value);
  revalidateProjectPaths(project.slug);
  return { success: true, project };
}
