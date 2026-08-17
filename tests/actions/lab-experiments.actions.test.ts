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

vi.mock("@/server/repositories/lab-experiments.repository", () => ({
  labExperimentsRepository: {
    create: (input: unknown) => createMock(input),
    findById: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    setPublished: vi.fn(),
    setFeatured: vi.fn(),
  },
}));

const { createLabExperiment } = await import("@/server/actions/lab-experiments.actions");
const { UnauthorizedError } = await import("@/lib/auth/requireAdmin");

const validInput = {
  title: "Generador de documentación con IA",
  stack: ["TypeScript"],
  status: "experiment",
  isPublished: false,
  isFeatured: false,
  sortOrder: 0,
};

describe("createLabExperiment", () => {
  beforeEach(() => {
    requireAdminMock.mockReset();
    createMock.mockReset();
    revalidatePathMock.mockReset();
  });

  it("rechaza sin sesión admin", async () => {
    requireAdminMock.mockRejectedValue(new UnauthorizedError());

    await expect(createLabExperiment(validInput)).rejects.toBeInstanceOf(UnauthorizedError);
    expect(createMock).not.toHaveBeenCalled();
  });

  it("rechaza input inválido antes de llamar al repositorio", async () => {
    requireAdminMock.mockResolvedValue({ id: "admin-1" });

    await expect(createLabExperiment({ title: "" })).rejects.toThrow();
    expect(createMock).not.toHaveBeenCalled();
  });

  it("crea el experimento y revalida las rutas correctas", async () => {
    requireAdminMock.mockResolvedValue({ id: "admin-1" });
    createMock.mockResolvedValue({ ...validInput, id: "e1", labNumber: 1 });

    const result = await createLabExperiment(validInput);

    expect(result.success).toBe(true);
    expect(revalidatePathMock).toHaveBeenCalledWith("/");
    expect(revalidatePathMock).toHaveBeenCalledWith("/lab");
    expect(revalidatePathMock).toHaveBeenCalledWith("/admin/lab");
  });
});
