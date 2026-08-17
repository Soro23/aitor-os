import { describe, expect, it } from "vitest";
import { createGardenNoteSchema } from "@/lib/validation/garden-note.schema";

const validInput = {
  slug: "active-directory-basico",
  title: "Active Directory básico",
  category: "sistemas" as const,
  status: "growing" as const,
  isPublished: false,
  isFeatured: false,
  sortOrder: 0,
};

describe("createGardenNoteSchema", () => {
  it("acepta una nota valida", () => {
    expect(createGardenNoteSchema.safeParse(validInput).success).toBe(true);
  });

  it("aplica defaults cuando se omiten campos opcionales", () => {
    const result = createGardenNoteSchema.safeParse({
      slug: "nota-minima",
      title: "Nota mínima",
      category: "ideas",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.status).toBe("seed");
      expect(result.data.isPublished).toBe(false);
    }
  });

  it("rechaza sin categoria", () => {
    const result = createGardenNoteSchema.safeParse({ ...validInput, category: undefined });
    expect(result.success).toBe(false);
  });

  it("rechaza una categoria fuera del enum", () => {
    const result = createGardenNoteSchema.safeParse({ ...validInput, category: "otra" });
    expect(result.success).toBe(false);
  });

  it("rechaza un estado fuera del enum", () => {
    const result = createGardenNoteSchema.safeParse({ ...validInput, status: "done" });
    expect(result.success).toBe(false);
  });

  it("rechaza sin titulo", () => {
    const result = createGardenNoteSchema.safeParse({ ...validInput, title: undefined });
    expect(result.success).toBe(false);
  });

  it("rechaza un slug que no es kebab-case", () => {
    const result = createGardenNoteSchema.safeParse({ ...validInput, slug: "Active Directory" });
    expect(result.success).toBe(false);
  });
});
