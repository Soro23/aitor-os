---
name: aitor-os-architecture
description: Conoce la arquitectura completa de Aitor OS (Next.js App Router monolítico + Supabase self-hosted + Coolify) y la estructura de carpetas del proyecto. Usar SIEMPRE antes de crear o modificar cualquier archivo, como primer paso al implementar una feature, para decidir en qué capa y carpeta debe vivir el código nuevo.
---

# Skill: Aitor OS — Arquitectura

Fuente de verdad: `ARCHITECTURE.md` en la raíz del repo. Si ese archivo cambia, esta skill queda desactualizada — releerlo antes de asumir nada.

## Visión general

Aitor OS es un único proyecto Next.js (App Router) full-stack, empaquetado como una sola imagen Docker, desplegado en Coolify self-hosted. Los datos, la autenticación y el storage viven en un Supabase self-hosted (stack Docker separado, misma red interna).

No hay microservicios, no hay backend separado, no hay BaaS de terceros gestionado. Todo el backend es Server Actions + repositorios dentro del propio proyecto Next.js.

## Flujo de capas (innegociable)

```
UI (componentes / páginas)
  ↓
Server Actions (server/actions/*)
  ↓
Repositorios (server/repositories/*)
  ↓
Supabase (Postgres + RLS)
```

Las rutas públicas leen datos también a través de repositorios, nunca con queries propias. Ver [[code-boundaries]] para las reglas exactas de qué puede y no puede cruzar cada frontera.

## Estructura de carpetas real del proyecto

```
src/
  app/
    (public)/        Inicio, Sobre mí, Proyectos, Garden, Dashboard, Now, Lab, Recursos, Contacto
    admin/            Panel protegido: login, listados + editores por colección, now, stack, mensajes
    api/              health/ (healthcheck Coolify), github/ (proxy/caché de actividad GitHub)
  components/ui/       Lenguaje visual HUD reutilizable (Panel, ClipCard, StatusBadge, ProgressBar, PulseIndicator)
  components/admin/    DataTable, PublishToggle, FeaturedToggle, MarkdownEditor
  lib/supabase/        Clientes: browser, server (respeta RLS), admin (service-role, solo scripts)
  lib/auth/             getUser(), requireAdmin()
  lib/validation/       Esquemas zod, uno por entidad
  server/actions/       Server Actions: validar (zod) → delegar en repositorio
  server/repositories/  Único punto que habla con Supabase por entidad
  types/dto/             DTOs por entidad + tipos generados de la base de datos
  middleware.ts          Guarda de rutas /admin/**
supabase/migrations/     Esquema versionado (SQL)
docker/                  Dockerfile multi-stage para Coolify
```

Importante: **no** es una estructura por feature-folder (`features/projects/index.ts`). Es una estructura por capa técnica. Un archivo nuevo relacionado con "proyectos" se reparte entre `server/actions/projects.ts`, `server/repositories/projects.ts`, `types/dto/project.ts`, `lib/validation/project.ts`, etc. — no se crea una carpeta `features/projects/`.

## Modelo de datos (resumen operativo)

Colecciones editoriales (con `is_published` / `is_featured`, mismo patrón de columnas): `projects` (+ `project_screenshots`), `garden_notes` (+ `garden_note_relations`), `lab_experiments`, `resources`.

Colecciones de edición directa (sin flujo de publicación): `now_items`, `stack_items`.

Cada colección debe poder evolucionar sin acoplarse fuerte a las demás — ver [[feature-isolation]] al conectar dos entidades entre sí (ej. relaciones como `garden_note_relations`).

Soporte: `contact_messages` (insert público, lectura solo admin), `app_admins` (lista de `user_id` autorizados como admin).

Toda tabla editorial sigue este patrón de columnas: `is_published boolean`, `is_featured boolean`, `sort_order`, `created_at`/`updated_at`. Inicio y Dashboard consultan siempre `WHERE is_published AND is_featured`.

## Decisiones de arquitectura que NO se cuestionan sin motivo fuerte

| Decisión | Motivo (no reabrir sin razón nueva) |
|---|---|
| Monolito Next.js, no microservicios | Un único contenedor, operable por una persona |
| Supabase self-hosted, no cloud gestionado | Control propio de datos, sin dependencia de terceros |
| Coolify + Docker, no Vercel | Self-hosted, sin lock-in de plataforma |
| Email + contraseña, registro público desactivado | Panel de un único admin |
| `app_admins` + RLS como frontera real de permisos | El frontend nunca es la barrera de seguridad |
| `is_published` / `is_featured` como mecanismo editorial | No hace falta un sistema de configuración aparte |
| `ENUM` de Postgres para taxonomías fijas | Vocabularios cerrados por el propio concepto del sitio |

## Cuándo usar esta skill

- Antes de crear cualquier archivo nuevo, para decidir la carpeta correcta.
- Antes de proponer una estructura distinta ("carpeta por feature", "microservicio aparte", etc.) — si la sugerencia contradice esta arquitectura, señalarlo explícitamente y preguntar antes de proceder.
- Como primer paso del flujo de implementación de una feature, seguido de [[code-boundaries]] → [[aitor-os-design-system]] → [[component-reuse-enforcer]] → [[aitor-os-feature-generator]] → [[repository-pattern]] → [[rls-security-reviewer]] → [[aitor-os-code-review]] → [[ci-guardian]]. Si la petición es directamente "genera el CRUD completo de X" de principio a fin, [[aitor-os-crud-generator]] es el atajo a la misma secuencia.
