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

vi.mock("@/server/repositories/now-items.repository", () => ({
  nowItemsRepository: {
    create: (input: unknown) => createMock(input),
    findById: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    setActive: vi.fn(),
  },
}));

const { createNowItem } = await import("@/server/actions/now-items.actions");
const { UnauthorizedError } = await import("@/lib/auth/requireAdmin");

const validInput = { category: "building", title: "Aitor OS", isActive: true, sortOrder: 0 };

describe("createNowItem", () => {
  beforeEach(() => {
    requireAdminMock.mockReset();
    createMock.mockReset();
    revalidatePathMock.mockReset();
  });

  it("rechaza sin sesión admin", async () => {
    requireAdminMock.mockRejectedValue(new UnauthorizedError());
    await expect(createNowItem(validInput)).rejects.toBeInstanceOf(UnauthorizedError);
    expect(createMock).not.toHaveBeenCalled();
  });

  it("rechaza input inválido antes de llamar al repositorio", async () => {
    requireAdminMock.mockResolvedValue({ id: "admin-1" });
    await expect(createNowItem({ title: "" })).rejects.toThrow();
    expect(createMock).not.toHaveBeenCalled();
  });

  it("crea el item y revalida las rutas correctas", async () => {
    requireAdminMock.mockResolvedValue({ id: "admin-1" });
    createMock.mockResolvedValue({ ...validInput, id: "n1" });

    const result = await createNowItem(validInput);

    expect(result.success).toBe(true);
    expect(revalidatePathMock).toHaveBeenCalledWith("/now");
    expect(revalidatePathMock).toHaveBeenCalledWith("/dashboard");
    expect(revalidatePathMock).toHaveBeenCalledWith("/admin/now");
  });
});
