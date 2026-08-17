---
name: rollback-planner
description: Planifica cómo revertir un despliegue de Aitor OS si algo sale mal — imagen Docker anterior, migraciones, compatibilidad de esquema, rollback de código, backups. Usar SIEMPRE antes de un despliegue importante o de una migración con riesgo.
---

# Skill: Rollback Planner

Todo despliegue importante debe poder revertirse. Antes de desplegar, tener respuesta clara a cada punto:

## Qué considerar

- **Imagen Docker anterior**: ¿sigue disponible/etiquetada para poder desplegarla de nuevo si la nueva falla? Coolify debe conservar al menos la imagen anterior accesible.
- **Migraciones**: ¿la migración aplicada es reversible? Si no lo es de forma segura (ver [[database-migration-reviewer]]), el rollback de código por sí solo no basta — hay que decidir de antemano qué se hace.
- **Compatibilidad de esquema**: si se revierte el código a la versión anterior pero la migración ya se aplicó, ¿el código viejo sigue funcionando contra el esquema nuevo? (relacionado con la advertencia de [[migration-deployment-guardian]] sobre columnas `NOT NULL` sin default)
- **Rollback de código**: volver al commit/imagen anterior en Coolify — confirmar que este paso está documentado y probado, no solo asumido como "se puede hacer".
- **Backups**: si el rollback de esquema no es viable, ¿hay un backup de Postgres reciente y restaurable? (ver [[production-readiness]] — un backup no probado no cuenta)

## Plantilla mínima antes de un despliegue de riesgo

1. ¿Qué se despliega exactamente (commit, migración)?
2. Si falla tras el deploy, ¿basta con volver a la imagen anterior, o la migración ya aplicada lo impide?
3. Si la migración lo impide, ¿cuál es el plan concreto (migración de reversión, restauración de backup)?
4. ¿Quién/qué detecta que algo falló (healthcheck, smoke test, monitorización manual)?

## Checklist

- [ ] ¿Existe una imagen Docker anterior desplegable sin reconstruir?
- [ ] ¿Se sabe de antemano si la migración de este despliegue es reversible o no?
- [ ] ¿El código que se desplegaría en un rollback sigue siendo compatible con el esquema actual de la base de datos?
- [ ] ¿Hay un backup reciente si el rollback de esquema no es una opción?

Ver también [[aitor-os-deployment]] para el flujo completo de despliegue del proyecto.
