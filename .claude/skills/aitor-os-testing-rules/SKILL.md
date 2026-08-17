---
name: aitor-os-testing-rules
description: Define qué debe probarse en Aitor OS según el tipo de cambio (validación, repositorio, server action, RLS, flujo crítico). Punto de entrada único a las reglas de testing del proyecto. Usar SIEMPRE al decidir qué tests escribir para un cambio dado.
---

# Skill: Aitor OS — Testing Rules

Índice de qué skill de testing aplica según el tipo de cambio — evita tener que decidir desde cero cada vez.

## Tabla de decisión

| Tipo de cambio | Skill a usar |
|---|---|
| Esquema zod nuevo o modificado | [[unit-test-writer]] |
| Helper puro / mapeo DTO | [[unit-test-writer]] |
| Método nuevo en un repositorio | [[repository-test-writer]] |
| Server Action nueva o modificada | [[server-action-test-writer]] |
| Flujo que cruza Server Action + Repository + DB + Auth | [[integration-test-writer]] |
| Tabla nueva / política RLS nueva | [[integration-test-writer]] (verificar que RLS bloquea de verdad) |
| Flujo crítico end-to-end (login, publicar, contacto) | [[e2e-test-writer]] |
| Corrección de un bug reportado | [[regression-test-guardian]] (test que reproduce el bug ANTES del fix) |
| Duda de "cuánta cobertura hace falta" | [[test-coverage-reviewer]] |

## Stack de testing del proyecto

```
Vitest           → unitarios e integración
Testing Library    → componentes React
Playwright            → E2E
```

## Regla de proyecto que gobierna todo lo anterior

No mockear la base de datos en tests de integración — un mock puede mentir sobre cómo se comporta RLS en la realidad, y RLS es la frontera de seguridad real del proyecto (ver [[aitor-os-security-rules]]). Usar una instancia real de Supabase de test.

## Al terminar cualquier feature

Antes de darla por lista, pasar por la fila correspondiente de esta tabla para cada capa que toca — no asumir que "algo de test" ya es suficiente sin comprobar que cubre el tipo de riesgo correcto.
