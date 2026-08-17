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
  await adminClient.from("projects").delete().in("id", seededIds);
});

async function seedProject(overrides: Record<string, unknown> = {}) {
  const slug = `test-project-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const { data, error } = await adminClient
    .from("projects")
    .insert({ slug, name: slug, ...overrides })
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(`No se pudo sembrar el proyecto de prueba: ${error?.message}`);
  }

  seededIds.push(data.id);
  return data;
}

describe("projectsRepository", () => {
  it("findPublished nunca devuelve borradores", async () => {
    const draft = await seedProject({ is_published: false });
    const { projectsRepository } = await import("@/server/repositories/projects.repository");

    const published = await projectsRepository.findPublished();

    expect(published.some((p) => p.id === draft.id)).toBe(false);
  });

  it("findPublished incluye un proyecto publicado", async () => {
    const published = await seedProject({ is_published: true });
    const { projectsRepository } = await import("@/server/repositories/projects.repository");

    const result = await projectsRepository.findPublished();

    expect(result.some((p) => p.id === published.id)).toBe(true);
  });

  it("findFeatured solo devuelve publicados Y destacados", async () => {
    const featuredNotPublished = await seedProject({ is_published: false, is_featured: true });
    const publishedNotFeatured = await seedProject({ is_published: true, is_featured: false });
    const { projectsRepository } = await import("@/server/repositories/projects.repository");

    const result = await projectsRepository.findFeatured();

    expect(result.some((p) => p.id === featuredNotPublished.id)).toBe(false);
    expect(result.some((p) => p.id === publishedNotFeatured.id)).toBe(false);
  });

  it("findById devuelve null si no existe", async () => {
    const { projectsRepository } = await import("@/server/repositories/projects.repository");
    const result = await projectsRepository.findById("00000000-0000-0000-0000-000000000000");
    expect(result).toBeNull();
  });

  it("findBySlug devuelve null si no existe", async () => {
    const { projectsRepository } = await import("@/server/repositories/projects.repository");
    const result = await projectsRepository.findBySlug("no-existe-este-slug");
    expect(result).toBeNull();
  });

  it("create aplica los defaults del schema", async () => {
    const { projectsRepository } = await import("@/server/repositories/projects.repository");
    const project = await projectsRepository.create({
      slug: `create-defaults-${Date.now()}`,
      name: "Create defaults",
      technologies: [],
      status: "idea",
      progress: 0,
      isPublished: false,
      isFeatured: false,
      sortOrder: 0,
    });
    seededIds.push(project.id);

    expect(project.status).toBe("idea");
    expect(project.isPublished).toBe(false);
    expect(project.technologies).toEqual([]);
  });

  it("update no sobrescribe con null los campos no enviados", async () => {
    const seeded = await seedProject({ description: "Descripcion original" });
    const { projectsRepository } = await import("@/server/repositories/projects.repository");

    const updated = await projectsRepository.update(seeded.id, { name: "Nuevo nombre" });

    expect(updated.name).toBe("Nuevo nombre");
    expect(updated.description).toBe("Descripcion original");
  });

  it("delete elimina el proyecto", async () => {
    const seeded = await seedProject();
    const { projectsRepository } = await import("@/server/repositories/projects.repository");

    await projectsRepository.delete(seeded.id);
    const result = await projectsRepository.findById(seeded.id);

    expect(result).toBeNull();
    seededIds.splice(seededIds.indexOf(seeded.id), 1);
  });

  it("findPublished ordena por sort_order", async () => {
    const second = await seedProject({ is_published: true, sort_order: 2 });
    const first = await seedProject({ is_published: true, sort_order: 1 });
    const { projectsRepository } = await import("@/server/repositories/projects.repository");

    const result = await projectsRepository.findPublished();
    const firstIndex = result.findIndex((p) => p.id === first.id);
    const secondIndex = result.findIndex((p) => p.id === second.id);

    expect(firstIndex).toBeLessThan(secondIndex);
  });
});
