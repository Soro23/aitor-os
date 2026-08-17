import { describe, expect, it } from "vitest";
import { createResourceSchema, RESOURCE_TYPE_VALUES } from "@/lib/validation/resource.schema";

const validInput = {
  name: "Zod",
  type: "libreria" as const,
  url: "https://zod.dev",
  isPublished: false,
  isFeatured: false,
  sortOrder: 0,
};

describe("createResourceSchema", () => {
  it("acepta un recurso valido", () => {
    expect(createResourceSchema.safeParse(validInput).success).toBe(true);
  });

  it.each(RESOURCE_TYPE_VALUES)("acepta el tipo '%s'", (type) => {
    const result = createResourceSchema.safeParse({ ...validInput, type });
    expect(result.success).toBe(true);
  });

  it("rechaza un tipo fuera del enum", () => {
    const result = createResourceSchema.safeParse({ ...validInput, type: "otro" });
    expect(result.success).toBe(false);
  });

  it("rechaza sin nombre", () => {
    const result = createResourceSchema.safeParse({ ...validInput, name: undefined });
    expect(result.success).toBe(false);
  });

  it("rechaza una url invalida", () => {
    const result = createResourceSchema.safeParse({ ...validInput, url: "no-es-una-url" });
    expect(result.success).toBe(false);
  });

  it("aplica defaults cuando se omiten campos opcionales", () => {
    const result = createResourceSchema.safeParse({
      name: "Recurso mínimo",
      type: "doc",
      url: "https://example.com",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.isPublished).toBe(false);
      expect(result.data.sortOrder).toBe(0);
    }
  });
});
