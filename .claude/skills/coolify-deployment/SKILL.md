---
name: coolify-deployment
description: Conoce el despliegue específico de Aitor OS en Coolify self-hosted (Docker, Supabase self-hosted como stack separado, migraciones, healthcheck, variables de entorno). Usar SIEMPRE al tocar el Dockerfile, workflows de despliegue, variables de entorno de producción, o al diagnosticar problemas de despliegue.
---

# Skill: Coolify Deployment

Fuente de verdad: sección 5 de `ARCHITECTURE.md`.

## Topología de despliegue

Dos recursos Coolify independientes, en la misma red interna:

1. **App** (Aitor OS): imagen Docker construida desde `docker/Dockerfile` (multi-stage, `next.config.ts` con `output: 'standalone'`), desplegada como recurso "Application".
2. **Supabase self-hosted**: stack Docker Compose independiente (Postgres, GoTrue, PostgREST, Storage, Kong, Studio), desplegado como su propio recurso. Studio **no** se expone públicamente sin protección adicional.

No mezclar ambos en un mismo contenedor ni asumir que la app puede desplegarse sin el stack de Supabase ya arriba.

## Regla no negociable: migraciones antes del contenedor

```
Migraciones (supabase migration up)
↓
Nuevo contenedor de la app
```

Las migraciones se aplican de forma **explícita** antes de cada despliegue, nunca en el arranque del contenedor. Ejecutar migraciones en el boot de múltiples instancias crea condiciones de carrera (dos contenedores arrancando a la vez intentando migrar simultáneamente). Si se propone "migrar automáticamente al arrancar", señalarlo como incorrecto y remitir a esta regla.

## Variables de entorno (Coolify)

| Variable | Dónde se usa | Regla |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Cliente browser | Pública, correcto que sea `NEXT_PUBLIC_*` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Cliente browser | Pública, respeta RLS igualmente |
| `SUPABASE_SERVICE_ROLE_KEY` | Solo scripts de administración | **Nunca** en el camino de una request pública, nunca `NEXT_PUBLIC_*`, nunca en el bundle de cliente |
| `GITHUB_TOKEN` | Rate limit de la API de GitHub (proxy `/api/github`) | Opcional, server-side únicamente |

Ver también [[environment-secrets-guardian]] si existe esa skill; si no, esta tabla es la referencia mínima.

## Dockerfile — expectativas

- Multi-stage build (dependencias → build → runtime).
- Imagen final pequeña, basada en el output `standalone` de Next.js (no copiar `node_modules` completo a la imagen final).
- Usuario no root en el stage de runtime.
- Caché de capas eficiente: copiar `package.json`/`package-lock.json` e instalar dependencias antes de copiar el resto del código fuente.

## Healthcheck

Endpoint `app/api/health/`. Coolify debe usarlo para determinar si el contenedor está sano. Debe responder rápido y sin depender de una query pesada a la base de datos salvo que sea intencional para detectar caídas de Supabase.

## Flujo de despliegue completo

```
GitHub → Pull Request → CI (ver ci-guardian) → Tests → Build
  → Merge → Docker Build → Database Migrations → Deploy Coolify
  → Healthcheck → Smoke Tests → Producción
```

Este flujo es el mismo que orquesta [[aitor-os-deployment]] — esa skill es el punto de entrada al mapa completo, esta cubre el detalle específico de Coolify.

## Checklist antes de aprobar un cambio de despliegue

- [ ] ¿Las migraciones se ejecutan como paso explícito separado del arranque del contenedor?
- [ ] ¿Algún secreto (`SUPABASE_SERVICE_ROLE_KEY`, `GITHUB_TOKEN`) aparece como `NEXT_PUBLIC_*` o en un archivo que se copie al bundle de cliente?
- [ ] ¿El Dockerfile usa `output: 'standalone'` y multi-stage, con usuario no root?
- [ ] ¿Hay un plan de rollback si la migración o el despliegue fallan a mitad (imagen anterior + compatibilidad de esquema)?
- [ ] ¿El healthcheck en `/api/health` refleja de verdad si la app puede servir tráfico?
