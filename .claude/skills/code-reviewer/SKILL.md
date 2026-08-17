---
name: code-reviewer
description: Revisión general de correctness en Aitor OS — bugs, código duplicado, problemas de rendimiento, tipos incorrectos, componentes o dependencias innecesarias. Usar como pasada de calidad general de código; para la revisión combinada específica del proyecto (arquitectura + seguridad + design system) usar aitor-os-code-review.
---

# Skill: Code Reviewer

Pasada de revisión centrada en **correctness y calidad general del código**, no en las reglas específicas de dominio de Aitor OS (esas viven en [[aitor-os-code-review]], que orquesta esta skill junto a las demás).

## Qué buscar

- **Bugs**: condiciones límite no manejadas (`undefined`, array vacío, `id` inexistente), off-by-one, comparaciones con el tipo incorrecto, promesas no esperadas (`await` olvidado).
- **Código duplicado**: mismo bloque de lógica repetido en más de un sitio — ver criterio de "regla de tres" en [[refactor-guardian]] antes de proponer extraerlo.
- **Problemas de arquitectura**: delegar en [[architecture-guardian]] / [[code-boundaries]] si se detecta una violación de capas.
- **Problemas de seguridad**: delegar en [[rls-security-reviewer]] / [[auth-security-reviewer]] / [[environment-secrets-guardian]] si aparece algo relacionado.
- **Problemas de rendimiento**: queries repetidas evitables, cálculos pesados dentro de loops de render, listados sin paginar.
- **Tipos incorrectos**: delegar detalle en [[typescript-strict]].
- **Componentes innecesarios**: un componente nuevo que duplica uno existente — ver [[component-reuse-enforcer]].
- **Dependencias innecesarias**: ver [[dependency-guardian]].
- **Problemas de mantenibilidad**: funciones de más de ~50-60 líneas, código muerto, nombres poco descriptivos, comentarios que explican el "qué" en vez de el "por qué".

## Cómo reportar un hallazgo

Archivo y línea, qué está mal, escenario concreto donde falla (inputs/estado → resultado incorrecto), y la corrección propuesta. No reportar preferencias de estilo sin impacto real como si fueran bugs.

## Prioridad al reportar

Bugs de correctness > problemas de seguridad > problemas de arquitectura > rendimiento > mantenibilidad > estilo.
