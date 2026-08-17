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

vi.mock("@/server/repositories/projects.repository", () => ({
  projectsRepository: {
    create: (input: unknown) => createMock(input),
    findById: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    setPublished: vi.fn(),
    setFeatured: vi.fn(),
  },
}));

const { createProject } = await import("@/server/actions/projects.actions");
const { UnauthorizedError } = await import("@/lib/auth/requireAdmin");

const validInput = {
  slug: "trading-platform",
  name: "Trading Platform",
  technologies: [],
  status: "idea",
  progress: 0,
  isPublished: false,
  isFeatured: false,
  sortOrder: 0,
};

describe("createProject", () => {
  beforeEach(() => {
    requireAdminMock.mockReset();
    createMock.mockReset();
    revalidatePathMock.mockReset();
  });

  it("rechaza sin sesión admin", async () => {
    requireAdminMock.mockRejectedValue(new UnauthorizedError());

    await expect(createProject(validInput)).rejects.toBeInstanceOf(UnauthorizedError);
    expect(createMock).not.toHaveBeenCalled();
  });

  it("rechaza input invalido antes de llamar al repositorio", async () => {
    requireAdminMock.mockResolvedValue({ id: "admin-1" });

    await expect(createProject({ name: "" })).rejects.toThrow();
    expect(createMock).not.toHaveBeenCalled();
  });

  it("crea el proyecto y revalida las rutas correctas", async () => {
    requireAdminMock.mockResolvedValue({ id: "admin-1" });
    createMock.mockResolvedValue({ ...validInput, id: "p1" });

    const result = await createProject(validInput);

    expect(result.success).toBe(true);
    expect(createMock).toHaveBeenCalledWith(expect.objectContaining({ slug: "trading-platform" }));
    expect(revalidatePathMock).toHaveBeenCalledWith("/");
    expect(revalidatePathMock).toHaveBeenCalledWith("/proyectos");
    expect(revalidatePathMock).toHaveBeenCalledWith("/admin/proyectos");
    expect(revalidatePathMock).toHaveBeenCalledWith("/proyectos/trading-platform");
  });
});
