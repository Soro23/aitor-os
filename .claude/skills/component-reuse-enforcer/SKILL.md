---
name: component-reuse-enforcer
description: Fuerza la reutilización de componentes existentes antes de crear uno nuevo. Usar SIEMPRE antes de crear cualquier componente React nuevo en Aitor OS — bloquea la duplicación visual o funcional.
---

# Skill: Component Reuse Enforcer

Antes de crear un componente nuevo, revisar en este orden:

```
src/components/ui/
src/components/admin/
```

(No hay `src/features/*/components/` en este proyecto — ver [[aitor-os-architecture]]. La estructura real es por capa técnica, no por feature.)

## Árbol de decisión

```
¿Existe un componente que resuelve esto tal cual?
  → SÍ: reutilizarlo. No crear nada nuevo.

¿Existe un componente que resuelve el 80% del caso?
  → SÍ: extenderlo (nueva prop, no un componente paralelo).

¿Es una variación puramente visual de algo que ya existe (otro color, otro tamaño)?
  → SÍ: añadir una variant al componente existente, no duplicar el JSX.

¿Es un comportamiento adicional reutilizable en más sitios?
  → Componer: envolver el componente existente, no reescribirlo.

¿Es un concepto realmente distinto, sin solape con nada del inventario?
  → Crear componente nuevo, y añadirlo al inventario en aitor-os-design-system.
```

Nunca crear un componente duplicado "porque es más rápido en este momento". Duplicar es la opción prohibida por defecto — solo se permite si de verdad no hay overlap conceptual.

## Inventario de referencia rápida

Ver el inventario completo y actualizado en [[aitor-os-component-library]] — no duplicar esa lista aquí.

Antes de crear, por ejemplo, una "tarjeta de proyecto" nueva: comprobar si `ClipCard` + `StatusBadge` ya cubren el caso con las props adecuadas. Casi siempre sí.

## Checklist antes de escribir `export function NuevoComponente`

1. Grep del nombre conceptual (`badge`, `card`, `toggle`, `progress`, etc.) en `src/components/`.
2. Leer el componente más parecido encontrado — ¿sus props ya lo permiten con un valor distinto?
3. Si la respuesta es "necesitaría cambiar su lógica interna para mi caso", eso es una señal de extender, no de duplicar.
4. Si tras esto se crea un componente nuevo, documentarlo en el inventario de [[aitor-os-component-library]] en el mismo cambio.

## Errores a bloquear en revisión

- Un componente nuevo cuyo JSX es casi idéntico a otro existente con solo un color o texto distinto.
- Lógica de toggle/estado reimplementada en vez de usar `PublishToggle`/`FeaturedToggle`.
- Una tabla admin nueva escrita a mano en vez de usar `DataTable`.
- Componentes visuales que no siguen los patrones de [[aitor-os-design-system]] (bordes cortados, paleta, tipografía).
