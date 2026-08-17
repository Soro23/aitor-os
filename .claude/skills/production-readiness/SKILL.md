---
name: production-readiness
description: Checklist final de Aitor OS antes de considerar algo listo para producción — build, tests, migraciones, RLS, secrets, healthcheck, logs, backup, rollback. Usar SIEMPRE antes del primer despliegue a producción o de un cambio mayor que vaya a producción.
---

# Skill: Production Readiness

Checklist de cierre, agregando lo verificado por las skills específicas — no repite su detalle, confirma que cada una se pasó.

```
Build correcto              → build-validator
Tests correctos              → test-coverage-reviewer + unit/integration/e2e-test-writer
Migraciones revisadas         → database-migration-reviewer
RLS revisado                   → rls-security-reviewer
Secrets correctos                → environment-secrets-guardian
Healthcheck correcto                → healthcheck-validator
Logs correctos                        → (sin console.log en producción, logs estructurados con contexto, sin datos sensibles)
Backup disponible                       → backup de Postgres self-hosted configurado y probado
Rollback posible                          → rollback-planner
```

## Puntos específicos de Aitor OS a confirmar antes del primer despliegue real

- [ ] Supabase Studio no está expuesto públicamente sin protección adicional (ver [[supabase-architect]]).
- [ ] `app_admins` tiene exactamente el/los usuario(s) esperado(s) y ningún registro accidental.
- [ ] Las 4 colecciones editoriales (`projects`, `garden_notes`, `lab_experiments`, `resources`) tienen RLS verificado individualmente, no solo una de ellas como referencia.
- [ ] El backup de Postgres self-hosted existe y se ha probado una restauración al menos una vez — un backup nunca probado no cuenta como backup real.
- [ ] Variables de entorno de producción en Coolify coinciden con lo documentado en [[coolify-deployment]], sin valores de desarrollo olvidados.

## Logs en producción

No usar `console.log` en producción (ver reglas generales del proyecto). Logs estructurados (info/warn/error) con contexto (usuario, endpoint, payload relevante) sin datos sensibles (contraseñas, tokens, contenido de `contact_messages` completo si es información personal).

## Regla de cierre

No marcar "listo para producción" si falta cualquiera de los 9 puntos de la checklist principal, incluso si "probablemente no pase nada" — son exactamente los puntos que fallan silenciosamente.

Ver también [[aitor-os-deployment]] para el flujo completo de despliegue del que esta checklist es el cierre.
