import { describe, expect, it } from "vitest";
import { createGardenNoteRelationSchema } from "@/lib/validation/garden-note-relation.schema";

const noteId = "11111111-1111-4111-8111-111111111111";
const relatedNoteId = "22222222-2222-4222-8222-222222222222";

describe("createGardenNoteRelationSchema", () => {
  it("acepta dos ids distintos", () => {
    expect(createGardenNoteRelationSchema.safeParse({ noteId, relatedNoteId }).success).toBe(true);
  });

  it("rechaza relacionar una nota consigo misma", () => {
    const result = createGardenNoteRelationSchema.safeParse({
      noteId,
      relatedNoteId: noteId,
    });
    expect(result.success).toBe(false);
  });

  it("rechaza ids que no son uuid", () => {
    const result = createGardenNoteRelationSchema.safeParse({
      noteId: "no-es-un-uuid",
      relatedNoteId,
    });
    expect(result.success).toBe(false);
  });
});
