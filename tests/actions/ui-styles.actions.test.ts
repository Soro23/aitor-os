import { beforeEach, describe, expect, it, vi } from "vitest";

const requireAdminMock = vi.fn();
const createMock = vi.fn();
const updateMock = vi.fn();
const uploadMock = vi.fn();
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

vi.mock("@/server/repositories/ui-styles.repository", () => ({
  uiStylesRepository: {
    create: (input: unknown) => createMock(input),
    update: (id: string, input: unknown) => updateMock(id, input),
    findById: vi.fn(),
    delete: vi.fn(),
    setPublished: vi.fn(),
    setFeatured: vi.fn(),
  },
}));

vi.mock("@/server/repositories/ui-style-storage.repository", () => ({
  uiStyleStorageRepository: {
    upload: (file: File, id: string, kind: string) => uploadMock(file, id, kind),
    remove: vi.fn(),
  },
}));

const { createUiStyle } = await import("@/server/actions/ui-styles.actions");
const { UnauthorizedError } = await import("@/lib/auth/requireAdmin");

const validInput = {
  slug: "glassmorphism",
  name: "Glassmorphism",
  category: "modernos",
  summary: "Paneles translúcidos con desenfoque de fondo.",
  isPublished: true,
  isFeatured: false,
  sortOrder: 9,
};

describe("createUiStyle", () => {
  beforeEach(() => {
    requireAdminMock.mockReset();
    createMock.mockReset();
    updateMock.mockReset();
    uploadMock.mockReset();
    revalidatePathMock.mockReset();
  });

  it("rechaza sin sesión admin", async () => {
    requireAdminMock.mockRejectedValue(new UnauthorizedError());

    await expect(createUiStyle(validInput)).rejects.toBeInstanceOf(UnauthorizedError);
    expect(createMock).not.toHaveBeenCalled();
  });

  it("rechaza input inválido antes de llamar al repositorio", async () => {
    requireAdminMock.mockResolvedValue({ id: "admin-1" });

    await expect(createUiStyle({ name: "" })).rejects.toThrow();
    expect(createMock).not.toHaveBeenCalled();
  });

  it("crea el estilo y revalida las rutas correctas", async () => {
    requireAdminMock.mockResolvedValue({ id: "admin-1" });
    createMock.mockResolvedValue({ ...validInput, id: "s1" });

    const result = await createUiStyle(validInput);

    expect(result.success).toBe(true);
    expect(uploadMock).not.toHaveBeenCalled();
    expect(revalidatePathMock).toHaveBeenCalledWith("/garden");
    expect(revalidatePathMock).toHaveBeenCalledWith("/garden/estilos-ui");
    expect(revalidatePathMock).toHaveBeenCalledWith("/admin/estilos-ui");
    expect(revalidatePathMock).toHaveBeenCalledWith("/garden/estilos-ui/glassmorphism");
  });

  it("sube la portada y guarda su URL cuando llega un archivo", async () => {
    requireAdminMock.mockResolvedValue({ id: "admin-1" });
    createMock.mockResolvedValue({ ...validInput, id: "s1" });
    uploadMock.mockResolvedValue("https://storage.test/ui-style-images/s1/cover-1.png");
    updateMock.mockResolvedValue({
      ...validInput,
      id: "s1",
      coverImageUrl: "https://storage.test/ui-style-images/s1/cover-1.png",
    });

    const file = new File(["binario"], "cover.png", { type: "image/png" });
    const result = await createUiStyle({ ...validInput, coverImageFile: file });

    expect(result.success).toBe(true);
    expect(uploadMock).toHaveBeenCalledWith(file, "s1", "cover");
    expect(updateMock).toHaveBeenCalledWith("s1", {
      coverImageUrl: "https://storage.test/ui-style-images/s1/cover-1.png",
    });
    // El archivo no debe llegar al esquema de validación del estilo.
    expect(createMock.mock.calls[0][0]).not.toHaveProperty("coverImageFile");
  });
});
