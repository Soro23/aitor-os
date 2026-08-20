import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { setupAdminSession } from "../helpers/admin-session";

// Contra Supabase local real (nunca mocks del cliente) — requiere
// `npx supabase start`.
let adminClient: Awaited<ReturnType<typeof setupAdminSession>>["adminClient"];
const seededIds: string[] = [];

beforeAll(async () => {
  ({ adminClient } = await setupAdminSession());
});

afterAll(async () => {
  if (!adminClient || seededIds.length === 0) return;
  await adminClient.from("proposal_templates").delete().in("id", seededIds);
});

async function seedTemplate(overrides: Record<string, unknown> = {}) {
  const { data, error } = await adminClient
    .from("proposal_templates")
    .insert({ name: "Plantilla de prueba", content: "Contenido de prueba.", ...overrides })
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(`No se pudo sembrar la plantilla de prueba: ${error?.message}`);
  }

  seededIds.push(data.id);
  return data;
}

describe("proposalTemplatesRepository", () => {
  it("findAll incluye una plantilla sembrada", async () => {
    const seeded = await seedTemplate();
    const { proposalTemplatesRepository } = await import(
      "@/server/repositories/proposal-templates.repository"
    );

    const all = await proposalTemplatesRepository.findAll();
    expect(all.some((t) => t.id === seeded.id)).toBe(true);
  });

  it("findById devuelve null si no existe", async () => {
    const { proposalTemplatesRepository } = await import(
      "@/server/repositories/proposal-templates.repository"
    );
    const result = await proposalTemplatesRepository.findById("00000000-0000-0000-0000-000000000000");
    expect(result).toBeNull();
  });

  it("create inserta con is_active por defecto en true", async () => {
    const { proposalTemplatesRepository } = await import(
      "@/server/repositories/proposal-templates.repository"
    );
    const template = await proposalTemplatesRepository.create({
      name: "Propuesta nueva",
      content: "Contenido.",
      isActive: true,
      sortOrder: 0,
    });
    seededIds.push(template.id);

    expect(template.isActive).toBe(true);
  });

  it("update modifica solo los campos enviados", async () => {
    const seeded = await seedTemplate();
    const { proposalTemplatesRepository } = await import(
      "@/server/repositories/proposal-templates.repository"
    );

    const updated = await proposalTemplatesRepository.update(seeded.id, { name: "Plantilla actualizada" });

    expect(updated.name).toBe("Plantilla actualizada");
    expect(updated.content).toBe("Contenido de prueba.");
  });

  it("setActive cambia is_active", async () => {
    const seeded = await seedTemplate();
    const { proposalTemplatesRepository } = await import(
      "@/server/repositories/proposal-templates.repository"
    );

    const updated = await proposalTemplatesRepository.setActive(seeded.id, false);
    expect(updated.isActive).toBe(false);
  });

  it("delete elimina la plantilla", async () => {
    const seeded = await seedTemplate();
    const { proposalTemplatesRepository } = await import(
      "@/server/repositories/proposal-templates.repository"
    );

    await proposalTemplatesRepository.delete(seeded.id);
    const result = await proposalTemplatesRepository.findById(seeded.id);

    expect(result).toBeNull();
    seededIds.splice(seededIds.indexOf(seeded.id), 1);
  });
});
