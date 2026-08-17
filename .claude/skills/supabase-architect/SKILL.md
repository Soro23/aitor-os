---
name: supabase-architect
description: Conoce la arquitectura de Supabase self-hosted usada por Aitor OS (Postgres, Auth/GoTrue, RLS, Storage, PostgREST) y la separación entre clientes browser/server/admin. Usar SIEMPRE al configurar o tocar la integración con Supabase.
---

# Skill: Supabase Architect

Aitor OS usa Supabase **self-hosted** (no el SaaS de Supabase), como stack Docker Compose separado en Coolify: Postgres, GoTrue (Auth), PostgREST, Storage, Kong, Studio. Ver [[coolify-deployment]] para el despliegue de este stack.

## Componentes usados

- **Postgres**: fuente de verdad, con RLS como frontera real de seguridad (ver [[rls-security-reviewer]]).
- **Auth (GoTrue)**: email + contraseña, registro público desactivado, single-admin.
- **Storage**: imágenes (screenshots de proyectos, etc.).
- **PostgREST**: expone Postgres como API REST, consumida a través del SDK `@supabase/supabase-js`.

## Tres clientes, tres contextos — nunca mezclarlos

```
lib/supabase/browser.ts   → cliente cliente-side, usa NEXT_PUBLIC_SUPABASE_ANON_KEY, respeta RLS
lib/supabase/server.ts     → cliente server-side autenticado (Server Components/Actions), respeta RLS
lib/supabase/admin.ts       → cliente con SUPABASE_SERVICE_ROLE_KEY, bypassa RLS, SOLO scripts de administración
```

Regla dura: el cliente `admin` nunca debe estar en el camino de una request pública ni de una Server Action que responde a un usuario. Ver [[code-boundaries]] y [[environment-secrets-guardian]].

## Al añadir una integración nueva con Supabase

1. ¿Es Storage, Auth o Postgres lo que necesito? → usar el cliente correcto para el contexto.
2. ¿La operación debe respetar RLS (caso normal) o es un script de mantenimiento que necesita bypassarla (caso raro)? → el segundo caso es la única justificación para usar `admin`.
3. ¿La tabla afectada tiene sus políticas RLS ya revisadas? → ver [[rls-security-reviewer]] antes de dar la integración por terminada.

## Studio

Studio (UI de administración de Supabase) no se expone públicamente sin protección adicional — es un checklist de despliegue, ver [[production-readiness]].
