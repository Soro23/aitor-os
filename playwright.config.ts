import { defineConfig, devices } from "@playwright/test";

// Flujos criticos end-to-end (login admin, CRUD de proyectos...). Requiere
// la app corriendo contra un Supabase local real (`npx supabase start` +
// `npm run dev`) — nunca contra mocks.
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  retries: 0,
  reporter: "list",
  use: {
    baseURL: process.env.E2E_BASE_URL ?? "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
