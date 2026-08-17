# CLAUDE.md

Este archivo proporciona contexto a Claude Code (claude.ai/code) al trabajar con código en este repositorio.

## Estado actual del repositorio

Fases 1-8a del roadmap completadas: app Next.js 16 (App Router) con tema visual base (Fase 1); los 3 clientes Supabase apuntando al schema `asros` (Fase 2); esquema completo + RLS + tipos (Fase 3); autenticación admin (Fase 4); CRUD completo de Proyectos como slice de referencia (Fase 5); CRUD de Digital Garden con relaciones N:N entre notas (Fase 6); CRUD de Lab Experiments y Resources (Fase 7); Now y Stack como colecciones de edición directa (`is_active`/`is_visible`, sin flujo de publicación, componente nuevo `ToggleSwitch`) (Fase 8a). **Todavía no hay Contacto ni la agregación de Dashboard/Inicio con GitHub, ni Docker** — eso corresponde al resto de la Fase 8 y a la Fase 9, ver `ARCHITECTURE.md` §6. El patrón de Proyectos/Garden/Lab/Resources (`lib/validation/`, `types/dto/`, `server/repositories/`, `server/actions/`, UI admin+pública, tests) es la plantilla a replicar para cada entidad siguiente. Estilos de formularios/listados admin ya centralizados en `src/styles/admin-form.module.css` y `src/styles/admin-list.module.css` — reutilizar, no duplicar.

> Nota de entorno: esta máquina no tiene Docker instalado, así que `npx supabase start`/`db reset` no se han podido ejecutar todavía — todo el código de las Fases 2 en adelante está escrito y pasa `build`/`lint`/`typecheck`/`test:unit`, pero sin verificación en vivo contra una instancia real hasta que Docker esté disponible. `test:integration` y `test:e2e` están escritos pero no ejecutados.
>
> Nota técnica: Next.js 16 marca el archivo `middleware.ts` como deprecado en favor de `proxy.ts` (sigue funcionando, solo un aviso en build). Se mantiene `middleware.ts` porque `ARCHITECTURE.md` y varias skills (`auth-security-reviewer`, etc.) lo nombran explícitamente. Revisar si Next.js elimina el soporte antes de la Fase 9.
>
> Nota técnica: `database.types.ts` está escrito a mano (sin Docker no se puede ejecutar `supabase gencode`). Cada tabla necesita un campo `Relationships: []` junto a `Row`/`Insert`/`Update` y el `Database` type necesita la clave `__InternalSupabase: { PostgrestVersion: "13" }` — sin ellos, `@supabase/supabase-js` resuelve `.from(tabla)` como `never` en vez de los tipos reales (typecheck pasa pero sin ningún chequeo real). Si se regenera con la CLI, este problema desaparece solo.

- `ARCHITECTURE.md` — arquitectura técnica decidida.
- `design-concept.md` — lenguaje visual decidido.
- `project-concept.md` — concepto de producto/contenido.
- `LICENSE.md` — licencia propietaria.
- `.claude/skills/` — 60 skills de Claude Code que gobiernan cómo se construye el proyecto (ver más abajo).
- `src/` — código de aplicación (ver "Comandos" y "Arquitectura planeada" más abajo).

### Comandos

Verificados contra `package.json`:

```
npm run dev              # servidor de desarrollo (Next.js, Turbopack)
npm run build            # build de producción (output: 'standalone')
npm run start             # sirve el build de producción
npm run lint               # ESLint (eslint-config-next, flat config)
npm run typecheck          # tsc --noEmit
npm run test:unit           # Vitest — tests/unit/ y tests/actions/ (mocks de sesión, sin Docker)
npm run test:integration    # Vitest — tests/repository/ y tests/integration/ (Supabase real, requiere Docker)
npm run test:e2e            # Playwright (chromium) — tests/e2e/, requiere Docker + `npm run dev` corriendo
```

`test:integration`/`test:e2e` necesitan `.env.test` (copiar de `.env.test.example`) con un usuario admin de prueba — se crea solo la primera vez (ver `tests/helpers/admin-session.ts`).

```
npx supabase start   # levanta Postgres/GoTrue/PostgREST/Storage/Kong/Studio locales
npx supabase stop    # los detiene
npx supabase db reset            # reaplica todas las migraciones de supabase/migrations/
npx supabase gencode typescript --local --schema asros > src/types/dto/database.types.ts
```

## Qué es este proyecto

Aitor OS es una web personal — marca personal + base de conocimiento pública (Digital Garden) + centro de actividad (Dashboard) — planteada como un "sistema operativo personal público", no un portfolio estático. Secciones: Inicio, Sobre mí, Proyectos, Digital Garden, Dashboard, Now, Lab, Recursos, Contacto, gestionadas desde un panel de administración propio (single-admin). Ver `project-concept.md` para el detalle de contenido de cada sección.

## Arquitectura planeada

Definida en `ARCHITECTURE.md` — resumen operativo, no reproducir aquí el detalle completo:

- **Stack**: Next.js (App Router) full-stack monolítico, un único contenedor Docker. Datos/Auth/Storage en Supabase **self-hosted** (Postgres + GoTrue + Storage), no el SaaS de Supabase. Despliegue en Coolify self-hosted.
- **Flujo de capas (innegociable)**: `UI → Server Actions (server/actions/*) → Repositorios (server/repositories/*) → Supabase`. Ningún componente accede a Supabase directamente; ninguna Server Action ejecuta SQL — siempre delega en un repositorio.
- **Estructura por capa técnica, no por feature-folder**: no existe (ni debe crearse) `features/<nombre>/index.ts`. El código de una entidad se reparte entre `server/actions/`, `server/repositories/`, `types/dto/`, `lib/validation/`.
- **Modelo de datos**: colecciones editoriales (`projects`, `garden_notes`, `lab_experiments`, `resources`) comparten el patrón `is_published` / `is_featured` / `sort_order` / `created_at` / `updated_at` — Inicio y Dashboard siempre consultan `WHERE is_published AND is_featured`. Colecciones de edición directa sin publicación: `now_items`, `stack_items`. Soporte: `contact_messages`, `app_admins`. Todas viven en el schema Postgres **`asros`** (no `public`) — los 3 clientes Supabase ya se crean con `db: { schema: "asros" }`, y toda migración nueva debe crear sus objetos con el prefijo `asros.`.
- **Seguridad**: el frontend nunca es la frontera de seguridad. La autorización real vive en RLS de Postgres (`app_admins` + función `is_admin()`), reforzada por `requireAdmin()` en cada Server Action de escritura y por `middleware.ts` en `/admin/**`.
- **Autenticación**: email + contraseña (Supabase Auth), registro público desactivado, un único admin.

Detalle completo, checklist de aplicación y enlaces cruzados: skill `aitor-os-architecture` (mapa general), `code-boundaries` (límites entre capas), `repository-pattern` (forma de un repositorio), `server-action-pattern` (forma de una Server Action), `rls-security-reviewer`/`aitor-os-security-rules` (seguridad).

## Design system

Lenguaje visual HUD/cyberpunk definido en `design-concept.md`: paleta oscura con acentos neón de uso selectivo, bordes cortados (`clip-path`) en vez de `border-radius`, tipografía monoespaciada para "chrome" de interfaz y sans para contenido de lectura larga. Implementación real: **CSS Modules + custom properties** (sin Tailwind) — tokens centralizados en `src/styles/tokens.css`, importado una vez desde `src/app/globals.css`; cada componente lleva su `.module.css` co-localizado. Componentes oficiales (`Panel`, `ClipCard`, `StatusBadge`, `ProgressBar`, `PulseIndicator` ya implementados en `src/components/ui/`; `DataTable`, `PublishToggle`, `FeaturedToggle`, `MarkdownEditor` pendientes de la Fase 5): inventario vivo en la skill `aitor-os-component-library`, detalle de paleta/tipografía en `aitor-os-design-system` — comprobar ahí antes de crear cualquier elemento visual nuevo.

## Límites arquitectónicos y cajas negras

- `server/repositories/<entidad>.ts` es el **único** punto de acceso a esa tabla. Nada fuera de `server/actions/*` lo importa directamente.
- Una Server Action sigue siempre: `requireAdmin()` → `schema.parse()` (zod) → `repository.method()` → `revalidatePath()`. No mezclar llamadas directas a Supabase con llamadas al repositorio en la misma acción.
- El cliente Supabase `admin` (service-role, `lib/supabase/admin.ts`) bypassa RLS — solo en scripts de administración, **nunca** en el camino de una request pública.
- Los datos que cruzan de servidor a cliente pasan por un DTO (`types/dto/`), no por el tipo de base de datos crudo.
- Antes de crear un componente visual nuevo, comprobar `aitor-os-component-library`: reutilizar > extender > variant > crear. Nunca duplicar.

Estas reglas están vigiladas activamente por las skills `code-boundaries`, `repository-pattern`, `server-action-pattern`, `module-boundary-enforcer`, `public-api-enforcer`, `dto-contract-guardian` y `component-reuse-enforcer` — consultarlas para el checklist completo, no reimplementar su criterio aquí.

## Flujos de trabajo

### Flujo de implementación de una feature/entidad nueva

Orden fijo documentado en la skill `aitor-os-feature-generator` (o su atajo `aitor-os-crud-generator` para "genera el CRUD completo de X"):

```
1. Migración SQL (supabase/migrations/)
2. Políticas RLS (misma migración o la siguiente — nunca "para después")
3. Tipos generados + DTO (types/dto/)
4. Esquema de validación zod (lib/validation/)
5. Repositorio (server/repositories/)
6. Server Actions (server/actions/)
7. UI admin (app/admin/**)
8. UI pública (app/(public)/**)
9. Tests (unitarios, integración, e2e si es flujo crítico)
```

Cadena de skills a seguir en ese mismo orden conceptual: `aitor-os-architecture` → `code-boundaries` → `aitor-os-design-system` → `component-reuse-enforcer` → `aitor-os-feature-generator` → `repository-pattern` → `rls-security-reviewer` → `aitor-os-code-review` → `ci-guardian`.

### Flujo de Git

Definido en la skill `git-workflow`: `main` es siempre desplegable. Trabajo nuevo en rama `feat/`, `fix/`, `refactor/`, `chore/`, `docs/` o `test/` (convención en `branch-strategy`) con commits en formato Conventional Commits (`conventional-commits`) — sin referencias a IA en el mensaje. Merge a `main` vía PR, incluso en solitario: revisar el contenido con `aitor-os-code-review` y pasar el checklist de cierre de `pull-request-reviewer` antes de mergear. Sin ramas de larga duración paralelas a `main`.

### Flujo de CI

Definido en la skill `ci-guardian` — un PR no es válido si falla cualquiera de estos pasos, en este orden: `Install → Lint → Typecheck → Unit Tests → Integration Tests → Build → Security Checks`.

### Flujo de despliegue

Definido en la skill `aitor-os-deployment` (instancia sobre Coolify/Supabase self-hosted de `deployment-guardian`):

```
GitHub → Pull Request → CI → Tests → Build → Merge
  → Docker Build → Database Migrations → Deploy Coolify
  → Healthcheck → Smoke Tests → Producción
```

Regla no negociable: las migraciones (`supabase migration up`) se aplican **antes** de desplegar el contenedor nuevo, nunca en su arranque — evita condiciones de carrera con varias instancias (skill `migration-deployment-guardian`). Variables de entorno y topología (app + stack Supabase self-hosted como recursos Coolify separados): skill `coolify-deployment`.

### Roadmap de implementación inicial (aún no empezado)

De `ARCHITECTURE.md`, sección 6 — orden previsto para arrancar el proyecto desde cero:

```
1. Bootstrap Next.js (TS, App Router, tema visual, rutas públicas con placeholder)
2. Conexión a Supabase self-hosted (clientes, variables de entorno)
3. Esquema de base de datos + RLS, generación de tipos
4. Autenticación admin (single-admin, login, middleware, requireAdmin())
5. CRUD de Proyectos — slice de referencia del patrón completo
6. CRUD de Digital Garden
7. CRUD de Lab y Recursos
8. Now, Stack, Contacto y agregación del Dashboard
9. Dockerfile y despliegue en Coolify (producción)
```

## Convenciones de nomenclatura

Ya fijadas en `ARCHITECTURE.md` y aplicadas de forma consistente en el modelo de datos:

- Tablas: `snake_case`, plural (`projects`, `garden_notes`).
- Columnas: `snake_case` (`is_published`, `created_at`).
- Booleanos: prefijo `is_`/`has_`/`can_`.
- Clave primaria: `id`. Clave foránea: `<tabla_singular>_id`.
- Timestamps: `created_at`, `updated_at`.
- Archivos/carpetas: `kebab-case`. Componentes React: `PascalCase`.

## Testing

Stack: Vitest (unitarios e integración), Testing Library (componentes React), Playwright (e2e). Regla del proyecto: los tests de integración corren contra un Supabase de test **real**, nunca mocks del cliente Supabase — un mock puede mentir sobre cómo se comporta RLS. Qué testear según el tipo de cambio: skill `aitor-os-testing-rules` (índice) → `unit-test-writer`, `repository-test-writer`, `server-action-test-writer`, `integration-test-writer`, `e2e-test-writer`, `regression-test-guardian`.

## Documentación y skills del proyecto

- `ARCHITECTURE.md` — arquitectura técnica completa (fuente de verdad de este archivo para todo lo estructural).
- `design-concept.md` — lenguaje visual completo (fuente de verdad para todo lo visual).
- `project-concept.md` — concepto de producto y contenido de cada sección.
- `.claude/skills/` — 60 skills que aplican estas reglas en detalle durante el desarrollo (arquitectura, design system, backend, base de datos/RLS, testing, devops/despliegue, git, y las específicas `aitor-os-*`). Su coherencia e inventario los mantiene la skill `aitor-os-skill-reviewer`.

Este `CLAUDE.md` es el mapa de orientación inicial — para el detalle de aplicación de cualquier regla mencionada aquí, usar la skill correspondiente en vez de asumir más de lo que dice esta página.

## Licencia

Propietaria, todos los derechos reservados (`LICENSE.md`). No redistribuir, publicar ni reutilizar código, diseño o contenido de este repositorio fuera de él.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
