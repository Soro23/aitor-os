---
name: aitor-os-security-rules
description: Conoce las reglas de seguridad específicas de Aitor OS — app_admins, is_admin(), RLS, single-admin, visibilidad de borradores, service role, middleware, requireAdmin(). Punto de entrada único a las reglas de seguridad del proyecto. Usar SIEMPRE ante cualquier duda de seguridad o antes de tocar auth/RLS/permisos.
---

# Skill: Aitor OS — Security Rules

Índice de las reglas de seguridad del proyecto, agregando lo que ya definen las skills específicas — consultarlas para el detalle de cada una.

## Modelo de seguridad, en una frase

El frontend nunca es la frontera de seguridad — la autorización real vive en Postgres RLS (`app_admins` + `is_admin()`), reforzada por `requireAdmin()` en Server Actions y por `middleware.ts` en rutas.

## Piezas del modelo

| Pieza | Qué hace | Skill de detalle |
|---|---|---|
| `app_admins` | Tabla con los `user_id` autorizados como admin — fuente de verdad de quién puede escribir | [[rls-security-reviewer]] |
| `is_admin()` | Función `security definer` que comprueba `auth.uid()` contra `app_admins`, usada en políticas RLS | [[rls-security-reviewer]] |
| RLS por tabla | Lectura pública limitada a `is_published`/`is_active`, escritura solo si `is_admin()` | [[rls-security-reviewer]], [[postgres-schema-reviewer]] |
| Single-admin | Registro público desactivado, un único usuario admin vía email+contraseña | [[auth-security-reviewer]] |
| `middleware.ts` | Guarda de rutas `/admin/**`, redirige a login sin sesión | [[auth-security-reviewer]] |
| `requireAdmin()` | Segunda comprobación, dentro de cada Server Action de escritura — defensa en profundidad junto al middleware | [[auth-security-reviewer]], [[server-action-pattern]] |
| Service role | Cliente `admin` con `SUPABASE_SERVICE_ROLE_KEY`, bypassa RLS, solo en scripts, nunca en camino de request pública | [[supabase-architect]], [[environment-secrets-guardian]] |
| Visibilidad de borradores | `is_published = false` nunca accesible a `anon`, ni siquiera conociendo el `id` directamente | [[rls-security-reviewer]] |

## Pregunta de validación rápida ante cualquier cambio

"Si el frontend tuviera un bug ahora mismo, ¿seguiría siendo imposible hacer lo que este cambio no debería permitir?" Si la respuesta depende de que el frontend se comporte bien, la seguridad no está donde debe estar — debe estar en RLS.

## Cuándo usar esta skill vs las específicas

Usar esta como punto de entrada cuando la pregunta es general ("¿es esto seguro?", "¿cómo funciona el modelo de permisos aquí?"). Para revisión detallada de una tabla concreta, una migración, o `middleware.ts`, ir directo a la skill específica de la tabla de arriba.
