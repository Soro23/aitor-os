---
name: visual-consistency-reviewer
description: Compara una interfaz nueva de Aitor OS contra el resto del sitio para detectar inconsistencias visuales. Usar SIEMPRE al terminar una pantalla o vista nueva, antes de darla por lista.
---

# Skill: Visual Consistency Reviewer

Mientras [[design-system-guardian]] revisa valores concretos (colores, spacing), esta skill compara la pantalla nueva contra pantallas ya existentes del mismo tipo.

## Qué comparar

- ¿Las cards de esta pantalla se ven como `ClipCard` en el resto del sitio, o inventan su propia forma?
- ¿Los botones tienen el mismo tratamiento visual (bordes cortados, estado hover/focus) que en otras secciones?
- ¿El espaciado entre bloques es coherente con pantallas similares (ej. dos vistas de listado deberían tener el mismo ritmo vertical)?
- ¿La jerarquía tipográfica (tamaño de título, subtítulo, cuerpo) coincide con el resto del sitio para el mismo nivel de importancia?
- ¿Se ha introducido una variación visual que en realidad no aporta nada distinto — una card "casi igual" a `ClipCard` pero con un padding distinto sin motivo?

## Método de revisión

1. Identificar la pantalla más parecida ya existente en el proyecto (mismo tipo: listado, detalle, formulario, dashboard).
2. Comparar componente a componente: cards, botones, badges, espaciado, tipografía.
3. Cualquier diferencia debe tener una razón funcional (ej. "esta vista necesita más densidad porque son logs"), no ser accidental.

## Salida esperada

Listar las inconsistencias encontradas comparando explícitamente "pantalla X hace A, esta pantalla nueva hace B" — no una opinión genérica de "no se ve coherente".
