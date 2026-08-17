# Aitor OS

Web personal planteada como un "sistema operativo personal público": marca personal + base de conocimiento pública (Digital Garden) + centro de actividad (Dashboard), gestionada desde un panel de administración propio.

> **Estado actual: roadmap de implementación completo (Fases 1-9).** App Next.js funcional con todo el contenido (Proyectos, Garden, Lab, Recursos, Now, Stack, Contacto, Dashboard) y su panel de administración, más Dockerfile y stack de Supabase self-hosted de referencia. Pendiente de verificación en vivo: esta máquina de desarrollo no tuvo Docker instalado durante la implementación, así que la conexión real a Supabase y el build de la imagen Docker no se han probado todavía. Ver el roadmap en [`ARCHITECTURE.md`](./ARCHITECTURE.md#6-roadmap-de-implementación).

## Secciones previstas

Inicio, Sobre mí, Proyectos, Digital Garden, Dashboard, Now, Lab, Recursos y Contacto. Detalle de contenido de cada una en [`project-concept.md`](./project-concept.md).

## Stack técnico previsto

- **Aplicación**: Next.js (App Router), full-stack monolítico, un único contenedor Docker.
- **Datos, Auth y Storage**: Supabase **self-hosted** (Postgres + RLS, GoTrue, Storage) — sin depender del SaaS de Supabase.
- **Despliegue**: Coolify self-hosted.

Arquitectura completa, modelo de datos y modelo de seguridad: [`ARCHITECTURE.md`](./ARCHITECTURE.md).

## Diseño

Lenguaje visual HUD/cyberpunk (paleta oscura, acentos neón selectivos, bordes cortados, tipografía monoespaciada para "chrome" de interfaz). Detalle completo: [`design-concept.md`](./design-concept.md).

## Desarrollo

Este proyecto se desarrolla con [Claude Code](https://claude.com/claude-code) apoyado en un conjunto de skills (`.claude/skills/`) que documentan y vigilan la arquitectura, el design system, los límites entre capas, la seguridad (RLS), el testing y el flujo de despliegue. El punto de entrada para cualquier instancia de Claude Code que trabaje en este repo es [`CLAUDE.md`](./CLAUDE.md).

```bash
npm install
npm run dev        # http://localhost:3000
npm run build
npm run lint
npm run typecheck
```

### Base de datos local (requiere Docker Desktop)

```bash
cp .env.example .env.local   # y rellenar con los valores que imprime supabase start
npx supabase start
```

## Despliegue

Flujo (skill `aitor-os-deployment`): `GitHub → PR → CI (.github/workflows/ci.yml) → Docker Build (docker/Dockerfile) → Migraciones (supabase migration up, antes del contenedor nuevo) → Deploy Coolify → Healthcheck (/api/health) → Smoke Tests`.

Dos recursos independientes en Coolify, misma red interna:

- **App**: imagen construida desde `docker/Dockerfile` (`output: 'standalone'`).
- **Supabase**: `supabase/docker-compose.yml`, stack de referencia (Postgres, GoTrue, PostgREST, Storage, Kong, Studio) — variables en `supabase/.env.example`. Studio no se expone públicamente. **Sin verificar en vivo** (ver nota de estado arriba); revisar contra la documentación oficial de self-hosting de Supabase antes de desplegar.

## Licencia

Proyecto propietario. Todos los derechos reservados — ver [`LICENSE.md`](./LICENSE.md). No está permitido copiar, redistribuir ni reutilizar el código, diseño o contenido de este repositorio sin autorización expresa del titular.
