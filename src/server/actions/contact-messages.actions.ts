"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { isRateLimited } from "@/lib/rate-limit";
import {
  createContactMessageSchema,
  createLeadManualSchema,
  updateLeadPipelineSchema,
} from "@/lib/validation/contact-message.schema";
import { contactMessagesRepository } from "@/server/repositories/contact-messages.repository";

function revalidateLeadPaths() {
  revalidatePath("/admin/leads");
  revalidatePath("/admin/mensajes");
}

export interface SubmitContactMessageState {
  success?: boolean;
  error?: string;
}

/**
 * Unica Server Action de escritura publica del proyecto: sin requireAdmin().
 * La proteccion es RLS insert-only (ver contactMessagesRepository.create)
 * mas rate limiting por IP aqui — documentado explicitamente porque rompe
 * el patron general "toda Server Action de escritura requiere admin".
 */
export async function submitContactMessage(
  _prevState: SubmitContactMessageState,
  formData: FormData,
): Promise<SubmitContactMessageState> {
  // Honeypot: campo oculto que solo un bot rellena (ver ContactForm.tsx).
  // Se responde success sin guardar nada, para no delatar la trampa.
  if (formData.get("website")) {
    return { success: true };
  }

  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (isRateLimited(`contact:${ip}`)) {
    return { error: "Demasiados mensajes enviados. Inténtalo de nuevo en unos minutos." };
  }

  const parsed = createContactMessageSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
    interest: formData.get("interest") || undefined,
  });

  if (!parsed.success) {
    return { error: "Revisa los campos del formulario." };
  }

  await contactMessagesRepository.create(parsed.data);
  return { success: true };
}

export async function markMessageAsRead(id: string) {
  await requireAdmin();
  await contactMessagesRepository.markAsRead(id);
  revalidatePath("/admin/mensajes");
  return { success: true };
}

export async function deleteMessage(id: string) {
  await requireAdmin();
  await contactMessagesRepository.delete(id);
  revalidatePath("/admin/mensajes");
  return { success: true };
}

export async function createLead(input: unknown) {
  await requireAdmin();
  const data = createLeadManualSchema.parse(input);
  const lead = await contactMessagesRepository.createManual(data);
  revalidateLeadPaths();
  return { success: true, lead };
}

export async function updateLeadPipeline(id: string, input: unknown) {
  await requireAdmin();
  const data = updateLeadPipelineSchema.parse(input);
  const lead = await contactMessagesRepository.updatePipeline(id, data);
  revalidateLeadPaths();
  return { success: true, lead };
}
