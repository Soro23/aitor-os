---
name: module-boundary-enforcer
description: Vigila que cada colección/entidad de Aitor OS exponga solo lo necesario y no se importen detalles internos desde fuera de su capa. Usar SIEMPRE al importar algo de server/repositories, server/actions o types/dto desde otra parte del código.
---

# Skill: Module Boundary Enforcer

Aitor OS no usa carpetas por feature con `index.ts` como API pública (ver [[aitor-os-architecture]] — es organización por capa técnica). Aun así, cada entidad debe mantener un límite claro dentro de su propia capa.

## Regla práctica en esta arquitectura por capas

- `server/repositories/projects.ts` es el único punto de acceso a la tabla `projects`. Nada fuera de `server/actions/*` debería importarlo directamente (ver [[repository-pattern]]).
- `server/actions/projects.ts` es el único punto que un componente admin llama para mutar proyectos. Un componente no debe reconstruir a mano la llamada a Supabase que ya hace la Server Action.
- `types/dto/project.ts` es el contrato que cruza de servidor a cliente. Un componente no debe depender de una forma de datos "casera" que solo coincide por casualidad con el DTO real.

## Al importar entre entidades

Si `garden_notes` necesita datos de `projects` (por ejemplo, para relacionar contenido), la relación debe pasar por los repositorios respectivos, no por un import directo de tipos internos de otra entidad sin pasar por su DTO.

## Checklist

- [ ] ¿Algo fuera de `server/actions/*` importa un repositorio directamente?
- [ ] ¿Un componente reconstruye una query o mutación que ya existe como Server Action?
- [ ] ¿Dos entidades se relacionan a través de sus DTOs/repositorios, o hay un acceso cruzado informal?

Esta skill controla la **dirección** de los imports entre capas; [[public-api-enforcer]] controla, dentro de cada archivo de `server/actions/*` o `server/repositories/*`, **qué se exporta** como superficie pública frente a qué queda privado — son dos ángulos del mismo problema de encapsulación y conviene revisarlas juntas.
