import { describe, expect, it } from "vitest";
import { createLabExperimentSchema } from "@/lib/validation/lab-experiment.schema";

const validInput = {
  title: "Generador de documentación con IA",
  stack: ["TypeScript", "OpenAI API"],
  status: "experiment" as const,
  isPublished: false,
  isFeatured: false,
  sortOrder: 0,
};

describe("createLabExperimentSchema", () => {
  it("acepta un experimento valido", () => {
    expect(createLabExperimentSchema.safeParse(validInput).success).toBe(true);
  });

  it("no acepta lab_number como input (no forma parte del schema)", () => {
    const result = createLabExperimentSchema.safeParse({ ...validInput, labNumber: 14 });
    expect(result.success).toBe(true);
    if (result.success) {
      expect("labNumber" in result.data).toBe(false);
    }
  });

  it("aplica defaults cuando se omiten campos opcionales", () => {
    const result = createLabExperimentSchema.safeParse({ title: "Experimento mínimo" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.status).toBe("experiment");
      expect(result.data.stack).toEqual([]);
    }
  });

  it("rechaza sin titulo", () => {
    const result = createLabExperimentSchema.safeParse({ ...validInput, title: undefined });
    expect(result.success).toBe(false);
  });

  it("rechaza un estado fuera del enum", () => {
    const result = createLabExperimentSchema.safeParse({ ...validInput, status: "done" });
    expect(result.success).toBe(false);
  });
});
