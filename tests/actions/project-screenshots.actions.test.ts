import { beforeEach, describe, expect, it, vi } from "vitest";

const requireAdminMock = vi.fn();
const findByProjectIdMock = vi.fn();
const createMock = vi.fn();
const uploadImageMock = vi.fn();
const revalidatePathMock = vi.fn();
const findProjectByIdMock = vi.fn();

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

vi.mock("@/server/repositories/project-screenshots.repository", () => ({
  projectScreenshotsRepository: {
    findByProjectId: (projectId: string) => findByProjectIdMock(projectId),
    create: (input: unknown) => createMock(input),
    findById: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock("@/server/repositories/project-images.repository", () => ({
  projectImagesRepository: {
    upload: (file: unknown, projectId: string, kind: string) =>
      uploadImageMock(file, projectId, kind),
    remove: vi.fn(),
  },
}));

vi.mock("@/server/repositories/projects.repository", () => ({
  projectsRepository: {
    findById: (id: string) => findProjectByIdMock(id),
  },
}));

const { addProjectScreenshots } = await import("@/server/actions/project-screenshots.actions");
const { UnauthorizedError } = await import("@/lib/auth/requireAdmin");

function makeFile(name: string) {
  return new File(["fake"], name, { type: "image/png" });
}

describe("addProjectScreenshots", () => {
  beforeEach(() => {
    requireAdminMock.mockReset();
    findByProjectIdMock.mockReset();
    createMock.mockReset();
    uploadImageMock.mockReset();
    revalidatePathMock.mockReset();
    findProjectByIdMock.mockReset();
  });

  it("rechaza sin sesión admin", async () => {
    requireAdminMock.mockRejectedValue(new UnauthorizedError());

    await expect(
      addProjectScreenshots({ projectId: "11111111-1111-4111-8111-111111111111", files: [makeFile("a.png")] }),
    ).rejects.toBeInstanceOf(UnauthorizedError);
    expect(uploadImageMock).not.toHaveBeenCalled();
  });

  it("rechaza si se supera el límite de 10 capturas", async () => {
    requireAdminMock.mockResolvedValue({ id: "admin-1" });
    findByProjectIdMock.mockResolvedValue(Array.from({ length: 8 }, (_, i) => ({ id: `s${i}` })));

    await expect(
      addProjectScreenshots({
        projectId: "11111111-1111-4111-8111-111111111111",
        files: [makeFile("a.png"), makeFile("b.png"), makeFile("c.png")],
      }),
    ).rejects.toThrow(/Máximo 10/);
    expect(uploadImageMock).not.toHaveBeenCalled();
  });

  it("sube y crea una fila por archivo con sortOrder secuencial", async () => {
    requireAdminMock.mockResolvedValue({ id: "admin-1" });
    findByProjectIdMock.mockResolvedValue([{ id: "s0" }]);
    findProjectByIdMock.mockResolvedValue({ id: "11111111-1111-4111-8111-111111111111", slug: "demo" });
    uploadImageMock
      .mockResolvedValueOnce("https://storage.example.com/project-images/11111111-1111-4111-8111-111111111111/a.png")
      .mockResolvedValueOnce("https://storage.example.com/project-images/11111111-1111-4111-8111-111111111111/b.png");
    createMock
      .mockResolvedValueOnce({ id: "s1", sortOrder: 1 })
      .mockResolvedValueOnce({ id: "s2", sortOrder: 2 });

    const result = await addProjectScreenshots({
      projectId: "11111111-1111-4111-8111-111111111111",
      files: [makeFile("a.png"), makeFile("b.png")],
    });

    expect(uploadImageMock).toHaveBeenNthCalledWith(1, expect.anything(), "11111111-1111-4111-8111-111111111111", "screenshot");
    expect(createMock).toHaveBeenNthCalledWith(1, expect.objectContaining({ sortOrder: 1 }));
    expect(createMock).toHaveBeenNthCalledWith(2, expect.objectContaining({ sortOrder: 2 }));
    expect(result.screenshots).toHaveLength(2);
    expect(revalidatePathMock).toHaveBeenCalledWith("/admin/proyectos");
    expect(revalidatePathMock).toHaveBeenCalledWith("/proyectos/demo");
  });
});
