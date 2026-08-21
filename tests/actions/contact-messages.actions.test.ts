import { beforeEach, describe, expect, it, vi } from "vitest";

const requireAdminMock = vi.fn();
const createMock = vi.fn();
const markAsReadMock = vi.fn();
const deleteMock = vi.fn();
const revalidatePathMock = vi.fn();
const createManualMock = vi.fn();
const updatePipelineMock = vi.fn();

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
    createManual: (input: unknown) => createManualMock(input),
    updatePipeline: (id: string, input: unknown) => updatePipelineMock(id, input),
  },
}));

const { submitContactMessage, markMessageAsRead, deleteMessage, createLead, updateLeadPipeline } = await import(
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

  it("descarta en silencio un envio con el honeypot relleno", async () => {
    const formData = formDataFrom({
      name: "Bot",
      email: "bot@example.com",
      message: "Hola, quiero hablar de un proyecto interesante.",
      website: "http://spam.example.com",
    });

    const result = await submitContactMessage({}, formData);

    expect(result.success).toBe(true);
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

describe("createLead / updateLeadPipeline", () => {
  beforeEach(() => {
    requireAdminMock.mockReset();
    createManualMock.mockReset();
    updatePipelineMock.mockReset();
    revalidatePathMock.mockReset();
  });

  it("createLead rechaza sin sesión admin", async () => {
    requireAdminMock.mockRejectedValue(new UnauthorizedError());
    await expect(createLead({ name: "Referido", email: "referido@example.com" })).rejects.toBeInstanceOf(
      UnauthorizedError,
    );
    expect(createManualMock).not.toHaveBeenCalled();
  });

  it("createLead crea el lead y revalida /admin/leads y /admin/mensajes", async () => {
    requireAdminMock.mockResolvedValue({ id: "admin-1" });
    createManualMock.mockResolvedValue({ id: "lead-1" });

    const result = await createLead({ name: "Referido", email: "referido@example.com" });

    expect(result.success).toBe(true);
    expect(createManualMock).toHaveBeenCalledWith(
      expect.objectContaining({ name: "Referido", email: "referido@example.com" }),
    );
    expect(revalidatePathMock).toHaveBeenCalledWith("/admin/leads");
    expect(revalidatePathMock).toHaveBeenCalledWith("/admin/mensajes");
  });

  it("updateLeadPipeline rechaza sin sesión admin", async () => {
    requireAdminMock.mockRejectedValue(new UnauthorizedError());
    await expect(updateLeadPipeline("m1", { pipelineStatus: "contactado" })).rejects.toBeInstanceOf(
      UnauthorizedError,
    );
    expect(updatePipelineMock).not.toHaveBeenCalled();
  });

  it("updateLeadPipeline actualiza la fase", async () => {
    requireAdminMock.mockResolvedValue({ id: "admin-1" });
    updatePipelineMock.mockResolvedValue({ id: "m1", pipelineStatus: "ganado" });

    const result = await updateLeadPipeline("m1", { pipelineStatus: "ganado" });

    expect(result.success).toBe(true);
    expect(updatePipelineMock).toHaveBeenCalledWith("m1", expect.objectContaining({ pipelineStatus: "ganado" }));
  });
});
