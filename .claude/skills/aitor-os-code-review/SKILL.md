---
name: aitor-os-code-review
description: Revisión de código específica de Aitor OS que combina arquitectura, seguridad, TypeScript, reutilización, design system y testing. Usar SIEMPRE antes de dar por terminada una tarea de implementación, o cuando el usuario pida revisar cambios de este proyecto.
---

# Skill: Aitor OS — Code Review

Revisión combinada, en este orden. Cada bloque delega en la skill dedicada si hace falta profundizar.

## 1. Arquitectura y capas — [[code-boundaries]]

- Sin queries a Supabase fuera de `server/repositories/`.
- Server Actions solo validan + delegan + revalidan, nada más.
- Ningún componente cliente importa código de `server/` directamente.
- Cliente Supabase correcto según contexto (browser/server/admin) — el `admin` (service-role) nunca en el camino de una request pública.

## 2. Seguridad — [[rls-security-reviewer]]

- Toda tabla nueva o modificada tiene RLS activado y revisado.
- `requireAdmin()` presente en toda Server Action de escritura.
- Ningún secreto (`SUPABASE_SERVICE_ROLE_KEY`, `GITHUB_TOKEN`) expuesto como `NEXT_PUBLIC_*`, en logs, ni en el bundle de cliente.
- Inputs validados con zod antes de llegar al repositorio.

## 3. TypeScript

- Sin `any` sin justificación explícita en comentario.
- DTOs usados en los límites entre capas, no tipos de base de datos crudos en la UI.
- Tipos no duplicados — si ya existe un tipo equivalente en `types/dto/`, reutilizarlo.

## 4. Reutilización y design system — [[component-reuse-enforcer]] + [[aitor-os-design-system]]

- Ningún componente nuevo duplica uno existente en `components/ui/` o `components/admin/`.
- Colores, spacing, radios y tipografía usan la paleta y patrones documentados, no valores arbitrarios.
- Un componente reutilizable nuevo queda documentado en el inventario del design system.

## 5. Rendimiento

- Sin queries repetidas evitables a Supabase en el mismo request.
- Sin cálculos pesados dentro de loops de render.
- Listados largos con paginación o límite razonable, no `select *` sin filtro.

## 6. Testing

- Lógica crítica (validación, repositorios, server actions, RLS) tiene al menos un test.
- No hay tests que verifiquen detalles de implementación irrelevantes en vez de comportamiento.

## 7. Mantenibilidad general

- Funciones dentro de ~50-60 líneas; si una función crece más, valorar dividirla.
- Sin imports, variables o código muerto.
- Nomenclatura consistente con las convenciones del proyecto: `camelCase` variables/funciones, `PascalCase` clases/componentes/tipos, `snake_case` plural en tablas y columnas de base de datos, `kebab-case` en archivos/carpetas y endpoints.
- Sin abstracciones nuevas que no resuelven un problema que ya se repite al menos dos o tres veces.

## Formato de salida al reportar hallazgos

Para cada hallazgo: archivo, línea si aplica, qué está mal, por qué importa en este proyecto concreto (no una regla genérica), y la corrección concreta. Priorizar: seguridad > arquitectura > correctness > mantenibilidad > estilo.

No aprobar una tarea como terminada si hay una violación de RLS, de capas ([[code-boundaries]]), o un componente duplicado sin justificación — esas tres categorías son bloqueantes, el resto son recomendaciones.
