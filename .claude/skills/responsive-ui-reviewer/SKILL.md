---
name: responsive-ui-reviewer
description: Comprueba el comportamiento responsive de Aitor OS en mobile, tablet, desktop y wide desktop. Usar SIEMPRE al terminar una pantalla o componente visual nuevo, especialmente grids, navegación, tablas, modales, cards y el panel de administración.
---

# Skill: Responsive UI Reviewer

Niveles a comprobar siempre:

```
mobile
tablet
desktop
wide desktop
```

## Zonas de mayor riesgo en Aitor OS

- **Grids de proyectos/garden/lab**: ¿colapsan a 1 columna en mobile sin recortar contenido?
- **Navegación**: ¿el menú principal tiene una versión mobile utilizable (no un menú desktop encogido e inclicable)?
- **Tablas del panel admin (`DataTable`)**: en mobile, ¿la tabla se vuelve inutilizable por scroll horizontal infinito, o hay una adaptación (cards apiladas, columnas prioritarias)?
- **Modales**: ¿ocupan toda la pantalla en mobile en vez de quedar recortados o centrados con overflow?
- **Dashboard**: es la pieza central de identidad visual (ver [[aitor-os-design-system]]) — con más densidad de información, el riesgo de romperse en mobile es mayor. Revisar que las barras HUD y métricas no se solapen.
- **Panel de administración**: usado por un único admin pero debe seguir siendo operable desde mobile en caso de necesidad puntual.

## Checklist

- [ ] ¿Ningún elemento se corta o desborda horizontalmente en mobile (viewport ~375px)?
- [ ] ¿Los touch targets (botones, toggles) tienen tamaño suficiente en mobile, no solo pensados para cursor?
- [ ] ¿El HUD (bordes cortados, conectores) se simplifica en mobile en vez de saturar una pantalla pequeña?
- [ ] ¿Las tablas admin tienen una estrategia explícita para mobile, no solo overflow sin control?
- [ ] ¿Se probó en al menos 3 de los 4 breakpoints antes de dar la tarea por terminada?
