---
name: integration-test-writer
description: Escribe tests de integración de Aitor OS con Vitest que ejercitan Server Actions, repositorios, base de datos y auth juntos, contra un Supabase de test real (no mocks). Usar SIEMPRE al añadir un flujo que cruza varias capas.
---

# Skill: Integration Test Writer

Alcance: Server Actions + Repositories + Database + Auth trabajando juntos. Ver [[ci-guardian]] para dónde encaja esto en el pipeline, y [[aitor-os-testing-rules]] para el mapa completo de qué skill de testing usar según el tipo de cambio.

## Regla del proyecto: no mockear la base de datos

Los tests de integración corren contra una instancia real de Supabase de test, no contra mocks del cliente Supabase. Un mock puede mentir sobre cómo se comporta RLS en la realidad — y RLS es la frontera de seguridad real del proyecto (ver [[rls-security-reviewer]]). Si se propone mockear Supabase en un test de integración, señalarlo como contrario a este criterio.

## Qué priorizar

- Flujo completo de una Server Action de escritura: llamada sin sesión → rechazada; llamada con sesión no-admin → rechazada; llamada con sesión admin → persiste correctamente en la tabla.
- Que el filtrado `is_published`/`is_featured` funcione de extremo a extremo (repositorio + RLS), no solo a nivel de query en aislado.
- Que RLS bloquee de verdad lo que dice bloquear: un cliente `anon` no debe poder leer un borrador aunque se le pase el `id` exacto.

## Forma de referencia

```ts
describe("updateProject (integración)", () => {
  it("rechaza la actualización sin sesión admin", async () => {
    await expect(updateProject(projectId, validInput)).rejects.toThrow();
  });

  it("persiste el cambio cuando el usuario es admin", async () => {
    await withAdminSession(async () => {
      await updateProject(projectId, validInput);
      const updated = await projectsRepository.findById(projectId);
      expect(updated.name).toBe(validInput.name);
    });
  });
});
```

## Setup/teardown

Cada test debe dejar la base de datos de test en el estado en que la encontró (transacción revertida o limpieza explícita) — tests de integración que se contaminan entre sí son peores que no tenerlos.

## Checklist

- [ ] ¿El test usa Supabase de test real, no un mock del cliente?
- [ ] ¿Se prueba el camino "sin permiso" además del camino feliz?
- [ ] ¿El test limpia su propio estado al terminar?
