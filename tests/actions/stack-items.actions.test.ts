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

vi.mock("@/server/repositories/stack-items.repository", () => ({
  stackItemsRepository: {
    create: (input: unknown) => createMock(input),
    findById: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    setVisible: vi.fn(),
  },
}));

const { createStackItem } = await import("@/server/actions/stack-items.actions");
const { UnauthorizedError } = await import("@/lib/auth/requireAdmin");

const validInput = {
  name: "TypeScript",
  category: "desarrollo",
  usageLevel: "daily",
  isVisible: true,
  sortOrder: 0,
};

describe("createStackItem", () => {
  beforeEach(() => {
    requireAdminMock.mockReset();
    createMock.mockReset();
    revalidatePathMock.mockReset();
  });

  it("rechaza sin sesión admin", async () => {
    requireAdminMock.mockRejectedValue(new UnauthorizedError());
    await expect(createStackItem(validInput)).rejects.toBeInstanceOf(UnauthorizedError);
    expect(createMock).not.toHaveBeenCalled();
  });

  it("rechaza input inválido antes de llamar al repositorio", async () => {
    requireAdminMock.mockResolvedValue({ id: "admin-1" });
    await expect(createStackItem({ name: "" })).rejects.toThrow();
    expect(createMock).not.toHaveBeenCalled();
  });

  it("crea el item y revalida las rutas correctas", async () => {
    requireAdminMock.mockResolvedValue({ id: "admin-1" });
    createMock.mockResolvedValue({ ...validInput, id: "s1" });

    const result = await createStackItem(validInput);

    expect(result.success).toBe(true);
    expect(revalidatePathMock).toHaveBeenCalledWith("/stack");
    expect(revalidatePathMock).toHaveBeenCalledWith("/admin/stack");
  });
});
