import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { setupAdminSession } from "../helpers/admin-session";

// Contra Supabase local real (nunca mocks) — requiere `npx supabase start`.
let adminClient: Awaited<ReturnType<typeof setupAdminSession>>["adminClient"];
const seededIds: string[] = [];

beforeAll(async () => {
  ({ adminClient } = await setupAdminSession());
});

afterAll(async () => {
  if (!adminClient || seededIds.length === 0) return;
  await adminClient.from("lab_experiments").delete().in("id", seededIds);
});

describe("labExperimentsRepository", () => {
  it("create asigna lab_number automaticamente (no aceptado como input)", async () => {
    const { labExperimentsRepository } = await import(
      "@/server/repositories/lab-experiments.repository"
    );

    const experiment = await labExperimentsRepository.create({
      title: `Experimento ${Date.now()}`,
      stack: [],
      status: "experiment",
      isPublished: false,
      isFeatured: false,
      sortOrder: 0,
    });
    seededIds.push(experiment.id);

    expect(typeof experiment.labNumber).toBe("number");
    expect(experiment.labNumber).toBeGreaterThan(0);
  });

  it("findById devuelve null si no existe", async () => {
    const { labExperimentsRepository } = await import(
      "@/server/repositories/lab-experiments.repository"
    );
    const result = await labExperimentsRepository.findById("00000000-0000-0000-0000-000000000000");
    expect(result).toBeNull();
  });

  it("findPublished nunca devuelve borradores", async () => {
    const { data: draft } = await adminClient
      .from("lab_experiments")
      .insert({ title: `draft-${Date.now()}`, is_published: false })
      .select("id")
      .single();
    seededIds.push(draft!.id);

    const { labExperimentsRepository } = await import(
      "@/server/repositories/lab-experiments.repository"
    );
    const published = await labExperimentsRepository.findPublished();

    expect(published.some((e) => e.id === draft!.id)).toBe(false);
  });

  it("delete elimina el experimento", async () => {
    const { data: seeded } = await adminClient
      .from("lab_experiments")
      .insert({ title: `delete-${Date.now()}` })
      .select("id")
      .single();
    seededIds.push(seeded!.id);

    const { labExperimentsRepository } = await import(
      "@/server/repositories/lab-experiments.repository"
    );
    await labExperimentsRepository.delete(seeded!.id);
    const result = await labExperimentsRepository.findById(seeded!.id);

    expect(result).toBeNull();
    seededIds.splice(seededIds.indexOf(seeded!.id), 1);
  });
});
