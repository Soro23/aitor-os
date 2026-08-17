---
name: branch-strategy
description: Formato de nombres de rama para Aitor OS (feat/, fix/, refactor/, chore/, docs/, test/). Usar SIEMPRE al crear una rama nueva.
---

# Skill: Branch Strategy

Formato:

```
feat/
fix/
refactor/
chore/
docs/
test/
```

Con un slug corto en `kebab-case` describiendo el cambio, coherente con el tipo usado en [[conventional-commits]].

## Ejemplos

```
feat/project-admin
fix/project-publish
refactor/project-repository
chore/bump-nextjs
docs/architecture-rls-section
test/server-action-coverage
```

## Reglas

- El prefijo debe coincidir con el tipo de [[conventional-commits]] que dominará esa rama — si una rama mezcla un `feat` grande y un `fix` no relacionado, probablemente debería ser dos ramas (ver [[git-workflow]]).
- El slug describe el cambio, no la fecha ni el autor (`feat/project-admin`, no `feat/aitor-nueva-cosa-2026`).
- Ramas de corta duración — evitar ramas que viven semanas divergiendo de `main`; si una feature es grande, valorar dividirla en PRs más pequeños e incrementales.

## Checklist

- [ ] ¿El prefijo refleja el tipo real de cambio?
- [ ] ¿El nombre es descriptivo sin ser un resumen largo de una frase?
- [ ] ¿La rama tiene un alcance acotado a un solo cambio lógico?
