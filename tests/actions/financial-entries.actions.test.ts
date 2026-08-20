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

vi.mock("@/server/repositories/financial-entries.repository", () => ({
  financialEntriesRepository: {
    create: (input: unknown) => createMock(input),
    findById: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

const { createFinancialEntry } = await import("@/server/actions/financial-entries.actions");
const { UnauthorizedError } = await import("@/lib/auth/requireAdmin");

const validInput = {
  type: "ingreso",
  amount: 500,
  description: "Anticipo proyecto X",
  entryDate: "2026-08-20",
};

describe("createFinancialEntry", () => {
  beforeEach(() => {
    requireAdminMock.mockReset();
    createMock.mockReset();
    revalidatePathMock.mockReset();
  });

  it("rechaza sin sesión admin", async () => {
    requireAdminMock.mockRejectedValue(new UnauthorizedError());
    await expect(createFinancialEntry(validInput)).rejects.toBeInstanceOf(UnauthorizedError);
    expect(createMock).not.toHaveBeenCalled();
  });

  it("rechaza input inválido antes de llamar al repositorio", async () => {
    requireAdminMock.mockResolvedValue({ id: "admin-1" });
    await expect(createFinancialEntry({ ...validInput, amount: -5 })).rejects.toThrow();
    expect(createMock).not.toHaveBeenCalled();
  });

  it("crea el movimiento y revalida la ruta de admin", async () => {
    requireAdminMock.mockResolvedValue({ id: "admin-1" });
    createMock.mockResolvedValue({ ...validInput, id: "f1" });

    const result = await createFinancialEntry(validInput);

    expect(result.success).toBe(true);
    expect(revalidatePathMock).toHaveBeenCalledWith("/admin/finanzas");
  });
});
