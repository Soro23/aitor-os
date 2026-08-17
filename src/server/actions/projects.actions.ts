"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createProjectSchema, updateProjectSchema } from "@/lib/validation/project.schema";
import { projectsRepository } from "@/server/repositories/projects.repository";

function revalidateProjectPaths(slug?: string) {
  revalidatePath("/");
  revalidatePath("/proyectos");
  revalidatePath("/admin/proyectos");
  if (slug) revalidatePath(`/proyectos/${slug}`);
}

export async function createProject(input: unknown) {
  await requireAdmin();
  const data = createProjectSchema.parse(input);
  const project = await projectsRepository.create(data);
  revalidateProjectPaths(project.slug);
  return { success: true, project };
}

export async function updateProject(id: string, input: unknown) {
  await requireAdmin();
  const data = updateProjectSchema.parse(input);
  const project = await projectsRepository.update(id, data);
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
