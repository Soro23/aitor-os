import { describe, expect, it } from "vitest";
import { createContactMessageSchema } from "@/lib/validation/contact-message.schema";

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
