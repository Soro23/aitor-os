---
name: git-workflow
description: Define reglas generales de ramas y flujo de trabajo Git en Aitor OS. Usar SIEMPRE al crear una rama nueva o decidir cómo organizar el trabajo en Git para este proyecto.
---

# Skill: Git Workflow

Proyecto de un único desarrollador, self-hosted, sin equipo grande — el flujo debe ser simple, no un modelo de branching corporativo innecesario.

## Flujo recomendado

- `main` es la rama desplegable — siempre debe poder construirse y desplegarse (ver [[ci-guardian]] / [[build-validator]]).
- Trabajo nuevo en una rama de feature/fix con nombre según [[branch-strategy]], mergeada a `main` vía PR (incluso trabajando solo, un PR da el punto de revisión antes de mergear: [[aitor-os-code-review]] para revisar el contenido del cambio, [[pull-request-reviewer]] como checklist final de puerta de entrada al merge).
- Sin ramas de larga duración paralelas a `main` (`develop`, `staging`) salvo que el proyecto crezca y lo justifique explícitamente — evitar complejidad de branching que no resuelve un problema real hoy.

## Antes de mergear a `main`

- CI en verde (ver [[ci-guardian]]).
- Revisión con [[aitor-os-code-review]] aplicada, aunque sea auto-revisión, y el checklist de [[pull-request-reviewer]] pasado antes de mergear.
- Sin conflictos sin resolver, sin commits de "WIP" sueltos sin squash si el historial debe quedar limpio.

## Reglas generales

- No hacer force-push a `main`.
- No mezclar cambios no relacionados en la misma rama/PR (una rama = un cambio lógico, igual que "un commit = un cambio lógico" en [[conventional-commits]]).
- Resolver conflictos de merge activamente, nunca descartando cambios sin revisar qué se pierde.
