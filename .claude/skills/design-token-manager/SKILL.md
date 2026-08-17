---
name: design-token-manager
description: Centraliza las decisiones visuales de Aitor OS en tokens compartidos (spacing, font-size, radius, color, shadow, breakpoints) en vez de valores sueltos. Usar SIEMPRE al definir un valor visual nuevo, para decidir si debe ser un token o si ya existe uno.
---

# Skill: Design Token Manager

Evitar valores arbitrarios:

```css
margin-top: 17px;
border-radius: 13px;
```

Favorecer tokens compartidos (Tailwind config / CSS variables, según lo que el proyecto tenga configurado) para:

```
spacing
font-size
font-weight
radius
border
shadow
color
animation
breakpoints
```

## Origen de los tokens en Aitor OS

Los valores de color y tipografía ya están fijados en [[aitor-os-design-system]] (paleta exacta, fuentes mono/sans). Esta skill se ocupa de que **todo lo demás** (spacing, radios, sombras, breakpoints) también viva en un sistema de tokens, no en números sueltos repartidos por el código.

## Al añadir un valor visual nuevo

1. ¿Ya existe un token que sirve (`spacing.md`, `spacing.lg`, etc.)? → usarlo.
2. ¿El valor es un caso genuinamente único (ej. un ajuste de 1px para alinear un icono)? → puede quedar local, pero documentarlo con un comentario breve del motivo.
3. ¿El valor se repite ya en 3+ sitios sin ser un token? → extraerlo a la configuración de tokens (ver [[refactor-guardian]] para el criterio de "regla de tres").

## Breakpoints

Definir explícitamente los 4 niveles usados en el proyecto (mobile, tablet, desktop, wide desktop — ver [[responsive-ui-reviewer]]) como tokens de configuración, no como media queries con valores repetidos en cada archivo.

## Checklist

- [ ] ¿Hay valores de spacing/radio/sombra que no coinciden con ningún token existente?
- [ ] ¿El mismo valor "mágico" aparece repetido en más de un archivo?
- [ ] ¿Los breakpoints usados coinciden con los tokens definidos, o hay un `768px` suelto que debería ser el token `tablet`?
