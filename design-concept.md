# Aitor OS — Design Concept: Anime Interface

> Historial: la dirección original de este documento era un HUD/cyberpunk oscuro (bordes cortados, neón cian/violeta). Tras un proceso de exploración documentado en `docs/design/` (varias direcciones probadas: steampunk, cristal táctico, mecha, gaming HUD hexagonal), se adoptó **Anime Interface** como nueva dirección visual. Ver `docs/design/README.md` para el recorrido completo y `docs/design/guia-anime-interface.md` para la especificación de origen.

## Concepto general

La web se comporta como el panel de control de un sistema en vivo, pero con la energía gráfica de una interfaz de anime/mecha: paneles claros, un color de identidad que recorre cada bloque (barra lateral rosa→teal con etiqueta rotada), líneas de velocidad y un "ping" de radar como firma de actividad. El **Dashboard** sigue siendo la pieza central — todas las secciones comparten el mismo lenguaje de identidad, estado y telemetría.

Esta línea sigue encajando con el eje del perfil (sistemas, automatización, IA): la web no solo *habla* de esos temas, se *siente* como el panel de control de un sistema, ahora con una energía más vívida y menos oscura que la versión HUD original.

## Principios de diseño

1. **Legibilidad primero.** El rosa y el teal son acento, nunca base de texto largo. Ningún bloque de lectura extensa se escribe en color saturado; el contenido va siempre en `--color-text-primary`/`--color-text-secondary`.
2. **Rosa = identidad, teal = conocimiento.** El degradado rosa→teal de la barra lateral es la firma del sistema en cualquier panel principal; el resto de acentos (ámbar/rojo/verde) quedan reservados a estados semánticos puntuales, nunca como color de marca.
3. **Densidad con jerarquía.** Igual que en la versión HUD: mucha información posible, siempre agrupada y con jerarquía tipográfica clara.
4. **Coherencia de sistema.** Los mismos componentes (panel con barra de identidad, badge de estado, barra de progreso, franja de telemetría) se reutilizan en todas las secciones.

---

## Paleta de colores

### Base (claro)
| Uso | Color | Hex |
|---|---|---|
| Fondo principal | Rosa-crema muy claro | `#FBEEF2` |
| Fondo secundario (paneles) | Blanco | `#FFFFFF` |
| Bordes / divisores | Rosa pálido | `#F0D3DC` |
| Texto principal | Casi negro cálido | `#1C1420` |
| Texto secundario | Gris rosado | `#8A7280` |

### Acentos
| Acento | Hex | Uso principal |
|---|---|---|
| Rosa | `#FF4D94` | Acento primario/identidad — barra lateral, marca, foco, botón primario |
| Teal | `#0091A3` | Acento secundario — Digital Garden, extremo inferior de la barra de identidad |
| Verde | `#1A9E6B` | Estado "activo / completado / éxito" |
| Ámbar | `#D98A12` | Estado "en progreso / atención" |
| Rojo | `#D43A4F` | Estado "pausado / alerta / error" |
| Gris (texto secundario) | `#8A7280` | Estado "archivado / inactivo" — nunca un color de alerta |

### Nota de accesibilidad
- El texto de lectura larga (notas del Garden, descripciones de proyecto) se escribe siempre en `#1C1420`/`#8A7280` sobre `#FBEEF2`/`#FFFFFF` (contraste AA holgado), nunca directamente en rosa o teal saturado.
- Los acentos se reservan para: bordes, iconos, etiquetas cortas en mayúsculas, indicadores de estado y elementos gráficos (barras, franjas). Antes de aplicar un acento a texto, verificar contraste ≥ 4.5:1 sobre el fondo real donde se use.

---

## Tipografía

- **Datos y "chrome" de interfaz** (etiquetas de sistema, métricas, estados, navegación): tipografía monoespaciada técnica — `JetBrains Mono` o `Space Mono`. Uso en mayúsculas con letter-spacing amplio para etiquetas tipo `STATUS`, `UPTIME`, `PROJECT`.
- **Contenido de lectura** (Garden, "Sobre mí", descripciones de proyecto): tipografía sans neutra de alta legibilidad — `Inter` o similar.
- **Titulares:** tamaño generoso, peso alto — en sans (`font-weight: 800`) para tarjetas y títulos de contenido, en mono para el nombre/marca y etiquetas de sistema.

---

## Lenguaje visual / componentes recurrentes

- **Esquinas rectas.** Sin `clip-path` ni `border-radius` en paneles y tarjetas — la única excepción deliberada es la forma circular en radio buttons, el punto de estado de un avatar, el pulgar de un slider y el anillo de un spinner.
- **Barra de identidad.** Franja vertical de 26px a la izquierda del panel principal, degradado `rosa → teal`, con una etiqueta de texto rotada 90° (mayúsculas, en inglés) que identifica el dominio de contenido: `PROJECT`, `GARDEN`, `LAB`, `IDENTITY`, `ACTIVITY`...
- **Líneas de velocidad.** Franja diagonal repetida en la esquina superior derecha del panel hero — el único elemento puramente decorativo/dinámico, reservado a paneles principales, nunca a tarjetas de listado.
- **Ping de radar.** SVG de círculos concéntricos + punto central, como indicador de actividad en vivo (equivalente al `PulseIndicator` original, pero también usado como icono decorativo en cabeceras de panel).
- **Franja de telemetría.** Fila de datos (`LAT · LON · UPTIME · STATUS`) al pie de paneles con sentido de "estado del sistema" (Inicio, Dashboard) — no aparece en páginas de contenido puro.
- **Badge de estado.** Chip con borde + texto de color semántico, sin relleno — igual criterio que en la versión HUD, ahora con la paleta rosa/teal/ámbar/rojo/verde/gris.

---

## Aplicación por sección

Mapeo directo sobre la estructura ya definida en `project-concept.md`:

- **Inicio:** panel de identidad con barra lateral `SYSTEM ONLINE`, franja de telemetría, tarjetas destacadas con barra lateral `PROJECT`/`GARDEN`/`LAB`.
- **Sobre mí:** panel de identidad `IDENTITY` + línea temporal como log de sistema — cada año con nodo de color alternando rosa/teal.
- **Proyectos:** cada proyecto es una tarjeta con barra lateral `PROJECT`; estado (Idea/En desarrollo/Beta/Finalizado/Pausado) mapeado a los colores semánticos de la paleta.
- **Digital Garden:** teal como color líder de sección (segundo extremo de la barra de identidad). Estados Seed/Growing/Evergreen representados como badge de estado.
- **Dashboard:** panel central `ACTIVITY` con franja de telemetría; tarjetas de proyectos activos con barra de progreso rosa; actividad de GitHub en un panel plano.
- **Now:** paneles con barra lateral rotulada por categoría (`WORKING`/`LEARNING`/`EXPLORING`).
- **Lab:** tarjetas con barra lateral `LAB`, numeradas (`LAB #014`), badge de estado (Experiment/Working/Archived).
- **Stack tecnológico:** paneles planos por categoría con barras de progreso teal representando el nivel de uso.
- **Contacto:** panel de identidad `CONTACT` con formulario — foco rosa en los campos, botón primario relleno.

---

## Riesgos y mitigación

| Riesgo | Mitigación |
|---|---|
| Rosa/teal compitiendo con los estados semánticos (ámbar/rojo/verde) en la misma vista | El rosa/teal solo aparece en la barra de identidad y elementos de marca; los badges de estado usan exclusivamente los tonos semánticos |
| Pérdida de contraste/accesibilidad en fondo claro | Texto largo siempre en `#1C1420`/`#8A7280`; acentos verificados a ≥ 4.5:1 antes de usarse sobre texto |
| Exceso de decoración (líneas de velocidad, ping) restando seriedad al contenido | Reservados a paneles principales/hero, nunca repetidos en cada tarjeta de un listado |
| Contenido largo (Garden) sintiéndose "genérico" sin la identidad HUD original | La barra de identidad + badge de estado mantienen el lenguaje de "sistema" sin depender del fondo oscuro |
