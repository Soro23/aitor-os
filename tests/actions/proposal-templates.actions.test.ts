import { beforeEach, describe, expect, it, vi } from "vitest";

const requireAdminMock = vi.fn();
const createMock = vi.fn();
const revalidatePathMock = vi.fn();

vi.mock("@/lib/auth/requireAdmin", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/auth/requireAdmin")>();
  return { ...actual, requireAdmin: () => requireAdminMock() };
});

vi.mock("next/cache", () => ({
  revalidatePath: (path: string) => revalidatePathMock(path),
}));

vi.mock("@/server/repositories/proposal-templates.repository", () => ({
  proposalTemplatesRepository: {
    create: (input: unknown) => createMock(input),
    findById: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    setActive: vi.fn(),
  },
}));

const { createProposalTemplate } = await import("@/server/actions/proposal-templates.actions");
const { UnauthorizedError } = await import("@/lib/auth/requireAdmin");

const validInput = { name: "Propuesta estándar", content: "Contenido.", isActive: true, sortOrder: 0 };

describe("createProposalTemplate", () => {
  beforeEach(() => {
    requireAdminMock.mockReset();
    createMock.mockReset();
    revalidatePathMock.mockReset();
  });

  it("rechaza sin sesión admin", async () => {
    requireAdminMock.mockRejectedValue(new UnauthorizedError());
    await expect(createProposalTemplate(validInput)).rejects.toBeInstanceOf(UnauthorizedError);
    expect(createMock).not.toHaveBeenCalled();
  });

  it("rechaza input inválido antes de llamar al repositorio", async () => {
    requireAdminMock.mockResolvedValue({ id: "admin-1" });
    await expect(createProposalTemplate({ name: "" })).rejects.toThrow();
    expect(createMock).not.toHaveBeenCalled();
  });

  it("crea la plantilla y revalida la ruta de admin", async () => {
    requireAdminMock.mockResolvedValue({ id: "admin-1" });
    createMock.mockResolvedValue({ ...validInput, id: "t1" });

    const result = await createProposalTemplate(validInput);

    expect(result.success).toBe(true);
    expect(revalidatePathMock).toHaveBeenCalledWith("/admin/plantillas");
  });
});
