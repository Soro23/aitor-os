"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import {
  createFinancialEntrySchema,
  updateFinancialEntrySchema,
} from "@/lib/validation/financial-entry.schema";
import { financialEntriesRepository } from "@/server/repositories/financial-entries.repository";

function revalidateFinancialEntryPaths() {
  revalidatePath("/admin/finanzas");
}

export async function createFinancialEntry(input: unknown) {
  await requireAdmin();
  const data = createFinancialEntrySchema.parse(input);
  const entry = await financialEntriesRepository.create(data);
  revalidateFinancialEntryPaths();
  return { success: true, entry };
}

export async function updateFinancialEntry(id: string, input: unknown) {
  await requireAdmin();
  const data = updateFinancialEntrySchema.parse(input);
  const entry = await financialEntriesRepository.update(id, data);
  revalidateFinancialEntryPaths();
  return { success: true, entry };
}

export async function deleteFinancialEntry(id: string) {
  await requireAdmin();
  await financialEntriesRepository.delete(id);
  revalidateFinancialEntryPaths();
  return { success: true };
}
