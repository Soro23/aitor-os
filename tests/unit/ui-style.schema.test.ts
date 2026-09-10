import { describe, expect, it } from "vitest";
import { createUiStyleSchema, updateUiStyleSchema } from "@/lib/validation/ui-style.schema";

const validInput = {
  slug: "glassmorphism",
  name: "Glassmorphism",
  category: "modernos" as const,
  summary: "Paneles translúcidos con desenfoque de fondo.",
  isPublished: true,
  isFeatured: false,
  sortOrder: 9,
};

describe("createUiStyleSchema", () => {
  it("acepta un estilo valido", () => {
    expect(createUiStyleSchema.safeParse(validInput).success).toBe(true);
  });

  it("aplica defaults cuando se omiten campos opcionales", () => {
    const result = createUiStyleSchema.safeParse({
      slug: "bauhaus",
      name: "Bauhaus",
      category: "minimalistas",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.isPublished).toBe(false);
      expect(result.data.isFeatured).toBe(false);
      expect(result.data.sortOrder).toBe(0);
    }
  });

  it("rechaza una categoria fuera del enum", () => {
    const result = createUiStyleSchema.safeParse({ ...validInput, category: "otra" });
    expect(result.success).toBe(false);
  });

  it("rechaza sin nombre", () => {
    const result = createUiStyleSchema.safeParse({ ...validInput, name: "" });
    expect(result.success).toBe(false);
  });

  it("rechaza un slug que no es kebab-case", () => {
    const result = createUiStyleSchema.safeParse({ ...validInput, slug: "Neo Brutalism" });
    expect(result.success).toBe(false);
  });

  it("acepta slugs que empiezan por numero", () => {
    const result = createUiStyleSchema.safeParse({ ...validInput, slug: "8-bit-design" });
    expect(result.success).toBe(true);
  });

  it("rechaza una portada que no es una URL", () => {
    const result = createUiStyleSchema.safeParse({ ...validInput, coverImageUrl: "no-es-url" });
    expect(result.success).toBe(false);
  });
});

describe("updateUiStyleSchema", () => {
  it("acepta un patch parcial", () => {
    const result = updateUiStyleSchema.safeParse({ summary: "Otro resumen." });
    expect(result.success).toBe(true);
  });

  it("sigue validando los campos presentes", () => {
    const result = updateUiStyleSchema.safeParse({ category: "otra" });
    expect(result.success).toBe(false);
  });
});
