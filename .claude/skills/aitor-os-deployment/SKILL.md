---
name: aitor-os-deployment
description: Punto de entrada único al flujo de despliegue del proyecto — mapea el checklist genérico de deployment-guardian a la infraestructura real de Aitor OS (GitHub, CI, Docker, migraciones de Supabase, Coolify, healthcheck). Usar SIEMPRE al preguntar "cómo se despliega esto" o al orquestar un despliegue.
---

# Skill: Aitor OS — Deployment

Índice del flujo de despliegue completo, agregando las skills específicas de devops — consultarlas para el detalle de cada etapa. Esta skill es la instancia, para la infraestructura real del proyecto (Coolify + Supabase self-hosted), del checklist genérico de [[deployment-guardian]] — usar esta cuando la pregunta es "¿cómo se despliega Aitor OS en concreto?", y [[deployment-guardian]] cuando la pregunta es sobre el proceso de orquestación en abstracto. Para versionado y changelog por encima de un despliegue, ver [[release-manager]].

## Flujo completo

```
GitHub
  ↓
Pull Request           → pull-request-reviewer
  ↓
CI                       → ci-guardian
  ↓
Tests                       → aitor-os-testing-rules
  ↓
Build                          → build-validator
  ↓
Merge                             → git-workflow
  ↓
Docker Build                        → docker-architect, dockerfile-reviewer
  ↓
Database Migrations                   → migration-deployment-guardian
  ↓
Deploy Coolify                          → coolify-deployment
  ↓
Healthcheck                               → healthcheck-validator
  ↓
Smoke Tests
  ↓
Producción                                  → production-readiness, rollback-planner (por si acaso)
```

Enlaces reales a cada etapa del diagrama: [[pull-request-reviewer]], [[ci-guardian]], [[aitor-os-testing-rules]], [[build-validator]], [[git-workflow]], [[docker-architect]], [[dockerfile-reviewer]], [[migration-deployment-guardian]], [[coolify-deployment]], [[healthcheck-validator]], [[production-readiness]], [[rollback-planner]].

## Topología desplegada

Dos recursos Coolify separados en la misma red interna: la app Next.js (imagen Docker propia) y el stack Supabase self-hosted (Postgres, GoTrue, PostgREST, Storage, Kong, Studio). Ver [[supabase-architect]] y [[coolify-deployment]] para el detalle.

## Reglas no negociables del flujo (resumen — detalle en cada skill enlazada)

- Migraciones siempre antes del contenedor nuevo, nunca en su arranque ([[migration-deployment-guardian]]).
- Ningún secreto server-only expuesto como `NEXT_PUBLIC_*` ni hardcodeado en el Dockerfile ([[environment-secrets-guardian]]).
- Un despliegue no se considera terminado sin healthcheck y smoke test en verde.
- Todo despliegue de riesgo tiene plan de rollback decidido de antemano, no improvisado si algo falla ([[rollback-planner]]).

## Cuándo usar esta skill vs las específicas

Usar esta como mapa general cuando la pregunta es "¿cómo se despliega Aitor OS?" o para orquestar un despliegue de principio a fin. Para el detalle de una etapa concreta (Dockerfile, migraciones, healthcheck), ir directo a la skill correspondiente de la tabla.
