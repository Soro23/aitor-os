import { describe, expect, it } from "vitest";
import { createProposalTemplateSchema } from "@/lib/validation/proposal-template.schema";

const validInput = {
  name: "Propuesta estándar",
  content: "## Alcance\n\n...",
  isActive: true,
  sortOrder: 0,
};

describe("createProposalTemplateSchema", () => {
  it("acepta una plantilla válida", () => {
    expect(createProposalTemplateSchema.safeParse(validInput).success).toBe(true);
  });

  it("aplica defaults cuando se omiten campos opcionales", () => {
    const result = createProposalTemplateSchema.safeParse({
      name: "Propuesta mínima",
      content: "Contenido.",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.isActive).toBe(true);
      expect(result.data.sortOrder).toBe(0);
    }
  });

  it("rechaza sin nombre", () => {
    const result = createProposalTemplateSchema.safeParse({ ...validInput, name: undefined });
    expect(result.success).toBe(false);
  });

  it("rechaza sin contenido", () => {
    const result = createProposalTemplateSchema.safeParse({ ...validInput, content: "" });
    expect(result.success).toBe(false);
  });
});
