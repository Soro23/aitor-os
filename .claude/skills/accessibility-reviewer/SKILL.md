---
name: accessibility-reviewer
description: Comprueba accesibilidad en Aitor OS — navegación por teclado, labels, contraste, estados focus, HTML semántico, ARIA, formularios. Usar SIEMPRE al terminar cualquier componente interactivo o formulario nuevo.
---

# Skill: Accessibility Reviewer

Riesgo particular en Aitor OS: la estética HUD/cyberpunk usa mucho color neón sobre fondo oscuro, lo que hace fácil romper contraste sin darse cuenta (ver también [[aitor-os-design-system]], que ya fija la regla de contraste ≥ 4.5:1 para texto).

## Checklist

- [ ] **Navegación por teclado**: ¿todo elemento interactivo (botones, toggles, links, items de `DataTable`) es alcanzable con Tab y activable con Enter/Space?
- [ ] **Labels**: ¿todo input de formulario (login admin, editores de contenido, formulario de contacto) tiene un `<label>` asociado, no solo un placeholder?
- [ ] **Contraste**: ¿algún texto usa un acento neón directo sobre fondo oscuro sin verificar el ratio 4.5:1? Los acentos son para bordes/iconos/badges, no para párrafos.
- [ ] **Estados focus**: ¿hay un `focus-visible` claramente distinguible en todos los elementos interactivos, coherente con el lenguaje visual (glow del acento, no el outline azul por defecto del navegador sin adaptar)?
- [ ] **HTML semántico**: ¿se usan `<button>`, `<nav>`, `<main>`, `<table>` reales en vez de `<div onClick>` genéricos?
- [ ] **ARIA**: solo donde el HTML semántico no basta (ej. `PulseIndicator` como elemento puramente decorativo debería llevar `aria-hidden`; un `StatusBadge` que solo se distingue por color necesita también texto, no solo color).
- [ ] **Formularios**: ¿los errores de validación (zod) se comunican de forma accesible (`aria-describedby`, no solo un cambio de color de borde)?

## Caso específico: estados por color

El sistema usa color para indicar estado (verde/ámbar/rojo, ver [[aitor-os-design-system]]). Un usuario con daltonismo no debe depender solo del color — `StatusBadge` debe llevar también texto o icono, no ser un punto de color aislado.
