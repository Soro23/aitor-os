import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getGithubActivity } from "@/lib/github/get-activity";

const originalEnv = { ...process.env };
const originalFetch = global.fetch;

describe("getGithubActivity", () => {
  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("devuelve null si GITHUB_USERNAME no esta configurado", async () => {
    delete process.env.GITHUB_USERNAME;
    const result = await getGithubActivity();
    expect(result).toBeNull();
  });

  it("devuelve la actividad cuando la API responde correctamente", async () => {
    process.env.GITHUB_USERNAME = "aitor";
    global.fetch = vi.fn(async (url: string | URL) => {
      const href = url.toString();
      if (href.includes("/users/aitor/repos")) {
        return new Response(
          JSON.stringify([
            {
              name: "aitor-os",
              html_url: "https://github.com/aitor/aitor-os",
              description: "Personal OS",
              language: "TypeScript",
              updated_at: "2026-08-01T00:00:00Z",
            },
          ]),
          { status: 200 },
        );
      }
      return new Response(JSON.stringify({ public_repos: 12 }), { status: 200 });
    }) as typeof fetch;

    const result = await getGithubActivity();

    expect(result).not.toBeNull();
    expect(result?.username).toBe("aitor");
    expect(result?.publicRepos).toBe(12);
    expect(result?.recentRepos).toHaveLength(1);
    expect(result?.recentRepos[0].name).toBe("aitor-os");
  });

  it("devuelve null si la API responde con error", async () => {
    process.env.GITHUB_USERNAME = "aitor";
    global.fetch = vi.fn(async () => new Response("not found", { status: 404 })) as typeof fetch;

    const result = await getGithubActivity();
    expect(result).toBeNull();
  });

  it("devuelve null si fetch lanza una excepcion (red caida, etc.)", async () => {
    process.env.GITHUB_USERNAME = "aitor";
    global.fetch = vi.fn(async () => {
      throw new Error("network error");
    }) as typeof fetch;

    const result = await getGithubActivity();
    expect(result).toBeNull();
  });
});
