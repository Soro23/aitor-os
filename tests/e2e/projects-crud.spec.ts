import { test, expect, type Page } from "@playwright/test";

// Flujo critico de referencia (Fase 5): login admin -> crear -> publicar ->
// destacar -> despublicar -> verificar que desaparece del sitio publico.
// Requiere `npx supabase start` + `npm run dev` corriendo contra esa
// instancia, y el usuario admin de prueba sembrado (ver
// tests/helpers/admin-session.ts / .env.test.example).

const ADMIN_EMAIL = process.env.TEST_ADMIN_EMAIL ?? "admin.test@aitor-os.local";
const ADMIN_PASSWORD = process.env.TEST_ADMIN_PASSWORD ?? "test-admin-password-123";

async function loginAsAdmin(page: Page) {
  await page.goto("/admin/login");
  await page.getByLabel("Email").fill(ADMIN_EMAIL);
  await page.getByLabel("Contraseña").fill(ADMIN_PASSWORD);
  await page.getByRole("button", { name: /entrar/i }).click();
  await page.waitForURL("/admin");
}

test.describe("CRUD de Proyectos", () => {
  const slug = `e2e-project-${Date.now()}`;
  const name = `Proyecto E2E ${Date.now()}`;

  test("login -> crear -> publicar -> destacar -> despublicar", async ({ page }) => {
    await loginAsAdmin(page);

    await page.goto("/admin/proyectos/nuevo");
    await page.getByLabel("Nombre").fill(name);
    await page.getByLabel("Slug").fill(slug);
    await page.getByRole("button", { name: /guardar/i }).click();
    await page.waitForURL("/admin/proyectos");

    const row = page.getByRole("row").filter({ hasText: name });
    await expect(row).toBeVisible();

    await row.getByRole("switch", { name: /borrador/i }).click();
    await expect(row.getByRole("switch", { name: /publicado/i })).toBeVisible();

    await row.getByRole("switch", { name: /^normal$/i }).click();
    await expect(row.getByRole("switch", { name: /destacado/i })).toBeVisible();

    await page.goto(`/proyectos/${slug}`);
    await expect(page.getByRole("heading", { name })).toBeVisible();

    await page.goto("/admin/proyectos");
    const rowAfter = page.getByRole("row").filter({ hasText: name });
    await rowAfter.getByRole("switch", { name: /publicado/i }).click();
    await expect(rowAfter.getByRole("switch", { name: /borrador/i })).toBeVisible();

    const response = await page.goto(`/proyectos/${slug}`);
    expect(response?.status()).toBe(404);

    await page.goto("/admin/proyectos");
    const rowToDelete = page.getByRole("row").filter({ hasText: name });
    await rowToDelete.getByRole("button", { name: /eliminar/i }).click();
    await expect(page.getByRole("row").filter({ hasText: name })).toHaveCount(0);
  });
});
