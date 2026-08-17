---
name: feature-isolation
description: Evita dependencias fuertes entre las entidades/secciones de Aitor OS (proyectos, garden, lab, resources, now, stack, contacto). Usar SIEMPRE al conectar dos entidades entre sí, para que cada una pueda evolucionar sin romper las demás.
---

# Skill: Feature Isolation

Entidades del proyecto: `projects`, `garden_notes`, `lab_experiments`, `resources`, `now_items`, `stack_items`, `contact_messages`. Cada una debe poder evolucionar (cambiar su esquema, su UI, su lógica) sin obligar a tocar las demás.

## Dónde SÍ hay relación legítima

- `garden_note_relations` es una relación auto-referenciada dentro de la propia entidad `garden_notes` — no acopla `garden_notes` a otra entidad distinta.
- El Dashboard agrega datos de varias entidades (proyectos activos, actividad) — eso es una capa de agregación consciente, no acoplamiento accidental entre repositorios.

## Dónde NO debería haber relación

- `projects` no debería depender de detalles internos de `lab_experiments` ni viceversa.
- Un cambio en el esquema de `resources` no debería requerir tocar `garden_notes`.
- Los componentes admin de una entidad no deberían importar componentes admin de otra salvo los genéricos compartidos (`DataTable`, `PublishToggle`, etc., que son neutrales a la entidad).

## Al conectar dos entidades

1. ¿La relación es un dato real (foreign key documentado) o solo conveniencia de implementación? → si es lo segundo, buscar una forma que no acople directamente.
2. Si hace falta agregación entre varias entidades (como el Dashboard), esa lógica vive en su propio repositorio/Server Action de agregación, no repartida dentro de los repositorios de cada entidad individual.
3. ¿Cambiar el esquema de una entidad obliga a cambiar código de otra que no debería enterarse? → señal de acoplamiento a resolver.

## Checklist

- [ ] ¿Hay imports cruzados entre repositorios de entidades sin una relación de datos real?
- [ ] ¿La lógica de agregación (Dashboard) está aislada en su propio lugar, no mezclada dentro de los repositorios individuales?
- [ ] ¿Un cambio en una entidad obliga a tocar código de otra sin motivo de datos?
