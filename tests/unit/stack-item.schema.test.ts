import { describe, expect, it } from "vitest";
import {
  createStackItemSchema,
  STACK_CATEGORY_VALUES,
  STACK_USAGE_LEVEL_VALUES,
} from "@/lib/validation/stack-item.schema";

const validInput = {
  name: "TypeScript",
  category: "desarrollo" as const,
  usageLevel: "daily" as const,
  isVisible: true,
  sortOrder: 0,
};

describe("createStackItemSchema", () => {
  it("acepta un item valido", () => {
    expect(createStackItemSchema.safeParse(validInput).success).toBe(true);
  });

  it.each(STACK_CATEGORY_VALUES)("acepta la categoria '%s'", (category) => {
    expect(createStackItemSchema.safeParse({ ...validInput, category }).success).toBe(true);
  });

  it.each(STACK_USAGE_LEVEL_VALUES)("acepta el nivel de uso '%s'", (usageLevel) => {
    expect(createStackItemSchema.safeParse({ ...validInput, usageLevel }).success).toBe(true);
  });

  it("rechaza sin nombre", () => {
    const result = createStackItemSchema.safeParse({ ...validInput, name: undefined });
    expect(result.success).toBe(false);
  });

  it("rechaza una categoria fuera del enum", () => {
    const result = createStackItemSchema.safeParse({ ...validInput, category: "otra" });
    expect(result.success).toBe(false);
  });

  it("rechaza un nivel de uso fuera del enum", () => {
    const result = createStackItemSchema.safeParse({ ...validInput, usageLevel: "nunca" });
    expect(result.success).toBe(false);
  });
});
