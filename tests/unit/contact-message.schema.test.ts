import { describe, expect, it } from "vitest";
import {
  createContactMessageSchema,
  createLeadManualSchema,
  updateLeadPipelineSchema,
} from "@/lib/validation/contact-message.schema";

const validInput = {
  name: "Visitante",
  email: "visitante@example.com",
  message: "Hola, quiero hablar de un proyecto interesante.",
};

describe("createContactMessageSchema", () => {
  it("acepta un mensaje valido", () => {
    expect(createContactMessageSchema.safeParse(validInput).success).toBe(true);
  });

  it("acepta interest opcional", () => {
    const result = createContactMessageSchema.safeParse({ ...validInput, interest: "AI projects" });
    expect(result.success).toBe(true);
  });

  it("rechaza sin nombre", () => {
    expect(createContactMessageSchema.safeParse({ ...validInput, name: undefined }).success).toBe(false);
  });

  it("rechaza un email invalido", () => {
    expect(
      createContactMessageSchema.safeParse({ ...validInput, email: "no-es-un-email" }).success,
    ).toBe(false);
  });

  it("rechaza un mensaje demasiado corto", () => {
    expect(createContactMessageSchema.safeParse({ ...validInput, message: "hola" }).success).toBe(
      false,
    );
  });

  it("rechaza un mensaje demasiado largo", () => {
    const result = createContactMessageSchema.safeParse({
      ...validInput,
      message: "a".repeat(2001),
    });
    expect(result.success).toBe(false);
  });

  it("rechaza un nombre demasiado largo", () => {
    const result = createContactMessageSchema.safeParse({ ...validInput, name: "a".repeat(121) });
    expect(result.success).toBe(false);
  });
});

describe("createLeadManualSchema", () => {
  it("acepta un alta manual sin mensaje (default vacio)", () => {
    const result = createLeadManualSchema.safeParse({ name: "Referido", email: "referido@example.com" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.message).toBe("");
    }
  });

  it("rechaza un email invalido", () => {
    const result = createLeadManualSchema.safeParse({ name: "Referido", email: "no-es-un-email" });
    expect(result.success).toBe(false);
  });
});

describe("updateLeadPipelineSchema", () => {
  it("acepta un cambio de fase valido", () => {
    const result = updateLeadPipelineSchema.safeParse({ pipelineStatus: "contactado" });
    expect(result.success).toBe(true);
  });

  it("acepta notas internas opcionales", () => {
    const result = updateLeadPipelineSchema.safeParse({
      pipelineStatus: "propuesta_enviada",
      internalNotes: "Enviada propuesta el lunes",
    });
    expect(result.success).toBe(true);
  });

  it("rechaza una fase que no existe", () => {
    const result = updateLeadPipelineSchema.safeParse({ pipelineStatus: "en_negociacion" });
    expect(result.success).toBe(false);
  });
});
