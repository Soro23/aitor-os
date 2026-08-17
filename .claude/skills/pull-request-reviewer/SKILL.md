---
name: pull-request-reviewer
description: Checklist final antes de mergear un PR en Aitor OS — arquitectura, tests, duplicaciones, seguridad, build, UI consistente, código muerto. Usar SIEMPRE antes de aprobar o mergear un PR.
---

# Skill: Pull Request Reviewer

Agrega, como puerta de entrada al merge, lo que ya verifican las skills específicas — no repite su detalle.

## Checklist de merge

- [ ] **Correctness general** — bugs, rendimiento, tipos (ver [[code-reviewer]]).
- [ ] **Arquitectura correcta** — sin violaciones de capa (ver [[code-boundaries]] / [[architecture-guardian]]).
- [ ] **Tests correctos** — cobertura donde importa, no artificial (ver [[test-coverage-reviewer]]).
- [ ] **Sin duplicaciones** — ni de componentes ([[component-reuse-enforcer]]) ni de lógica ([[refactor-guardian]]).
- [ ] **Seguridad correcta** — RLS revisado si toca tablas ([[rls-security-reviewer]]), sin secretos filtrados ([[environment-secrets-guardian]]).
- [ ] **Build correcto** — `next build` pasa ([[build-validator]]), CI en verde ([[ci-guardian]]).
- [ ] **UI consistente y accesible** — sigue el design system, sin inconsistencias frente al resto del sitio, accesible por teclado/contraste ([[aitor-os-design-system]] / [[visual-consistency-reviewer]] / [[accessibility-reviewer]]).
- [ ] **Sin código muerto** — imports, variables, funciones sin usar ([[eslint-reviewer]]).

Esta skill es el checklist de puerta de entrada al merge; para la revisión de contenido en sí (arquitectura + seguridad + design system combinados) usar [[aitor-os-code-review]] antes de llegar aquí — este checklist confirma que ya se pasó, no la sustituye.

## Qué exigir en la descripción del PR

- Qué cambia y por qué (no solo el "qué", que ya se ve en el diff).
- Si toca base de datos: qué migración, y confirmación de que RLS se revisó.
- Si toca UI: capturas o confirmación de que se probó en al menos mobile y desktop (ver [[responsive-ui-reviewer]]).
- Plan de test manual si el cambio no tiene cobertura automatizada completa, explicando por qué.

## Cuándo bloquear un merge (no negociable)

- Violación de capas ([[code-boundaries]]).
- Tabla nueva/modificada sin RLS revisado.
- Secreto expuesto en el diff.
- CI en rojo.

El resto de hallazgos (duplicación menor, inconsistencia visual pequeña, cobertura de test parcial) son recomendaciones a valorar, no bloqueantes automáticos — usar criterio según el riesgo real del cambio.
