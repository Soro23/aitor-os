import { describe, expect, it } from "vitest";
import { createProjectSchema } from "@/lib/validation/project.schema";

const validInput = {
  slug: "trading-platform",
  name: "Trading Platform",
  technologies: ["TypeScript", "Next.js"],
  status: "en_desarrollo" as const,
  progress: 40,
  isPublished: false,
  isFeatured: false,
  sortOrder: 0,
};

describe("createProjectSchema", () => {
  it("acepta un proyecto valido", () => {
    const result = createProjectSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it("aplica defaults cuando se omiten campos opcionales", () => {
    const result = createProjectSchema.safeParse({ slug: "homelab", name: "Homelab" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.status).toBe("idea");
      expect(result.data.progress).toBe(0);
      expect(result.data.isPublished).toBe(false);
      expect(result.data.technologies).toEqual([]);
    }
  });

  it("rechaza sin slug", () => {
    const result = createProjectSchema.safeParse({ ...validInput, slug: undefined });
    expect(result.success).toBe(false);
  });

  it("rechaza un slug que no es kebab-case", () => {
    const result = createProjectSchema.safeParse({ ...validInput, slug: "Trading Platform" });
    expect(result.success).toBe(false);
  });

  it("rechaza sin nombre", () => {
    const result = createProjectSchema.safeParse({ ...validInput, name: undefined });
    expect(result.success).toBe(false);
  });

  it("rechaza un estado fuera del enum", () => {
    const result = createProjectSchema.safeParse({ ...validInput, status: "cancelado" });
    expect(result.success).toBe(false);
  });

  it("rechaza progreso fuera de 0-100", () => {
    expect(createProjectSchema.safeParse({ ...validInput, progress: -1 }).success).toBe(false);
    expect(createProjectSchema.safeParse({ ...validInput, progress: 101 }).success).toBe(false);
  });

  it("rechaza una githubUrl invalida", () => {
    const result = createProjectSchema.safeParse({ ...validInput, githubUrl: "no-es-una-url" });
    expect(result.success).toBe(false);
  });

  it("acepta githubUrl vacia (campo opcional)", () => {
    const result = createProjectSchema.safeParse({ ...validInput, githubUrl: "" });
    expect(result.success).toBe(true);
  });
});
