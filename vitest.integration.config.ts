import { defineConfig } from "vitest/config";
import path from "node:path";

// Contra Supabase de test real (nunca mocks) — requiere `npx supabase start`.
// passWithNoTests: todavia no hay tests de integracion (llegan en Fase 5+).
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  test: {
    environment: "node",
    include: ["tests/integration/**/*.test.ts"],
    passWithNoTests: true,
  },
});
