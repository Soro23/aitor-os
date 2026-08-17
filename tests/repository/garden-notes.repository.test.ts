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
  await adminClient.from("garden_notes").delete().in("id", seededIds);
});

async function seedNote(overrides: Record<string, unknown> = {}) {
  const slug = `test-note-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const { data, error } = await adminClient
    .from("garden_notes")
    .insert({ slug, title: slug, category: "ideas", ...overrides })
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(`No se pudo sembrar la nota de prueba: ${error?.message}`);
  }

  seededIds.push(data.id);
  return data;
}

describe("gardenNotesRepository", () => {
  it("findPublished nunca devuelve borradores", async () => {
    const draft = await seedNote({ is_published: false });
    const { gardenNotesRepository } = await import("@/server/repositories/garden-notes.repository");

    const published = await gardenNotesRepository.findPublished();

    expect(published.some((n) => n.id === draft.id)).toBe(false);
  });

  it("findPublishedByCategory filtra por categoria y por is_published", async () => {
    const published = await seedNote({ is_published: true, category: "sistemas" });
    await seedNote({ is_published: false, category: "sistemas" });
    const { gardenNotesRepository } = await import("@/server/repositories/garden-notes.repository");

    const result = await gardenNotesRepository.findPublishedByCategory("sistemas");

    expect(result.some((n) => n.id === published.id)).toBe(true);
    expect(result.every((n) => n.category === "sistemas")).toBe(true);
  });

  it("findById devuelve null si no existe", async () => {
    const { gardenNotesRepository } = await import("@/server/repositories/garden-notes.repository");
    const result = await gardenNotesRepository.findById("00000000-0000-0000-0000-000000000000");
    expect(result).toBeNull();
  });

  it("create aplica los defaults del schema", async () => {
    const { gardenNotesRepository } = await import("@/server/repositories/garden-notes.repository");
    const note = await gardenNotesRepository.create({
      slug: `create-defaults-${Date.now()}`,
      title: "Create defaults",
      category: "ideas",
      status: "seed",
      isPublished: false,
      isFeatured: false,
      sortOrder: 0,
    });
    seededIds.push(note.id);

    expect(note.status).toBe("seed");
    expect(note.isPublished).toBe(false);
  });

  it("update no sobrescribe con null los campos no enviados", async () => {
    const seeded = await seedNote({ content: "Contenido original" });
    const { gardenNotesRepository } = await import("@/server/repositories/garden-notes.repository");

    const updated = await gardenNotesRepository.update(seeded.id, { title: "Nuevo título" });

    expect(updated.title).toBe("Nuevo título");
    expect(updated.content).toBe("Contenido original");
  });

  it("delete elimina la nota", async () => {
    const seeded = await seedNote();
    const { gardenNotesRepository } = await import("@/server/repositories/garden-notes.repository");

    await gardenNotesRepository.delete(seeded.id);
    const result = await gardenNotesRepository.findById(seeded.id);

    expect(result).toBeNull();
    seededIds.splice(seededIds.indexOf(seeded.id), 1);
  });
});

describe("gardenNoteRelationsRepository", () => {
  it("addRelation/findRelatedTo/removeRelation funcionan de extremo a extremo", async () => {
    const noteA = await seedNote({ is_published: true });
    const noteB = await seedNote({ is_published: true });
    const { gardenNoteRelationsRepository } = await import(
      "@/server/repositories/garden-note-relations.repository"
    );

    await gardenNoteRelationsRepository.addRelation(noteA.id, noteB.id);
    const related = await gardenNoteRelationsRepository.findRelatedTo(noteA.id);
    expect(related.some((n) => n.id === noteB.id)).toBe(true);

    await gardenNoteRelationsRepository.removeRelation(noteA.id, noteB.id);
    const relatedAfter = await gardenNoteRelationsRepository.findRelatedTo(noteA.id);
    expect(relatedAfter.some((n) => n.id === noteB.id)).toBe(false);
  });
});
