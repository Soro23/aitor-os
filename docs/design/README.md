# Exploración de dirección visual — Aitor OS

Este directorio documenta el proceso de exploración de una dirección visual alternativa a la definida originalmente en `design-concept.md` (HUD/cyberpunk), realizado con la skill `/design`. El resultado final es la dirección **Anime Interface**, extendida a las 10 secciones del sitio.

> Nota: nada de este directorio es código de producción. Son especificaciones de diseño y mockups estáticos (HTML/CSS autocontenidos) pensados para guiar una futura implementación real en `src/`. No sustituyen a `design-concept.md` — lo complementan como una dirección visual explorada y, en última instancia, elegida por encima de la original.

## Dirección elegida: Anime Interface

Sistema con dos modos (claro/oscuro) construido alrededor de: panel con barra lateral de color de 26px con etiqueta de texto rotada 90° (identifica el dominio de contenido — `PROJECT`, `GARDEN`, `LAB`...), líneas de velocidad diagonales como acento decorativo, un "ping" de radar (círculos concéntricos SVG) como indicador de actividad, y una franja de telemetría (`LAT · LON · UPTIME · STATUS`) al pie de los paneles principales.

- **Especificación completa de color, tipografía y componentes**: [`guia-anime-interface.md`](./guia-anime-interface.md)
- **Modo claro (A1 — Sakura Circuit)**: rosa `#ff4d94` + teal apagado `#0091a3`, fondo `#fbeef2` — modo elegido y extendido a las 10 secciones completas del sitio.
- **Modo oscuro (A2 — Neon District)**: magenta `#ff2ea8` + cian eléctrico `#2ef6ff`, fondo `#0a0713` — mismo sistema, sin construir aún sobre las 10 secciones.

## Otras direcciones exploradas

| Dirección | Modo(s) | Resumen |
|---|---|---|
| **Anime Interface** ✅ elegida | claro (A1) / oscuro (A2) | Ver arriba. |
| **Glass HUD** | oscuro (V1) / claro (V1L2 — Sunlit Visor) | HUD táctico con paneles de cristal esmerilado real (`backdrop-filter`), ping de radar, franja de telemetría. Ver `guia-anime-interface.md`, sección V1/V1L2. |

Descartadas por el camino, sin guardar: steampunk (D2/L1), mecha Evangelion (F3), gaming HUD hexagonal (G1-G3), mecha genérico (M1-M3).

## Mockups del sitio completo

Los 12 archivos `.dc.html` (`Main`, `SobreMi`, `Proyectos`, `ProyectoDetalle`, `Garden`, `GardenNota`, `Dashboard`, `Now`, `Lab`, `Stack`, `Recursos`, `Contacto`) con el sistema Anime Interface (modo claro) ya aplicado a las 10 secciones + las 2 páginas de detalle, viven en [`mockups/`](./mockups/) — mismo patrón de contenido y ejemplos que usa el resto del sitio ya implementado en `src/app/(public)/`, solo con el nuevo lenguaje visual.

## Sheet de componentes

Los 10 componentes oficiales listados en `CLAUDE.md` (`Panel`, `ClipCard`, `StatusBadge`, `ProgressBar`, `PulseIndicator` de `src/components/ui/`; `DataTable`, `PublishToggle`, `FeaturedToggle`, `ToggleSwitch`, `MarkdownEditor` de `src/components/admin/`), reconstruidos en Anime Interface con la misma anatomía y comportamiento que los reales (los toggles son botones con borde/texto que cambia de color según el estado, no un slider — igual que en el código fuente), más 26 componentes genéricos de UI kit (Button, Input, Dropdown/Select, Checkbox, Radio button, Modal/Dialog, Tooltip, Tabs, Accordion, Pagination, Breadcrumb, Navbar, Sidebar, Spinner, Avatar, Alert/Banner, Toast, Slider, Date picker, File uploader, Search bar, Stepper, Skeleton loader, Divider, Tag, Popover) sin equivalente aún en el código — 36 en total, todos derivados del mismo sistema de tokens. Viven en [`mockups/components/`](./mockups/components/).

## Estado: adoptada en código real

Anime Interface ya no es solo una exploración — está adoptada como la fuente de verdad del proyecto:

1. ✅ `design-concept.md` reescrito con la paleta y el lenguaje visual de Anime Interface (el HUD/cyberpunk original queda documentado como historial al inicio del archivo).
2. ✅ `src/styles/tokens.css` actualizado — `--color-accent-cyan`/`--color-accent-violet` ahora resuelven a rosa/teal (se conservan esos nombres por compatibilidad con el código existente; `--color-accent-primary`/`--color-accent-secondary` son los alias nuevos), fondo claro, `--clip-corner: 0` para las esquinas rectas.
3. ✅ 26 componentes genéricos de UI kit creados en `src/components/ui/` (`Button`, `Input`, `Select`, `Checkbox`, `RadioGroup`, `SearchBar`, `Modal`, `Tooltip`, `Popover`, `Alert`, `Toast`, `Tabs`, `Accordion`, `Pagination`, `Breadcrumb`, `Navbar`, `Sidebar`, `Spinner`, `Avatar`, `Slider`, `Stepper`, `SkeletonLoader`, `Divider`, `Tag`, `FileUploader`, `DatePicker`) — `typecheck` y `lint` en verde.
4. ⬜ Pendiente: `Panel`/`ClipCard`/`StatusBadge`/`ProgressBar`/`PulseIndicator` originales heredan el nuevo color automáticamente (mismos nombres de token), pero conservan su estructura previa — la barra lateral con etiqueta rotada y la franja de telemetría de los mockups son piezas visuales nuevas sin trasladar aún a esos componentes. Sin tests añadidos para los 26 componentes nuevos — pendiente si se decide darles cobertura (`unit-test-writer`).
