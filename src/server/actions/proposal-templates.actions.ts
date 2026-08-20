"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import {
  createProposalTemplateSchema,
  updateProposalTemplateSchema,
} from "@/lib/validation/proposal-template.schema";
import { proposalTemplatesRepository } from "@/server/repositories/proposal-templates.repository";

function revalidateProposalTemplatePaths() {
  revalidatePath("/admin/plantillas");
}

export async function createProposalTemplate(input: unknown) {
  await requireAdmin();
  const data = createProposalTemplateSchema.parse(input);
  const template = await proposalTemplatesRepository.create(data);
  revalidateProposalTemplatePaths();
  return { success: true, template };
}

export async function updateProposalTemplate(id: string, input: unknown) {
  await requireAdmin();
  const data = updateProposalTemplateSchema.parse(input);
  const template = await proposalTemplatesRepository.update(id, data);
  revalidateProposalTemplatePaths();
  return { success: true, template };
}

export async function deleteProposalTemplate(id: string) {
  await requireAdmin();
  await proposalTemplatesRepository.delete(id);
  revalidateProposalTemplatePaths();
  return { success: true };
}

export async function setProposalTemplateActive(id: string, value: boolean) {
  await requireAdmin();
  const template = await proposalTemplatesRepository.setActive(id, value);
  revalidateProposalTemplatePaths();
  return { success: true, template };
}
