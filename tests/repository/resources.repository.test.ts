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
  await adminClient.from("resources").delete().in("id", seededIds);
});

describe("resourcesRepository", () => {
  it("findPublished nunca devuelve borradores", async () => {
    const { data: draft } = await adminClient
      .from("resources")
      .insert({
        name: `draft-${Date.now()}`,
        type: "herramienta",
        url: "https://example.com",
        is_published: false,
      })
      .select("id")
      .single();
    seededIds.push(draft!.id);

    const { resourcesRepository } = await import("@/server/repositories/resources.repository");
    const published = await resourcesRepository.findPublished();

    expect(published.some((r) => r.id === draft!.id)).toBe(false);
  });

  it("findById devuelve null si no existe", async () => {
    const { resourcesRepository } = await import("@/server/repositories/resources.repository");
    const result = await resourcesRepository.findById("00000000-0000-0000-0000-000000000000");
    expect(result).toBeNull();
  });

  it("create aplica los defaults del schema", async () => {
    const { resourcesRepository } = await import("@/server/repositories/resources.repository");
    const resource = await resourcesRepository.create({
      name: `create-defaults-${Date.now()}`,
      type: "doc",
      url: "https://example.com",
      isPublished: false,
      isFeatured: false,
      sortOrder: 0,
    });
    seededIds.push(resource.id);

    expect(resource.isPublished).toBe(false);
    expect(resource.type).toBe("doc");
  });

  it("delete elimina el recurso", async () => {
    const { data: seeded } = await adminClient
      .from("resources")
      .insert({ name: `delete-${Date.now()}`, type: "doc", url: "https://example.com" })
      .select("id")
      .single();
    seededIds.push(seeded!.id);

    const { resourcesRepository } = await import("@/server/repositories/resources.repository");
    await resourcesRepository.delete(seeded!.id);
    const result = await resourcesRepository.findById(seeded!.id);

    expect(result).toBeNull();
    seededIds.splice(seededIds.indexOf(seeded!.id), 1);
  });
});
