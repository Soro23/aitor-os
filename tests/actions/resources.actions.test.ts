import { beforeEach, describe, expect, it, vi } from "vitest";

const requireAdminMock = vi.fn();
const createMock = vi.fn();
const revalidatePathMock = vi.fn();

vi.mock("@/lib/auth/requireAdmin", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/auth/requireAdmin")>();
  return {
    ...actual,
    requireAdmin: () => requireAdminMock(),
  };
});

vi.mock("next/cache", () => ({
  revalidatePath: (path: string) => revalidatePathMock(path),
}));

vi.mock("@/server/repositories/resources.repository", () => ({
  resourcesRepository: {
    create: (input: unknown) => createMock(input),
    findById: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    setPublished: vi.fn(),
    setFeatured: vi.fn(),
  },
}));

const { createResource } = await import("@/server/actions/resources.actions");
const { UnauthorizedError } = await import("@/lib/auth/requireAdmin");

const validInput = {
  name: "Zod",
  type: "libreria",
  url: "https://zod.dev",
  isPublished: false,
  isFeatured: false,
  sortOrder: 0,
};

describe("createResource", () => {
  beforeEach(() => {
    requireAdminMock.mockReset();
    createMock.mockReset();
    revalidatePathMock.mockReset();
  });

  it("rechaza sin sesión admin", async () => {
    requireAdminMock.mockRejectedValue(new UnauthorizedError());

    await expect(createResource(validInput)).rejects.toBeInstanceOf(UnauthorizedError);
    expect(createMock).not.toHaveBeenCalled();
  });

  it("rechaza input inválido antes de llamar al repositorio", async () => {
    requireAdminMock.mockResolvedValue({ id: "admin-1" });

    await expect(createResource({ name: "Sin URL" })).rejects.toThrow();
    expect(createMock).not.toHaveBeenCalled();
  });

  it("crea el recurso y revalida las rutas correctas", async () => {
    requireAdminMock.mockResolvedValue({ id: "admin-1" });
    createMock.mockResolvedValue({ ...validInput, id: "r1" });

    const result = await createResource(validInput);

    expect(result.success).toBe(true);
    expect(revalidatePathMock).toHaveBeenCalledWith("/recursos");
    expect(revalidatePathMock).toHaveBeenCalledWith("/admin/recursos");
  });
});
