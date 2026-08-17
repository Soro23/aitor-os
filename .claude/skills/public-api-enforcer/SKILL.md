---
name: public-api-enforcer
description: Vigila qué funciones se exportan como "API pública" de cada entidad en server/actions y server/repositories de Aitor OS, evitando exponer helpers internos. Usar SIEMPRE al añadir un export nuevo en server/actions/ o server/repositories/.
---

# Skill: Public API Enforcer

Aitor OS no organiza el código en `features/<nombre>/index.ts` (ver [[aitor-os-architecture]]), así que la "API pública" de una entidad es, en la práctica, el conjunto de funciones exportadas desde su archivo de Server Actions y desde su repositorio.

## Regla

- `server/actions/projects.ts` exporta solo las Server Actions que la UI necesita invocar (`createProject`, `updateProject`, `deleteProject`, `togglePublished`, `toggleFeatured`...). Funciones auxiliares internas (formateo, mapeo intermedio) no se exportan si solo se usan dentro del propio archivo.
- `server/repositories/projects.ts` exporta el objeto `projectsRepository` con sus métodos (ver [[repository-pattern]]). No exportar funciones sueltas de query que deberían ser métodos del mismo repositorio.
- `types/dto/project.ts` exporta los tipos que realmente cruzan capas. Tipos intermedios de un solo uso no necesitan exportarse.

## Señal de alerta

Si un componente importa una función que "suena interna" (`_buildProjectQuery`, `mapRawProject`) en vez de una Server Action o un método del repositorio, es una violación del límite — esa función debería quedar privada dentro de su archivo, o el componente debería usar la API pública en su lugar.

## Checklist

- [ ] ¿Cada export nuevo en `server/actions/*` o `server/repositories/*` es algo que la UI necesita llamar directamente?
- [ ] ¿Hay funciones auxiliares exportadas "por si acaso" que nadie fuera del archivo usa?
- [ ] ¿Algún componente importa un helper interno en vez de pasar por la Server Action o el repositorio correspondiente?

Esta skill controla **qué se exporta** desde cada archivo de `server/actions/*` o `server/repositories/*`; [[module-boundary-enforcer]] controla la **dirección** de los imports entre capas a partir de esa superficie exportada — son dos ángulos del mismo problema de encapsulación y conviene revisarlas juntas.
