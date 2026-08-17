---
name: changelog-generator
description: Genera y mantiene CHANGELOG.md de Aitor OS a partir de los commits realizados. Usar SIEMPRE al preparar un release o al terminar un conjunto de cambios significativo.
---

# Skill: Changelog Generator

Formato (ver reglas generales del proyecto en CLAUDE.md):

```
## [Unreleased] / [vX.Y.Z] - YYYY-MM-DD

### Added
- ...

### Changed
- ...

### Fixed
- ...

### Removed
- ...
```

## Cómo generar entradas a partir de commits

Mapear el tipo de [[conventional-commits]] a la sección del changelog:

```
feat:     → Added (o Changed si es una mejora sobre algo existente)
fix:      → Fixed
refactor: → normalmente no aparece en el changelog (no cambia comportamiento observable), salvo que afecte a algo visible
chore:    → normalmente no aparece, salvo que sea relevante para quien opera el proyecto (ej. cambio de versión de Node)
docs:     → no aparece
test:     → no aparece
ci:       → no aparece salvo que cambie cómo se despliega de forma relevante
perf:     → Changed
```

## Reglas

- Coherencia con los commits realizados — no inventar una entrada que no corresponde a ningún commit real.
- No incluir cambios irrelevantes o ruido (typos de docs, formateo) — el changelog es para quien usa/opera el sitio, no un log completo de Git.
- Cada entrada en una frase clara orientada al efecto observable ("Se puede destacar un proyecto desde el panel admin"), no al detalle de implementación ("Añadido método `setFeatured` al repositorio").
- Mantener coherencia con los commits: si un commit dice `fix: corregir validación de email`, la entrada de Fixed debe reflejar exactamente ese arreglo, no una versión distinta.

## Checklist

- [ ] ¿Cada entrada corresponde a un commit o PR real de este periodo?
- [ ] ¿Está en la sección correcta (Added/Changed/Fixed/Removed)?
- [ ] ¿Está redactada en términos de efecto observable, no de implementación interna?
- [ ] ¿Se ha excluido el ruido (chores internos, docs, tests)?

Cuando el conjunto de entradas corresponde a un release identificable (no solo a un `[Unreleased]` continuo), ver [[release-manager]] para el resto del proceso de versión.
