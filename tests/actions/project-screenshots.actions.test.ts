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

const { addProjectScreenshot } = await import("@/server/actions/project-screenshots.actions");
const { UnauthorizedError } = await import("@/lib/auth/requireAdmin");

const PROJECT_ID = "11111111-1111-4111-8111-111111111111";

function makeFile(name: string) {
  return new File(["fake"], name, { type: "image/png" });
}

describe("addProjectScreenshot", () => {
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
      addProjectScreenshot({ projectId: PROJECT_ID, file: makeFile("a.png") }),
    ).rejects.toBeInstanceOf(UnauthorizedError);
    expect(uploadImageMock).not.toHaveBeenCalled();
  });

  it("rechaza si ya se alcanzó el límite de 10 capturas", async () => {
    requireAdminMock.mockResolvedValue({ id: "admin-1" });
    findByProjectIdMock.mockResolvedValue(Array.from({ length: 10 }, (_, i) => ({ id: `s${i}` })));

    await expect(
      addProjectScreenshot({ projectId: PROJECT_ID, file: makeFile("a.png") }),
    ).rejects.toThrow(/Máximo 10/);
    expect(uploadImageMock).not.toHaveBeenCalled();
  });

  it("sube el archivo y crea la fila con el sortOrder siguiente", async () => {
    requireAdminMock.mockResolvedValue({ id: "admin-1" });
    findByProjectIdMock.mockResolvedValue([{ id: "s0" }]);
    findProjectByIdMock.mockResolvedValue({ id: PROJECT_ID, slug: "demo" });
    uploadImageMock.mockResolvedValue(`https://storage.example.com/project-images/${PROJECT_ID}/a.png`);
    createMock.mockResolvedValue({ id: "s1", sortOrder: 1 });

    const result = await addProjectScreenshot({ projectId: PROJECT_ID, file: makeFile("a.png") });

    expect(uploadImageMock).toHaveBeenCalledWith(expect.anything(), PROJECT_ID, "screenshot");
    expect(createMock).toHaveBeenCalledWith(expect.objectContaining({ sortOrder: 1 }));
    expect(result.screenshot).toEqual({ id: "s1", sortOrder: 1 });
    expect(revalidatePathMock).toHaveBeenCalledWith("/admin/proyectos");
    expect(revalidatePathMock).toHaveBeenCalledWith("/proyectos/demo");
  });
});
