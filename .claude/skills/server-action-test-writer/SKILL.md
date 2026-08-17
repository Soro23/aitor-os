---
name: server-action-test-writer
description: Especializado en testear Server Actions de Aitor OS — autenticación, validación, manejo de errores, llamada al repositorio, revalidación. Usar SIEMPRE al añadir o modificar un archivo en server/actions/.
---

# Skill: Server Action Test Writer

Alcance: una Server Action completa, siguiendo el patrón de [[server-action-pattern]] y verificando cada paso de su pipeline. Ver [[aitor-os-testing-rules]] para el mapa completo de qué skill de testing usar según el tipo de cambio.

## Qué probar por Server Action

- **Autenticación**: llamada sin sesión → rechazada. Llamada con sesión autenticada pero no admin → rechazada (`requireAdmin()` funciona).
- **Validación**: input inválido (según el esquema zod de [[unit-test-writer]]) → rechazada antes de tocar el repositorio, con un error claro, no un error genérico de base de datos.
- **Manejo de errores**: si el repositorio lanza (ej. `id` no existe), la Server Action no debe filtrar detalles internos al cliente (ver gestión de errores del proyecto — no exponer errores internos).
- **Llamada al repositorio**: con input válido y sesión admin, se llama al método correcto del repositorio con los datos correctos.
- **Revalidación**: tras una mutación exitosa, se invoca `revalidatePath` sobre las rutas realmente afectadas (pública + admin), no se omite.

## Forma de referencia

```ts
describe("updateProject (server action)", () => {
  it("rechaza sin sesión admin", async () => {
    await expect(updateProject(id, validInput)).rejects.toThrow(/admin/i);
  });

  it("rechaza input inválido incluso con sesión admin", async () => {
    await withAdminSession(async () => {
      await expect(updateProject(id, { name: "" })).rejects.toThrow();
    });
  });

  it("revalida las rutas públicas y admin tras actualizar", async () => {
    await withAdminSession(async () => {
      await updateProject(id, validInput);
      expect(revalidatePathMock).toHaveBeenCalledWith("/proyectos");
      expect(revalidatePathMock).toHaveBeenCalledWith(`/proyectos/${id}`);
    });
  });
});
```

## Checklist

- [ ] ¿Se prueba el rechazo por falta de autenticación/autorización, no solo el camino feliz?
- [ ] ¿Se prueba el rechazo por validación con al menos un caso inválido?
- [ ] ¿Se verifica que se llama al repositorio correcto, no a Supabase directamente? (si la Server Action llama a Supabase directo, es una violación de [[code-boundaries]], no solo un hueco de test)
- [ ] ¿Se verifica la revalidación de las rutas correctas?
