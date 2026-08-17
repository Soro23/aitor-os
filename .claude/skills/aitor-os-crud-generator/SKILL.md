---
name: aitor-os-crud-generator
description: Genera un CRUD completo en Aitor OS siguiendo siempre el mismo orden — schema, migración, RLS, tipos, repositorio, server action, UI admin, UI pública, tests. Usar SIEMPRE al pedir un CRUD nuevo de principio a fin para una entidad.
---

# Skill: Aitor OS — CRUD Generator

Es la misma secuencia que [[aitor-os-feature-generator]] — esta skill es el atajo directo cuando la petición es explícitamente "genera el CRUD completo de X", sin reexplicar cada paso en detalle (ver la skill enlazada para el detalle de cada fase).

## Orden fijo

```
Schema
↓
Migration
↓
RLS
↓
Types
↓
Repository
↓
Server Action
↓
Admin UI
↓
Public UI
↓
Tests
```

## Referencia de entrada de reutilización en cada paso

| Paso | Skill de referencia |
|---|---|
| Schema/Migration | [[postgres-schema-reviewer]], [[database-migration-reviewer]] |
| RLS | [[rls-security-reviewer]] |
| Types | [[dto-contract-guardian]] |
| Repository | [[repository-pattern]] |
| Server Action | [[server-action-pattern]] |
| Admin UI / Public UI | [[component-reuse-enforcer]], [[aitor-os-design-system]] |
| Tests | [[unit-test-writer]], [[repository-test-writer]], [[server-action-test-writer]], [[integration-test-writer]] |

## Al recibir "genera el CRUD de `<entidad>`"

1. Confirmar si la entidad es editorial (con `is_published`/`is_featured`) o de edición directa (como `now_items`/`stack_items`) — determina qué columnas y qué métodos de repositorio aplican (ver [[aitor-os-architecture]]).
2. Ejecutar los 9 pasos en orden, sin saltarse RLS ni tests "para después".
3. Al final, pasar por [[aitor-os-code-review]] antes de dar el CRUD por terminado.

## Qué NO hacer

No crear una carpeta `features/<entidad>/` — el CRUD se reparte por capa técnica según [[aitor-os-architecture]], no por feature-folder.
