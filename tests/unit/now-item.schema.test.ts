import { describe, expect, it } from "vitest";
import { createNowItemSchema } from "@/lib/validation/now-item.schema";

const validInput = {
  category: "building" as const,
  title: "Aitor OS",
  isActive: true,
  sortOrder: 0,
};

describe("createNowItemSchema", () => {
  it("acepta un item valido", () => {
    expect(createNowItemSchema.safeParse(validInput).success).toBe(true);
  });

  it("aplica defaults cuando se omiten campos opcionales", () => {
    const result = createNowItemSchema.safeParse({ category: "learning", title: "Rust" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.isActive).toBe(true);
    }
  });

  it("rechaza sin categoria", () => {
    const result = createNowItemSchema.safeParse({ ...validInput, category: undefined });
    expect(result.success).toBe(false);
  });

  it("rechaza una categoria fuera del enum", () => {
    const result = createNowItemSchema.safeParse({ ...validInput, category: "resting" });
    expect(result.success).toBe(false);
  });

  it("rechaza sin titulo", () => {
    const result = createNowItemSchema.safeParse({ ...validInput, title: undefined });
    expect(result.success).toBe(false);
  });
});
