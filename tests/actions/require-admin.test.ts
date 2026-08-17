import { beforeEach, describe, expect, it, vi } from "vitest";

const getUserMock = vi.fn();
const rpcMock = vi.fn();

vi.mock("@/lib/auth/getUser", () => ({
  getUser: () => getUserMock(),
}));

vi.mock("@/lib/supabase/server", () => ({
  createClient: async () => ({
    rpc: (fn: string) => rpcMock(fn),
  }),
}));

const { requireAdmin, UnauthorizedError, ForbiddenError } = await import(
  "@/lib/auth/requireAdmin"
);

describe("requireAdmin", () => {
  beforeEach(() => {
    getUserMock.mockReset();
    rpcMock.mockReset();
  });

  it("rechaza sin sesion", async () => {
    getUserMock.mockResolvedValue(null);

    await expect(requireAdmin()).rejects.toBeInstanceOf(UnauthorizedError);
    expect(rpcMock).not.toHaveBeenCalled();
  });

  it("rechaza una sesion que no esta en app_admins", async () => {
    getUserMock.mockResolvedValue({ id: "user-1" });
    rpcMock.mockResolvedValue({ data: false, error: null });

    await expect(requireAdmin()).rejects.toBeInstanceOf(ForbiddenError);
  });

  it("rechaza si la comprobacion RPC devuelve error", async () => {
    getUserMock.mockResolvedValue({ id: "user-1" });
    rpcMock.mockResolvedValue({ data: null, error: new Error("rpc failed") });

    await expect(requireAdmin()).rejects.toBeInstanceOf(ForbiddenError);
  });

  it("permite una sesion admin", async () => {
    const user = { id: "admin-1" };
    getUserMock.mockResolvedValue(user);
    rpcMock.mockResolvedValue({ data: true, error: null });

    await expect(requireAdmin()).resolves.toBe(user);
    expect(rpcMock).toHaveBeenCalledWith("is_admin");
  });
});
