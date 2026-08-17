---
name: server-action-pattern
description: Define la forma exacta que debe tener toda Server Action de Aitor OS — autenticación, validación, repositorio, revalidación, respuesta. Usar SIEMPRE al escribir o revisar cualquier archivo en server/actions/.
---

# Skill: Server Action Pattern

Toda Server Action sigue este orden, sin saltarse pasos:

```
Autenticación
↓
Validación
↓
Repository
↓
Revalidación
↓
Respuesta
```

## Forma de referencia

```ts
"use server";

export async function updateProject(id: string, input: unknown) {
  await requireAdmin();

  const data = updateProjectSchema.parse(input);

  await projectsRepository.update(id, data);

  revalidatePath("/proyectos");
  revalidatePath(`/proyectos/${id}`);
  revalidatePath("/admin/proyectos");

  return { success: true };
}
```

## Reglas

- **Autenticación primero, siempre.** `requireAdmin()` (o `getUser()` si la acción es válida para usuario autenticado no-admin, aunque en este proyecto de single-admin eso es raro) antes de tocar cualquier dato.
- **Validación con zod, nunca confiar en el tipo de TypeScript en runtime.** El input de una Server Action cruza el límite cliente→servidor, TypeScript no lo protege en runtime.
- **Una Server Action, un repositorio.** No mezclar llamadas a Supabase directas con llamadas al repositorio en la misma acción (ver [[code-boundaries]]).
- **Revalidar todas las rutas afectadas**, no solo la obvia — si cambia `is_featured`, probablemente afecta también a Inicio/Dashboard.
- **Respuesta explícita y tipada**, no devolver `undefined` silencioso ni lanzar errores sin capturar hacia el cliente sin control.

## Errores a bloquear

- Server Action que hace `supabase.from(...)` directamente en vez de llamar al repositorio.
- Falta de `requireAdmin()` en una acción de escritura.
- Validación con `as` (type assertion) en vez de `schema.parse()`.
- `revalidatePath` olvidado, dejando la UI pública desincronizada tras una mutación admin.
