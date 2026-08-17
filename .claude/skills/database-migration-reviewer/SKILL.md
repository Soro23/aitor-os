---
name: database-migration-reviewer
description: Revisa migraciones SQL de Aitor OS en supabase/migrations/ — cambios destructivos, defaults, índices, constraints, foreign keys, ENUMs, políticas RLS faltantes. Usar SIEMPRE al crear o revisar una migración SQL nueva.
---

# Skill: Database Migration Reviewer

## Qué comprobar en toda migración nueva

- [ ] **Cambios destructivos**: `DROP COLUMN`, `DROP TABLE`, `ALTER COLUMN ... TYPE` que pueda perder datos. Si aparece uno, ¿hay un motivo explícito y, si aplica, un paso de backfill o backup antes?
- [ ] **Columnas sin default cuando hace falta uno**: una columna `NOT NULL` nueva en una tabla con filas existentes necesita `DEFAULT` o un `UPDATE` de backfill en la misma migración, si no la migración falla contra datos reales.
- [ ] **Índices faltantes**: columnas usadas en `WHERE`/`ORDER BY` frecuentes (`is_published`, `is_featured`, `sort_order`, foreign keys) deberían tener índice. Ver también [[postgres-schema-reviewer]].
- [ ] **Constraints**: `NOT NULL` donde el dato es obligatorio por diseño, `CHECK` donde aplique (ej. `sort_order >= 0`).
- [ ] **Foreign keys**: relaciones como `garden_note_relations` deben declarar FK con la acción `ON DELETE` correcta (¿cascada, restringir, poner null? — decidir explícitamente, no dejar el default implícito sin pensarlo).
- [ ] **ENUM correctos**: taxonomías fijas del proyecto (estado de proyecto, categoría de garden note, tipo de recurso) deben ser `ENUM` de Postgres, no `text` libre — ver [[aitor-os-architecture]] para la lista de taxonomías fijas.
- [ ] **Políticas RLS**: toda tabla nueva debe traer sus políticas en la misma migración o en la inmediatamente siguiente antes de considerarse lista — nunca "para después". Ver [[rls-security-reviewer]] para el checklist completo.

## Patrón de columnas para colecciones editoriales

Si la tabla nueva es editorial (como `projects`, `garden_notes`, `lab_experiments`, `resources`), debe incluir: `is_published boolean not null default false`, `is_featured boolean not null default false`, `sort_order`, `created_at timestamptz not null default now()`, `updated_at timestamptz not null default now()` (con trigger de actualización si el proyecto ya usa ese patrón).

## Al revisar el `down`/reversibilidad

Si la migración no es reversible de forma segura (ej. borra una columna con datos), señalarlo explícitamente antes de aplicarla — no asumir que "ya se revertirá si hace falta".
