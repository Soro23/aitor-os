---
name: postgres-schema-reviewer
description: Evalúa el diseño general del esquema Postgres de Aitor OS — normalización, índices, relaciones, constraints, tipos, nullability, cascadas, nombres consistentes. Usar SIEMPRE al diseñar una tabla nueva o modificar una existente, antes de escribir la migración.
---

# Skill: Postgres Schema Reviewer

Complementa a [[database-migration-reviewer]] (que revisa la migración en sí) evaluando el diseño del esquema antes de llegar a esa fase.

## Nomenclatura (fijada por el proyecto, ver CLAUDE.md)

- Tablas en `snake_case`, plural: `projects`, `garden_notes`, `lab_experiments`.
- Columnas en `snake_case`: `first_name`, `created_at`, `is_published`.
- Clave primaria: `id`.
- Claves foráneas: `<tabla_singular>_id`, ej. `project_id`, `user_id`.
- Booleanos: prefijo `is_`/`has_`/`can_`, ej. `is_published`, `has_subscription`.
- Timestamps: `created_at`, `updated_at`, `deleted_at` si aplica soft-delete.
- Tablas intermedias N:N: combinar nombres, ej. `user_roles`.
- Índices: `idx_<tabla>_<columna>`, ej. `idx_projects_is_published`.

## Diseño

- **Normalización**: ¿los datos repetidos deberían vivir en una tabla propia (ej. tecnologías de un proyecto como tabla relacionada en vez de un array de texto suelto)? Evaluar caso a caso — no normalizar por dogma si el proyecto ya decidió usar `ENUM`/arrays para vocabularios cerrados (ver [[aitor-os-architecture]]).
- **Nullability**: ¿una columna debería ser `NOT NULL`? Por defecto, preferir `NOT NULL` con default explícito sobre permitir `NULL` sin necesidad real.
- **Cascadas**: decidir explícitamente `ON DELETE CASCADE`/`RESTRICT`/`SET NULL` en cada FK, nunca dejarlo implícito.
- **Tipos**: usar el tipo Postgres más ajustado (`timestamptz` no `timestamp`, `uuid` para IDs si el proyecto ya usa uuid, `ENUM` para vocabularios fijos en vez de `text` con un `CHECK` informal).
- **Índices**: columnas de filtrado frecuente (`is_published`, `is_featured`, foreign keys) necesitan índice; no indexar columnas que nunca se filtran/ordenan, por coste de escritura innecesario.

## Checklist

- [ ] ¿Los nombres siguen la convención `snake_case` plural para tablas y `snake_case` para columnas?
- [ ] ¿Cada FK tiene su `ON DELETE` decidido explícitamente?
- [ ] ¿Hay `NULL` permitido donde en realidad el dato siempre debería existir?
- [ ] ¿Falta algún índice sobre una columna de filtro/orden frecuente?
- [ ] ¿Una taxonomía fija se está modelando como `text` libre en vez de `ENUM`?
