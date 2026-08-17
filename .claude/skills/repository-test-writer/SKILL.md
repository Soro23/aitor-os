---
name: repository-test-writer
description: Especializado en testear repositorios de Aitor OS — queries correctas, filtrado, orden, errores, casos vacíos, integridad de datos. Usar SIEMPRE al añadir o modificar un método en server/repositories/.
---

# Skill: Repository Test Writer

Alcance: un repositorio (ver [[repository-pattern]]) contra Supabase de test real (misma regla de no-mock que [[integration-test-writer]]). Ver [[aitor-os-testing-rules]] para el mapa completo de qué skill de testing usar según el tipo de cambio.

## Qué probar por método

- **`findPublished()` / `findFeatured()`**: solo devuelve filas con `is_published`/`is_featured` en `true`; una fila en borrador no debe aparecer nunca, ni por accidente.
- **`findById(id)`**: devuelve `null`/`undefined` (no lanza excepción genérica) cuando el id no existe; devuelve el registro correcto cuando existe.
- **`create(data)`**: persiste todos los campos esperados; aplica los defaults correctos (`is_published: false`, `sort_order` calculado, etc.).
- **`update(id, data)`**: actualiza solo los campos pasados, no sobrescribe el resto con `null`; actualiza `updated_at`.
- **`delete(id)`**: elimina el registro; comprobar qué pasa con relaciones dependientes (cascada esperada según [[postgres-schema-reviewer]]).
- **Orden**: si el método promete un orden (`sort_order`, `created_at desc`), verificar que el resultado realmente viene ordenado así.
- **Casos vacíos**: la entidad sin ninguna fila publicada devuelve `[]`, no `null` ni una excepción.

## Forma de referencia

```ts
describe("projectsRepository.findPublished", () => {
  it("no devuelve proyectos en borrador", async () => {
    await seedProject({ is_published: false });
    const results = await projectsRepository.findPublished();
    expect(results.every((p) => p.isPublished)).toBe(true);
  });

  it("devuelve [] cuando no hay proyectos publicados", async () => {
    const results = await projectsRepository.findPublished();
    expect(results).toEqual([]);
  });
});
```

## Checklist

- [ ] ¿Cada método del repositorio tiene al menos un test de caso normal y uno de caso vacío/límite?
- [ ] ¿Se verifica explícitamente que el filtrado `is_published`/`is_featured` funciona, no se asume?
- [ ] ¿Los datos devueltos ya están en forma de DTO, no crudos de Supabase? (ver [[dto-contract-guardian]])
