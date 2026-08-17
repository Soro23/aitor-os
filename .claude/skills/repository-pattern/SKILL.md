---
name: repository-pattern
description: Define cómo se accede a datos en Aitor OS mediante repositorios en server/repositories/. Usar SIEMPRE al escribir cualquier código que lea o escriba en Supabase, para mantener un único punto de acceso por entidad.
---

# Skill: Repository Pattern

Flujo obligatorio (ver [[code-boundaries]]):

```
Server Action → Repository → Supabase
```

Un repositorio por entidad, en `server/repositories/<entidad>.ts`. Nunca ejecutar queries a Supabase fuera de un repositorio.

## Forma esperada de un repositorio

```ts
// server/repositories/projects.ts
export const projectsRepository = {
  findPublished: () => { /* WHERE is_published = true */ },
  findFeatured: () => { /* WHERE is_published AND is_featured */ },
  findById: (id: string) => { /* ... */ },
  create: (data: CreateProjectInput) => { /* ... */ },
  update: (id: string, data: UpdateProjectInput) => { /* ... */ },
  delete: (id: string) => { /* ... */ },
};
```

Reglas:
- El repositorio usa el cliente Supabase correcto para su contexto (`lib/supabase/server` respetando RLS para operaciones normales; nunca el cliente `admin`/service-role salvo que el repositorio esté explícitamente marcado como uso exclusivo de script de administración).
- El repositorio devuelve datos tipados (usar `types/dto/`), no el resultado crudo de Supabase sin tipar.
- El repositorio no valida input de usuario — eso ya lo hizo la Server Action con zod antes de llamarlo (ver [[code-boundaries]]).
- El repositorio no conoce Next.js (`revalidatePath`, `cookies()`, etc.) — esas responsabilidades son de la Server Action que lo llama.

## Colecciones editoriales — patrón común

`projects`, `garden_notes`, `lab_experiments`, `resources` comparten el mismo patrón de columnas (`is_published`, `is_featured`, `sort_order`, `created_at`/`updated_at`). Sus repositorios deberían compartir la misma forma de métodos (`findPublished`, `findFeatured`, `findById`, `create`, `update`, `delete`, y `setPublished`/`setFeatured` si el toggle no pasa por `update` genérico). Si un repositorio de estas cuatro entidades tiene una forma muy distinta a las demás sin motivo, es señal de inconsistencia a revisar.

`now_items` y `stack_items` son de edición directa (sin flujo de publicación) — sus repositorios no necesitan `findPublished`/`findFeatured`.

## Checklist de revisión

- [ ] ¿Existe ya un repositorio para esta entidad? Reutilizarlo, no crear uno paralelo.
- [ ] ¿El método nuevo encaja en el patrón de nombres existente (`findX`, `create`, `update`, `delete`)?
- [ ] ¿Hay alguna query a Supabase fuera de `server/repositories/`? → violación, ver [[code-boundaries]].
- [ ] ¿El repositorio filtra correctamente por `is_published`/`is_featured` cuando la ruta que lo llama es pública?
- [ ] ¿Se está confiando en el filtrado del repositorio como única defensa, o RLS en Postgres también lo garantiza? (debe ser lo segundo — ver [[rls-security-reviewer]]).
