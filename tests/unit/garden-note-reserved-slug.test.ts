import { describe, expect, it } from "vitest";
import {
  createGardenNoteSchema,
  RESERVED_GARDEN_SLUGS,
} from "@/lib/validation/garden-note.schema";

describe("slugs reservados del Garden", () => {
  it("rechaza una nota que ocupe el slug de una sección propia", () => {
    for (const reserved of RESERVED_GARDEN_SLUGS) {
      const result = createGardenNoteSchema.safeParse({
        slug: reserved,
        title: "Nota que pisa una ruta",
        category: "ideas",
      });
      expect(result.success).toBe(false);
    }
  });

  it("sigue aceptando un slug normal", () => {
    const result = createGardenNoteSchema.safeParse({
      slug: "estilos-visuales",
      title: "Estilos visuales",
      category: "ideas",
    });
    expect(result.success).toBe(true);
  });
});
