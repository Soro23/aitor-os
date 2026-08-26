import { beforeEach, describe, expect, it, vi } from "vitest";

const requireAdminMock = vi.fn();
const createMock = vi.fn();
const updateMock = vi.fn();
const revalidatePathMock = vi.fn();
const uploadImageMock = vi.fn();

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
    update: (id: string, input: unknown) => updateMock(id, input),
    delete: vi.fn(),
    setPublished: vi.fn(),
    setFeatured: vi.fn(),
  },
}));

vi.mock("@/server/repositories/project-images.repository", () => ({
  projectImagesRepository: {
    upload: (file: unknown, projectId: string, kind: string) =>
      uploadImageMock(file, projectId, kind),
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
    updateMock.mockReset();
    revalidatePathMock.mockReset();
    uploadImageMock.mockReset();
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

  it("sube la imagen principal y guarda la URL devuelta", async () => {
    requireAdminMock.mockResolvedValue({ id: "admin-1" });
    createMock.mockResolvedValue({ ...validInput, id: "p1" });
    uploadImageMock.mockResolvedValue("https://storage.example.com/project-images/p1/cover-abc.png");
    updateMock.mockResolvedValue({
      ...validInput,
      id: "p1",
      coverImageUrl: "https://storage.example.com/project-images/p1/cover-abc.png",
    });

    const coverImageFile = new File(["fake"], "cover.png", { type: "image/png" });
    const result = await createProject({ ...validInput, coverImageFile });

    expect(uploadImageMock).toHaveBeenCalledWith(coverImageFile, "p1", "cover");
    expect(updateMock).toHaveBeenCalledWith("p1", {
      coverImageUrl: "https://storage.example.com/project-images/p1/cover-abc.png",
    });
    expect(result.project.coverImageUrl).toBe(
      "https://storage.example.com/project-images/p1/cover-abc.png",
    );
  });

  it("no sube nada a Storage cuando no hay archivo", async () => {
    requireAdminMock.mockResolvedValue({ id: "admin-1" });
    createMock.mockResolvedValue({ ...validInput, id: "p1" });

    await createProject(validInput);

    expect(uploadImageMock).not.toHaveBeenCalled();
    expect(updateMock).not.toHaveBeenCalled();
  });
});
