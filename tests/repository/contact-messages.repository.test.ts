import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { setupAdminSession } from "../helpers/admin-session";

// Contra Supabase local real (nunca mocks del cliente) — requiere
// `npx supabase start`. Sesión admin mockeada vía next/headers (ver
// tests/helpers/admin-session.ts) porque lib/supabase/server depende de
// cookies() de una request de Next.js real.
let adminClient: Awaited<ReturnType<typeof setupAdminSession>>["adminClient"];
const seededIds: string[] = [];

beforeAll(async () => {
  ({ adminClient } = await setupAdminSession());
});

afterAll(async () => {
  if (!adminClient || seededIds.length === 0) return;
  await adminClient.from("contact_messages").delete().in("id", seededIds);
});

async function seedMessage(overrides: Record<string, unknown> = {}) {
  const email = `test-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`;
  const { data, error } = await adminClient
    .from("contact_messages")
    .insert({ name: "Lead de prueba", email, message: "Mensaje de prueba.", ...overrides })
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(`No se pudo sembrar el mensaje de prueba: ${error?.message}`);
  }

  seededIds.push(data.id);
  return data;
}

describe("contactMessagesRepository", () => {
  it("findAll incluye un mensaje sembrado con pipeline_status por defecto", async () => {
    const seeded = await seedMessage();
    const { contactMessagesRepository } = await import("@/server/repositories/contact-messages.repository");

    const all = await contactMessagesRepository.findAll();
    const found = all.find((m) => m.id === seeded.id);

    expect(found).toBeDefined();
    expect(found?.pipelineStatus).toBe("nuevo");
  });

  it("findById devuelve null si no existe", async () => {
    const { contactMessagesRepository } = await import("@/server/repositories/contact-messages.repository");
    const result = await contactMessagesRepository.findById("00000000-0000-0000-0000-000000000000");
    expect(result).toBeNull();
  });

  it("createManual crea un lead con pipeline_status 'nuevo'", async () => {
    const { contactMessagesRepository } = await import("@/server/repositories/contact-messages.repository");
    const lead = await contactMessagesRepository.createManual({
      name: "Referido manual",
      email: `referido-${Date.now()}@example.com`,
      message: "",
    });
    seededIds.push(lead.id);

    expect(lead.pipelineStatus).toBe("nuevo");
    expect(lead.internalNotes).toBeNull();
  });

  it("updatePipeline cambia la fase y guarda notas internas", async () => {
    const seeded = await seedMessage();
    const { contactMessagesRepository } = await import("@/server/repositories/contact-messages.repository");

    const updated = await contactMessagesRepository.updatePipeline(seeded.id, {
      pipelineStatus: "contactado",
      internalNotes: "Llamada agendada",
    });

    expect(updated.pipelineStatus).toBe("contactado");
    expect(updated.internalNotes).toBe("Llamada agendada");
  });

  it("findByPipelineStatus solo devuelve leads de esa fase", async () => {
    const ganado = await seedMessage({ pipeline_status: "ganado" });
    const nuevo = await seedMessage({ pipeline_status: "nuevo" });
    const { contactMessagesRepository } = await import("@/server/repositories/contact-messages.repository");

    const result = await contactMessagesRepository.findByPipelineStatus("ganado");

    expect(result.some((m) => m.id === ganado.id)).toBe(true);
    expect(result.some((m) => m.id === nuevo.id)).toBe(false);
  });

  it("markAsRead marca is_read", async () => {
    const seeded = await seedMessage();
    const { contactMessagesRepository } = await import("@/server/repositories/contact-messages.repository");

    await contactMessagesRepository.markAsRead(seeded.id);
    const result = await contactMessagesRepository.findById(seeded.id);

    expect(result?.isRead).toBe(true);
  });

  it("delete elimina el mensaje", async () => {
    const seeded = await seedMessage();
    const { contactMessagesRepository } = await import("@/server/repositories/contact-messages.repository");

    await contactMessagesRepository.delete(seeded.id);
    const result = await contactMessagesRepository.findById(seeded.id);

    expect(result).toBeNull();
    seededIds.splice(seededIds.indexOf(seeded.id), 1);
  });
});
