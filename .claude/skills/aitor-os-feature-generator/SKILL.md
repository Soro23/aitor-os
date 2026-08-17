---
name: aitor-os-feature-generator
description: Genera una feature/entidad CRUD completa en Aitor OS siguiendo la estructura real del proyecto (migración → RLS → tipos → validación → repositorio → server action → UI admin → UI pública → tests). Usar SIEMPRE al añadir una entidad o colección nueva, o un CRUD completo.
---

# Skill: Aitor OS — Feature Generator

Esta skill NO usa el patrón genérico `features/<nombre>/index.ts`. Aitor OS organiza el código por capa técnica (ver [[aitor-os-architecture]]), no por carpeta de feature. Seguir ese patrón real, no el genérico.

## Orden de generación de una entidad nueva

```
1. Migración SQL (supabase/migrations/)
2. Políticas RLS (misma migración o siguiente)
3. Tipos generados + DTO (types/dto/)
4. Esquema de validación zod (lib/validation/)
5. Repositorio (server/repositories/)
6. Server Actions (server/actions/)
7. UI admin (app/admin/**, componentes en components/admin/ si son reutilizables)
8. UI pública (app/(public)/**, componentes en components/ui/ si son reutilizables)
9. Tests (unitarios de validación/repositorio, integración de server action, e2e si es un flujo crítico)
```

No saltarse pasos ni reordenar — en particular, RLS no se pospone "para después" (ver [[rls-security-reviewer]]) y la UI admin no se escribe antes de tener el repositorio y la Server Action funcionando.

## Paso 1-2: Migración + RLS

Seguir el patrón de columnas ya establecido si la entidad es editorial: `is_published boolean default false`, `is_featured boolean default false`, `sort_order`, `created_at`, `updated_at`. Nombre de tabla en `snake_case` plural (convención del proyecto). Activar RLS y aplicar el checklist de [[rls-security-reviewer]] en la misma tarea.

## Paso 3: Tipos y DTO

Generar/actualizar tipos desde el esquema de Supabase. Definir en `types/dto/<entidad>.ts` el DTO que realmente cruza a la UI — no exponer el tipo de base de datos completo si la UI no necesita todas las columnas. Diferenciar si hace falta: Database Types / DTO / Form Input / Public View Model.

Si la entidad nueva se relaciona con otra existente (ej. una nueva colección enlazada a `garden_notes`), ver [[feature-isolation]] antes de decidir cómo se conectan sus repositorios.

## Paso 4: Validación

Un esquema zod por entidad en `lib/validation/<entidad>.ts`. Server Actions parsean con este esquema antes de tocar el repositorio (ver [[code-boundaries]]).

## Paso 5-6: Repositorio + Server Actions

Seguir [[repository-pattern]] para la forma del repositorio y el patrón de Server Action (`requireAdmin()` → `schema.parse()` → `repository.method()` → `revalidatePath()`).

## Paso 7-8: UI

Antes de escribir un componente nuevo, pasar por [[component-reuse-enforcer]]. El estilo debe seguir [[aitor-os-design-system]] — ninguna pantalla nueva inventa su propio lenguaje visual. Todo componente interactivo o formulario pasa por [[accessibility-reviewer]] antes de darse por terminado.

Para colecciones editoriales, la UI admin normalmente necesita: listado con `DataTable`, `PublishToggle`, `FeaturedToggle`; editor de contenido con `MarkdownEditor` si aplica. La UI pública normalmente necesita tarjetas basadas en `ClipCard` + `StatusBadge` para el estado.

## Paso 9: Tests

Ver skills de testing (`unit-test-writer`, `integration-test-writer`, `repository-test-writer`, `server-action-test-writer` cuando existan). Como mínimo para una entidad nueva: test del esquema de validación (casos válidos/inválidos), test del repositorio (filtrado `is_published`, casos vacíos), test de la Server Action (rechaza sin admin, rechaza input inválido, revalida la ruta correcta).

## Checklist final antes de dar la feature por terminada

- [ ] ¿La tabla tiene RLS revisado con [[rls-security-reviewer]]?
- [ ] ¿Todo acceso a datos pasa por un repositorio, sin queries sueltas? ([[code-boundaries]])
- [ ] ¿Se reutilizaron componentes existentes en vez de duplicar? ([[component-reuse-enforcer]])
- [ ] ¿La UI sigue la paleta/tipografía/patrones del design system? ([[aitor-os-design-system]])
- [ ] ¿La UI es accesible (teclado, labels, contraste)? ([[accessibility-reviewer]])
- [ ] ¿Hay al menos un test por capa crítica (validación, repositorio, server action)?
- [ ] ¿Se revalidan las rutas públicas afectadas tras cada mutación?
