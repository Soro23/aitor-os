---
name: design-system-guardian
description: Vigila activamente que colores, espaciados, tipografía, bordes, radios, sombras, estados y animaciones respeten el design system de Aitor OS. Usar SIEMPRE al revisar CSS/JSX ya escrito, como paso de validación posterior a aitor-os-design-system.
---

# Skill: Design System Guardian

Complementa a [[aitor-os-design-system]] (que documenta el lenguaje visual) con el rol de detectarlo cuando se viola, en revisión.

## Qué escanear en un diff con estilos

- Valores hex fuera de la paleta documentada (`#05060A`, `#0B0E17`, `#1C2333`, `#E8ECF4`, `#8A93A8`, `#00F0FF`, `#B84DFF`, `#39FF88`, `#FFB020`, `#FF3D5A`).
- `border-radius` en vez de `clip-path` en tarjetas/paneles principales.
- Texto de lectura larga en un color neón directo.
- Más de un acento neón dominante en el mismo bloque visual.
- Animaciones `infinite`/en bucle fuera de indicadores de pulso explícitamente diseñados para ello.
- Tipografía sans usada en "chrome" de interfaz (labels de sistema) o mono usada en párrafos largos de lectura — están intercambiadas.
- Spacing con números "mágicos" (`13px`, `17px`) en vez de una escala consistente (ver [[design-token-manager]] para el criterio de cuándo un valor debe ser token).

## Estados semánticos

Comprobar que el mapeo estado → color sigue siendo el documentado: verde (`#39FF88`) activo/completado, ámbar (`#FFB020`) en progreso/atención, rojo (`#FF3D5A`) pausado/alerta/error. Un componente que usa rojo para "en progreso" o verde para "error" es un bug de UX, no solo de estilo.

## Salida esperada al encontrar una violación

Señalar el valor exacto encontrado, el valor de la paleta que debería usarse en su lugar, y el archivo/línea. No aprobar un cambio visual con valores fuera de paleta sin que el usuario lo confirme explícitamente como excepción.
