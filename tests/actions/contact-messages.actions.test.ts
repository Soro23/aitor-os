import { beforeEach, describe, expect, it, vi } from "vitest";

const requireAdminMock = vi.fn();
const createMock = vi.fn();
const markAsReadMock = vi.fn();
const deleteMock = vi.fn();
const revalidatePathMock = vi.fn();

vi.mock("@/lib/auth/requireAdmin", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/auth/requireAdmin")>();
  return { ...actual, requireAdmin: () => requireAdminMock() };
});

vi.mock("next/cache", () => ({
  revalidatePath: (path: string) => revalidatePathMock(path),
}));

vi.mock("next/headers", () => ({
  headers: async () => ({
    get: (name: string) => (name === "x-forwarded-for" ? "203.0.113.10" : null),
  }),
}));

vi.mock("@/server/repositories/contact-messages.repository", () => ({
  contactMessagesRepository: {
    create: (input: unknown) => createMock(input),
    findAll: vi.fn(),
    markAsRead: (id: string) => markAsReadMock(id),
    delete: (id: string) => deleteMock(id),
  },
}));

const { submitContactMessage, markMessageAsRead, deleteMessage } = await import(
  "@/server/actions/contact-messages.actions"
);
const { UnauthorizedError } = await import("@/lib/auth/requireAdmin");

function formDataFrom(fields: Record<string, string>) {
  const formData = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    formData.set(key, value);
  }
  return formData;
}

describe("submitContactMessage", () => {
  beforeEach(() => {
    createMock.mockReset();
  });

  it("crea el mensaje cuando los datos son validos", async () => {
    const formData = formDataFrom({
      name: "Visitante",
      email: "visitante@example.com",
      message: "Hola, quiero hablar de un proyecto interesante.",
    });

    const result = await submitContactMessage({}, formData);

    expect(result.success).toBe(true);
    expect(createMock).toHaveBeenCalledWith(
      expect.objectContaining({ name: "Visitante", email: "visitante@example.com" }),
    );
  });

  it("rechaza datos invalidos sin llamar al repositorio", async () => {
    const formData = formDataFrom({ name: "", email: "no-es-un-email", message: "corto" });

    const result = await submitContactMessage({}, formData);

    expect(result.error).toBeDefined();
    expect(createMock).not.toHaveBeenCalled();
  });

  it("aplica rate limiting por IP tras varios envios seguidos", async () => {
    const formData = formDataFrom({
      name: "Visitante",
      email: "visitante@example.com",
      message: "Hola, quiero hablar de un proyecto interesante.",
    });

    // El limite es 3 por minuto (ver src/lib/rate-limit.ts) — esta IP ya
    // acumulo llamadas del test anterior, así que basta con una mas.
    let lastResult;
    for (let i = 0; i < 5; i += 1) {
      lastResult = await submitContactMessage({}, formData);
    }

    expect(lastResult?.error).toMatch(/demasiados/i);
  });
});

describe("markMessageAsRead / deleteMessage", () => {
  beforeEach(() => {
    requireAdminMock.mockReset();
    markAsReadMock.mockReset();
    deleteMock.mockReset();
    revalidatePathMock.mockReset();
  });

  it("markMessageAsRead rechaza sin sesión admin", async () => {
    requireAdminMock.mockRejectedValue(new UnauthorizedError());
    await expect(markMessageAsRead("m1")).rejects.toBeInstanceOf(UnauthorizedError);
    expect(markAsReadMock).not.toHaveBeenCalled();
  });

  it("markMessageAsRead marca el mensaje y revalida /admin/mensajes", async () => {
    requireAdminMock.mockResolvedValue({ id: "admin-1" });
    await markMessageAsRead("m1");
    expect(markAsReadMock).toHaveBeenCalledWith("m1");
    expect(revalidatePathMock).toHaveBeenCalledWith("/admin/mensajes");
  });

  it("deleteMessage rechaza sin sesión admin", async () => {
    requireAdminMock.mockRejectedValue(new UnauthorizedError());
    await expect(deleteMessage("m1")).rejects.toBeInstanceOf(UnauthorizedError);
    expect(deleteMock).not.toHaveBeenCalled();
  });
});
