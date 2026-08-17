---
name: aitor-os-component-library
description: Mantiene el inventario vivo de componentes disponibles en Aitor OS (Panel, ClipCard, StatusBadge, ProgressBar, PulseIndicator, DataTable, PublishToggle, FeaturedToggle, MarkdownEditor, ToggleSwitch). Usar SIEMPRE antes de crear un componente para consultar qué existe, y actualizarla cuando se cree uno nuevo.
---

# Skill: Aitor OS — Component Library

Inventario de referencia rápida — el detalle de estilo de cada uno vive en [[aitor-os-design-system]], y la decisión de reutilizar/extender/crear en [[component-reuse-enforcer]].

## Componentes UI base (`src/components/ui/`)

| Componente | Propósito |
|---|---|
| `Panel` | Contenedor HUD principal, bordes cortados, base de la mayoría de bloques |
| `ClipCard` | Tarjeta de contenido (proyectos, garden notes, lab experiments, resources) |
| `StatusBadge` | Indicador de estado mapeado a color semántico (idea/en desarrollo/beta/finalizado/pausado y equivalentes) |
| `ProgressBar` | Barra de progreso con glow en el acento correspondiente |
| `PulseIndicator` | Indicador de actividad en vivo (último commit, proceso activo en Now) |

## Componentes admin (`src/components/admin/`)

| Componente | Propósito |
|---|---|
| `DataTable` | Listado admin genérico, agnóstico de la entidad concreta |
| `PublishToggle` | Toggle de `is_published` |
| `FeaturedToggle` | Toggle de `is_featured` |
| `MarkdownEditor` | Editor de contenido para campos de texto largo |
| `ToggleSwitch` | Toggle genérico para flags booleanos que no son `is_published`/`is_featured` (ej. `is_active`, `is_visible`) |

## Regla de mantenimiento de este inventario

Esta tabla es la fuente de verdad de "qué existe" para [[component-reuse-enforcer]]. Al terminar cualquier tarea que crea un componente reutilizable nuevo bajo `components/ui/` o `components/admin/`, añadirlo aquí en la misma tarea. Si esta lista queda desactualizada, la próxima tarea duplicará algo por no saber que ya existe — mantenerla al día no es opcional.

## Antes de crear cualquier elemento visual

Consultar esta tabla primero. Si nada encaja, pasar por [[component-reuse-enforcer]] para decidir extender vs crear, y por [[ui-component-architect]] para diseñar bien su API si se crea.
