"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import {
  createLabExperimentSchema,
  updateLabExperimentSchema,
} from "@/lib/validation/lab-experiment.schema";
import { labExperimentsRepository } from "@/server/repositories/lab-experiments.repository";

function revalidateLabPaths() {
  revalidatePath("/");
  revalidatePath("/lab");
  revalidatePath("/admin/lab");
}

export async function createLabExperiment(input: unknown) {
  await requireAdmin();
  const data = createLabExperimentSchema.parse(input);
  const experiment = await labExperimentsRepository.create(data);
  revalidateLabPaths();
  return { success: true, experiment };
}

export async function updateLabExperiment(id: string, input: unknown) {
  await requireAdmin();
  const data = updateLabExperimentSchema.parse(input);
  const experiment = await labExperimentsRepository.update(id, data);
  revalidateLabPaths();
  return { success: true, experiment };
}

export async function deleteLabExperiment(id: string) {
  await requireAdmin();
  await labExperimentsRepository.delete(id);
  revalidateLabPaths();
  return { success: true };
}

export async function setLabExperimentPublished(id: string, value: boolean) {
  await requireAdmin();
  const experiment = await labExperimentsRepository.setPublished(id, value);
  revalidateLabPaths();
  return { success: true, experiment };
}

export async function setLabExperimentFeatured(id: string, value: boolean) {
  await requireAdmin();
  const experiment = await labExperimentsRepository.setFeatured(id, value);
  revalidateLabPaths();
  return { success: true, experiment };
}
