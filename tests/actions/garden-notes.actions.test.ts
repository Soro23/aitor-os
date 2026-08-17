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

vi.mock("@/server/repositories/garden-notes.repository", () => ({
  gardenNotesRepository: {
    create: (input: unknown) => createMock(input),
    findById: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    setPublished: vi.fn(),
    setFeatured: vi.fn(),
  },
}));

const { createGardenNote } = await import("@/server/actions/garden-notes.actions");
const { UnauthorizedError } = await import("@/lib/auth/requireAdmin");

const validInput = {
  slug: "active-directory-basico",
  title: "Active Directory básico",
  category: "sistemas",
  status: "seed",
  isPublished: false,
  isFeatured: false,
  sortOrder: 0,
};

describe("createGardenNote", () => {
  beforeEach(() => {
    requireAdminMock.mockReset();
    createMock.mockReset();
    revalidatePathMock.mockReset();
  });

  it("rechaza sin sesión admin", async () => {
    requireAdminMock.mockRejectedValue(new UnauthorizedError());

    await expect(createGardenNote(validInput)).rejects.toBeInstanceOf(UnauthorizedError);
    expect(createMock).not.toHaveBeenCalled();
  });

  it("rechaza input inválido antes de llamar al repositorio", async () => {
    requireAdminMock.mockResolvedValue({ id: "admin-1" });

    await expect(createGardenNote({ title: "" })).rejects.toThrow();
    expect(createMock).not.toHaveBeenCalled();
  });

  it("crea la nota y revalida las rutas correctas", async () => {
    requireAdminMock.mockResolvedValue({ id: "admin-1" });
    createMock.mockResolvedValue({ ...validInput, id: "n1" });

    const result = await createGardenNote(validInput);

    expect(result.success).toBe(true);
    expect(revalidatePathMock).toHaveBeenCalledWith("/");
    expect(revalidatePathMock).toHaveBeenCalledWith("/garden");
    expect(revalidatePathMock).toHaveBeenCalledWith("/admin/garden");
    expect(revalidatePathMock).toHaveBeenCalledWith("/garden/active-directory-basico");
  });
});
