---
name: e2e-test-writer
description: Escribe tests end-to-end de Aitor OS con Playwright para flujos críticos completos (login admin, CRUD de proyectos, formulario de contacto). Usar SIEMPRE al terminar un flujo crítico de usuario, no para cada pantalla suelta.
---

# Skill: E2E Test Writer

Herramienta: Playwright. Alcance: flujos completos a través del navegador real, no unidades aisladas (eso son [[unit-test-writer]] / [[integration-test-writer]]). Ver [[aitor-os-testing-rules]] para el mapa completo de qué skill de testing usar según el tipo de cambio.

## Flujos críticos a cubrir (lista de referencia del proyecto)

```
Login admin
Crear proyecto
Editar proyecto
Publicar proyecto
Destacar proyecto
Despublicar proyecto
Formulario contacto
```

Ampliar esta lista según se añadan entidades nuevas (garden notes, lab experiments, resources deberían tener su equivalente de "crear/editar/publicar" si son igual de críticas).

## Qué NO cubrir con e2e

- Casos límite de validación (eso ya lo cubre [[unit-test-writer]] sobre el esquema zod).
- Variaciones visuales menores — e2e es caro de mantener, reservarlo para flujos que si se rompen bloquean el uso real del sitio.

## Forma de referencia

```ts
test("admin puede publicar un proyecto", async ({ page }) => {
  await loginAsAdmin(page);
  await page.goto("/admin/proyectos");
  await page.getByRole("row", { name: /mi proyecto/i }).getByRole("switch", { name: /publicado/i }).click();

  await page.goto("/proyectos");
  await expect(page.getByText("mi proyecto")).toBeVisible();
});
```

## Checklist

- [ ] ¿El test simula el flujo completo (login → acción → verificación del efecto visible), no solo un paso aislado?
- [ ] ¿Se verifica el efecto en ambos lados cuando aplica (cambio en admin → visible/invisible en público)?
- [ ] ¿El test es determinista (no depende de datos que otro test pueda haber alterado)?
- [ ] ¿Se evita e2e para algo que un test unitario o de integración ya cubre igual de bien y más rápido?
