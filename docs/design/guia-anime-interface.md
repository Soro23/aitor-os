# Guía de estilo — Glass HUD / Anime Interface

Especificación de las dos familias de dirección visual exploradas y guardadas: el par **V1 / V1L2 — Glass HUD**, y el par **A1 / A2 — Anime Interface** (elegida como dirección final — ver [`README.md`](./README.md)).

---

## V1 / V1L2 — Glass HUD

HUD táctico de visor nocturno con paneles de cristal esmerilado real (`backdrop-filter`). Sistema con dos modos confirmados: **V1** (oscuro, verde) y **V1L2 — Sunlit Visor** (claro, ámbar), su modo claro elegido entre las 3 variantes exploradas.

### Color

| Token | V1 — oscuro | V1L2 — claro | Uso |
|---|---|---|---|
| `--bg` | `#070a07` | `#f6f1e8` | Fondo base de la página |
| `--bg-panel` | `rgba(20,38,20,.4)` | `rgba(255,252,246,.6)` | Panel — translúcido, deja ver la textura de detrás |
| `--bg-panel-2` | `rgba(12,24,12,.5)` | `rgba(240,230,212,.65)` | Panel, segundo tono del degradado |
| texto principal | `#d4f5d6` | `#241c10` (ink) | Texto principal |
| texto secundario | `#7fa07f` | `#7a6c50` | Texto secundario / metadatos |
| `--line` | `rgba(77,255,122,.22)` | `rgba(150,100,20,.2)` | Bordes, divisores de telemetría |
| **acento único** | `#4dff7a` (verde) | `#c2661a` (ámbar) | Identidad — un solo acento en cada modo, sin par fijo entre ellos |
| `--amber` | `#ffb020` | `#c2661a` | Semántico: atención (coincide con el acento en claro) |
| `--red` | `#ff4d4d` | `#c23a3a` | Semántico: alerta |
| `--green` | — | `#1a8f5f` | Semántico: éxito |

**Patrón de adaptación oscuro→claro**: a diferencia de A1/A2 (que comparten familia de acento entre modos), V1/V1L2 cambian de familia por completo — verde visor nocturno en oscuro, ámbar luz de día en claro — porque la metáfora cambia con la luz (un visor nocturno real vira a ámbar bajo el sol). El fondo pasa de negro casi puro a un blanco cálido (nunca blanco frío), y el `backdrop-filter` se mantiene idéntico en fuerza (`blur(14px) saturate(1.2)`) en ambos modos — es lo que sostiene la identidad "de cristal" al margen del color.

### Tipografía

Idéntica en ambos modos:

- **Base (`body`)**: `JetBrains Mono` — todo el "chrome" de interfaz (labels, telemetría, nav) hereda directamente de aquí.
- **Lectura (`.tagline`, `.cardTitle`)**: `Inter` — se aplica explícitamente donde el texto es contenido, no dato de sistema.
- Etiquetas HUD (`.hud`): mayúsculas, `letter-spacing: .12em`.

### Layout y componentes

Misma construcción en V1 y V1L2, solo cambia el color que toma cada pieza (verde en oscuro, ámbar en claro):

- **Frame de cristal** (`.panel`): fondo `--bg-panel` semitransparente + `backdrop-filter: blur(14px) saturate(1.2)` (en V1L2, `saturate(1.25)`); el patrón de rejilla triangular del fondo se ve a través. Header y footer usan un blur más suave (`10px`).
- **Sheen**: capa `::before`-like (`.sheen`) — franja diagonal `linear-gradient(115deg, transparent, acento a baja opacidad, transparent)` rotada 8°, simula el reflejo de un panel de vidrio real. En oscuro el streak es blanco tenue; en claro se tiñe del propio acento (un streak blanco no se vería sobre fondo claro).
- **Esquinas tick**: brackets en L de 14×14px en el color de acento — más discretas que una cruz completa.
- **Ping de radar**: SVG — punto central sólido + 2 círculos concéntricos a opacidad decreciente (`.6`, `.3`).
- **Franja de telemetría**: fila de datos (`LAT · LON · UPTIME · STATUS`) al pie de cada panel, separada por líneas verticales `--line`, valor en negrita color de acento.
- **Fondo**: rejilla triangular (3× `repeating-linear-gradient` a 0°/60°/120°) a muy baja opacidad + 2 radiales de color en las esquinas.

### Efectos

- Barrido de escáner (solo V1 oscuro): banda horizontal `rgba(77,255,122,.07)` que recorre toda la pantalla en `5s linear infinite`. En V1L2 se omite — sobre fondo claro leería como un parpadeo sucio en vez de un barrido de escáner.
- Parpadeo de estado (`.blink`): `steps(1)`, no easing — lectura tipo indicador digital, no pulso orgánico. Igual en ambos modos.

---

## A1 / A2 — Anime Interface (dirección elegida)

Un mismo sistema con dos modos. La identidad (barra lateral de color con texto rotado, líneas de velocidad, ping de radar, franja de telemetría) es idéntica en ambos; lo que cambia es la paleta y la intensidad del brillo. **A1 (claro)** es el modo extendido a las 10 secciones completas del sitio — ver `mockups/`.

### Color

| Token | A1 — claro | A2 — oscuro | Uso |
|---|---|---|---|
| `--bg` | `#fbeef2` | `#0a0713` | Fondo de página |
| `--bg-panel` | `#ffffff` | `#130d24` | Panel |
| `--bg-panel-2` | `#fff5f7` | `#0d081a` | Panel, tono secundario |
| texto principal | `#1c1420` (ink) | `#f2e9ff` | Texto principal |
| texto secundario | `#8a7280` | `#8a7ab0` | Metadatos |
| `--line` | `#f0d3dc` | `#2c1f4d` | Bordes, divisores |
| **acento primario** | `#ff4d94` (rosa) | `#ff2ea8` (magenta) | Identidad — igual familia de color en ambos modos |
| **acento secundario** | `#0091a3` (teal apagado) | `#2ef6ff` (cian eléctrico) | Sube de saturación y brillo en oscuro |
| `--amber` | `#d98a12` | `#ffb020` | Semántico: atención |
| `--red` | `#d43a4f` | `#ff4d4d` | Semántico: alerta |
| `--green` | `#1a9e6b` | `#4dffa8` | Semántico: éxito |

**Patrón de adaptación claro→oscuro**: el rosa se mantiene como ancla de identidad en ambos modos (solo sube de vibración: `#ff4d94`→`#ff2ea8`); el acento secundario es el que más cambia — de un teal apagado y editorial en claro a un cian de neón saturado en oscuro. Los tonos semánticos (ámbar/rojo/verde) simplemente ganan luminosidad y saturación al pasar a oscuro, sin cambiar de familia. En oscuro se añade `text-shadow`/glow en título, marca y puntos de pulso; en claro esos mismos elementos van sin sombra de color, apoyados solo en el contraste del trazo.

### Tipografía

- **Base (`body`)**: `JetBrains Mono`.
- **Lectura (`.tagline`, `.cardTitle`)**: `Inter`, peso `800` en `.cardTitle` — más contundente que en V1.
- Igual en ambos modos — la tipografía no es lo que diferencia claro de oscuro aquí, solo el color.

### Layout y componentes

- **Barra lateral** (`.sideBar`): franja vertical de 26px a la izquierda del panel, degradado `linear-gradient(180deg, acento-primario, acento-secundario)` — **siempre en ese orden** (rosa arriba, teal/cian abajo) en todas las páginas, sin excepción por sección; con una etiqueta de texto rotada 90° (`writing-mode: vertical-rl`), siempre en inglés y mayúsculas, identificando el dominio de contenido: `SYSTEM ONLINE` (Inicio), `IDENTITY` (Sobre mí), `PROJECT`, `GARDEN`, `LAB`, `ACTIVITY` (Dashboard), `WORKING` / `LEARNING` / `EXPLORING` (Now), `RESOURCE`, `CONTACT`.
- **Panel sin barra lateral** (`.plainPanel`): para secciones de contenido repetido dentro de una misma página (Problema/Solución/Arquitectura en el detalle de proyecto, Contenido/Ejemplos/Comandos en una nota del Garden, categorías del Stack) — fondo blanco, borde `--line`, franja superior de 3px con el degradado rosa→teal en vez de la barra lateral completa. Evita repetir la barra lateral en paneles apilados.
- **Líneas de velocidad** (`.speedlines`): franja diagonal repetida (`repeating-linear-gradient` a -18°), recortada en triángulo en la esquina superior derecha del panel hero — el único elemento puramente decorativo/dinámico del sistema, reservado al panel principal de cada página, no a las tarjetas de listado.
- **Ping de radar**: igual construcción que en V1 (círculos concéntricos + punto), coloreado con el acento primario.
- **Franja de telemetría**: igual patrón que V1 (LAT/LON/UPTIME/STATUS), pero desplazada para dejar sitio a la barra lateral — el primer valor lleva `padding-left` extra. Reservada a paneles con sentido de "estado del sistema" (Inicio, Dashboard) — no aparece en páginas de contenido puro (Sobre mí, Garden, Contacto).
- **Cabecera**: borde inferior de 2px en el acento secundario + una segunda franja de 30% de ancho en el acento primario superpuesta — asimetría intencional, no una línea única centrada.
- **Badge de estado** (`.status`): chip con borde `--line` y texto de color semántico — `amber` (en progreso), `green` (completado/finalizado), `red` (pausado/alerta), `teal` (idea/exploración), `gray` (archivado/inactivo — usa `--ink-secondary`, no un color de alerta).

---

**Nota de uso**: Anime Interface (A1) es la dirección elegida y ya está construida sobre las 10 secciones completas del sitio + 2 páginas de detalle (ver `mockups/`). Glass HUD (V1/V1L2) y el resto de direcciones en `README.md` quedan documentadas como referencia/alternativa, con los componentes de cabecera/pie/panel hero/tarjeta ya resueltos por si se retoman más adelante.
