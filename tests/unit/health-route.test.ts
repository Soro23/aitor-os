import { beforeEach, describe, expect, it, vi } from "vitest";

const rpcMock = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createClient: async () => ({
    rpc: (fn: string) => rpcMock(fn),
  }),
}));

const { GET } = await import("@/app/api/health/route");

describe("GET /api/health", () => {
  beforeEach(() => {
    rpcMock.mockReset();
  });

  it("responde 200 cuando Postgres responde", async () => {
    rpcMock.mockResolvedValue({ data: false, error: null });

    const response = await GET();

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toEqual({ status: "ok" });
  });

  it("responde 503 si la RPC devuelve error", async () => {
    rpcMock.mockResolvedValue({ data: null, error: new Error("db down") });

    const response = await GET();

    expect(response.status).toBe(503);
  });

  it("responde 503 si createClient lanza una excepcion", async () => {
    rpcMock.mockRejectedValue(new Error("connection refused"));

    const response = await GET();

    expect(response.status).toBe(503);
  });

  it("no expone detalles internos en el cuerpo de la respuesta", async () => {
    rpcMock.mockResolvedValue({ data: null, error: new Error("stack trace sensible") });

    const response = await GET();
    const body = await response.json();

    expect(JSON.stringify(body)).not.toContain("stack trace sensible");
  });
});
