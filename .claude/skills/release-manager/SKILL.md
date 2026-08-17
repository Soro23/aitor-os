---
name: release-manager
description: Añade la capa de versión y changelog por encima del flujo de despliegue de Aitor OS. Usar SIEMPRE al preparar un release versionado o al decidir cómo documentar un conjunto de despliegues; para el paso a paso técnico del despliegue en sí, usar aitor-os-deployment/deployment-guardian.
---

# Skill: Release Manager

Esta skill no orquesta el despliegue en sí — esa responsabilidad es de [[deployment-guardian]] (checklist genérico) y [[aitor-os-deployment]] (su instancia sobre Coolify/Supabase). `release-manager` añade encima la capa de "qué versión es esta y qué cambió", relevante cuando un despliegue merece tratarse como release identificable.

Aitor OS no tiene un ciclo de release formal tipo SemVer público (es un proyecto personal desplegado continuamente), pero cada despliegue a producción debería tratarse como un release identificable.

## Antes de un release

1. Confirmar que `main` está en verde (ver [[ci-guardian]] / [[build-validator]]).
2. Revisar el rango de commits desde el último despliegue — usar como base para el changelog (ver [[changelog-generator]]).
3. Pasar el checklist de [[production-readiness]] si el release incluye cambios de esquema, seguridad o infraestructura.
4. Confirmar el plan de rollback antes de desplegar (ver [[rollback-planner]]), no después.

## Etiquetado

Si se decide versionar (ej. `v0.3.0`), seguir SemVer: cambios incompatibles (breaking de esquema o de API interna) → major; features nuevas compatibles → minor; fixes → patch. Para un proyecto de un solo despliegue continuo, esto es opcional pero recomendable en cuanto el sitio esté en producción real, para poder referenciar "qué versión está desplegada" al diagnosticar un problema.

## Durante el release

Seguir el flujo de [[deployment-guardian]] (o su instancia concreta, [[aitor-os-deployment]]) sin saltarse pasos. Confirmar el healthcheck y smoke test tras el deploy antes de considerar el release cerrado.

## Después del release

Actualizar `CHANGELOG.md` (ver [[changelog-generator]]) con lo desplegado, no con lo planeado — el changelog documenta lo que ya está en producción.
