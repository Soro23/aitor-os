---
name: test-coverage-reviewer
description: Evalúa dónde falta cobertura de tests en Aitor OS priorizando reglas de negocio, repositorios, acciones, seguridad y flujos críticos — sin perseguir un porcentaje de cobertura artificial. Usar al revisar si una feature está lista para mergear, o al auditar el estado de testing del proyecto.
---

# Skill: Test Coverage Reviewer

No perseguir un número de cobertura (ej. "80%") como objetivo en sí mismo. Un archivo con 100% de cobertura de líneas puede no tener ni un solo test que verifique comportamiento real; priorizar dónde importa, no cuánto.

## Prioridad de cobertura (de más a menos crítico)

```
Reglas de negocio (validaciones, transiciones de estado)
↓
Repositorios (filtrado is_published/is_featured, casos vacíos)
↓
Server Actions (auth, validación, revalidación)
↓
Seguridad (RLS — vía tests de integración)
↓
Flujos críticos (login, CRUD de proyectos, contacto — vía e2e)
```

Ver las skills dedicadas por tipo: [[unit-test-writer]], [[repository-test-writer]], [[server-action-test-writer]], [[integration-test-writer]], [[e2e-test-writer]]. Para el mapa completo de qué testear según el tipo de cambio, ver [[aitor-os-testing-rules]].

## Qué NO necesita test dedicado

- Componentes puramente presentacionales sin lógica (un `<Panel>` que solo renderiza children con estilos).
- Getters/setters triviales sin transformación.
- Código generado (tipos de Supabase) — no se testea, se confía en el generador.

## Al auditar una feature

1. ¿Hay al menos un test por regla de negocio no trivial?
2. ¿El repositorio de la entidad tiene tests de filtrado `is_published`/`is_featured`?
3. ¿La Server Action de escritura tiene test de rechazo sin admin y de validación inválida?
4. ¿Si la tabla es nueva, hay un test de integración que confirme que RLS bloquea lo que debe bloquear?
5. Si el flujo es crítico (ver lista de [[e2e-test-writer]]), ¿tiene su e2e?

## Señal de alarma

Una feature con "tests" que solo verifican que una función no lanza excepción, sin comprobar el resultado — eso cuenta como cobertura numérica pero no como cobertura real. Señalarlo si aparece.
