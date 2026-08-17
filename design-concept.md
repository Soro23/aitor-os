# Aitor OS — Design Concept: Cyberpunk / HUD Dashboard

## Concepto general

La web se comporta como el panel de control de un sistema en vivo: un HUD futurista de nave o consola de operaciones, no un portfolio decorado con neón. El **Dashboard** deja de ser "una sección más" y se convierte en la pieza central de la identidad visual — todas las secciones comparten el mismo lenguaje de telemetría, estados y monitorización.

Esta línea encaja de forma natural con el eje del perfil (sistemas, automatización, IA): la web no solo *habla* de esos temas, se *siente* como uno de esos sistemas.

## Principios de diseño

1. **Legibilidad primero.** El neón es acento, nunca base. Ningún bloque de texto largo se escribe en color saturado sobre fondo oscuro sin verificar contraste.
2. **Un acento dominante por sección.** Evitar que cian, magenta y ámbar compitan en la misma vista. Cada sección tiene un color líder; el resto aparece solo en estados semánticos puntuales.
3. **Densidad con jerarquía.** El HUD puede mostrar mucha información (estados, métricas, logs) pero siempre agrupada y con una jerarquía tipográfica clara — nunca ruido plano.
4. **Coherencia de sistema.** Los mismos componentes (bordes cortados, indicadores de estado, barras de progreso) se reutilizan en todas las secciones para reforzar la sensación de "un único sistema", no páginas independientes.

---

## Paleta de colores

### Base
| Uso | Color | Hex |
|---|---|---|
| Fondo principal | Negro azulado | `#05060A` |
| Fondo secundario (paneles) | Gris azulado oscuro | `#0B0E17` |
| Bordes / divisores | Gris azulado tenue | `#1C2333` |
| Texto principal | Blanco casi puro | `#E8ECF4` |
| Texto secundario | Gris claro | `#8A93A8` |

### Acentos neón (uso selectivo, nunca simultáneo en bloque)
| Acento | Hex | Uso principal |
|---|---|---|
| Cian | `#00F0FF` | Acento primario del sistema (títulos de HUD, líneas de conexión, foco) |
| Violeta/Magenta | `#B84DFF` | Acento secundario (Digital Garden, elementos de conocimiento/IA) |
| Verde neón | `#39FF88` | Estado "activo / completado / online" |
| Ámbar | `#FFB020` | Estado "en progreso / atención" |
| Rojo/Magenta intenso | `#FF3D5A` | Estado "pausado / alerta / error" |

### Nota de accesibilidad
- El texto de lectura larga (notas del Garden, descripciones de proyecto) se escribe siempre en `#E8ECF4` sobre `#05060A`/`#0B0E17` (contraste AA holgado), nunca directamente en color neón.
- El neón se reserva para: bordes, iconos, etiquetas cortas en mayúsculas, indicadores de estado y elementos gráficos (barras, líneas). Antes de aplicar un color neón a texto, verificar contraste ≥ 4.5:1 sobre el fondo real donde se use.

---

## Tipografía

- **Datos y "chrome" de interfaz** (etiquetas de sistema, métricas, estados, navegación): tipografía monoespaciada técnica — `JetBrains Mono` o `Space Mono`. Uso en mayúsculas con letter-spacing amplio para etiquetas tipo `STATUS`, `UPTIME`, `MODULE_03`.
- **Contenido de lectura** (Garden, "Sobre mí", descripciones de proyecto): tipografía sans neutra de alta legibilidad — `Inter` o similar. El HUD no debe invadir el texto largo.
- **Titulares:** tamaño generoso, peso alto, en la sans principal o en la mono según el contexto (portada/Dashboard → mono; Garden/Sobre mí → sans).

---

## Lenguaje visual / componentes recurrentes

- **Bordes cortados:** `clip-path` con esquinas en diagonal en vez de `border-radius`, en tarjetas y paneles principales.
- **Conectores tipo circuito:** líneas finas (1px, color de borde o acento tenue) que unen bloques relacionados, reforzando la idea de sistema interconectado.
- **Scanline/glitch sutil:** solo en transiciones u hover, nunca como animación permanente — evita fatiga visual.
- **Barras y medidores con glow:** barras de progreso con relleno animado y resplandor suave en el acento correspondiente al estado.
- **Indicadores de pulso/radar:** puntos o iconos con animación de pulso para señalar actividad en vivo (último commit, proyecto activo, "now").

---

## Aplicación por sección

Mapeo directo sobre la estructura ya definida en `project-concept.md`:

- **Inicio:** secuencia de "boot" breve al cargar (nombre, especialidades como datos de arranque); accesos rápidos presentados como "módulos" del sistema (`[ GARDEN ]`, `[ DASHBOARD ]`, `[ GITHUB ]`).
- **Sobre mí:** timeline profesional como log de sistema — cada año como una entrada con marca de tiempo, en mono, con el contenido descriptivo en sans.
- **Proyectos:** cada proyecto es una "ficha de sistema": estado (Idea/En desarrollo/Beta/Finalizado/Pausado) mapeado a los colores semánticos de la paleta; página individual con estructura tipo panel técnico.
- **Digital Garden:** acento violeta como color líder. Estados Seed/Growing/Evergreen representados por intensidad de señal (glow débil → glow fuerte) en vez de metáfora de planta.
- **Dashboard:** panel central del sitio. Tarjetas de proyectos activos con barras de progreso HUD; actividad de GitHub como "log de telemetría" en mono.
- **Now:** se integra como "procesos en ejecución" — lista de procesos activos con indicador de pulso.
- **Lab:** "experimentos en sandbox", numerados (`LAB #014`) como ya sugiere el documento original, con estado tipo badge.
- **Stack tecnológico:** niveles de uso (Uso diario/frecuente/Aprendiendo/Explorando) representados como barras tipo ecualizador o niveles de señal, agrupados por categoría (Desarrollo, Sistemas, Infraestructura, IA).
- **Contacto:** panel simple tipo "canal de comunicación abierto", coherente con el resto pero sin sobrecargar — es la sección donde el HUD debe ser más discreto.

---

## Riesgos y mitigación

| Riesgo | Mitigación |
|---|---|
| Sobrecarga visual por exceso de neón | Fondo oscuro neutro como base dominante; un único acento líder por sección |
| Pérdida de contraste/accesibilidad | Texto largo siempre en blanco/gris claro; neón restringido a acentos y verificado a ≥ 4.5:1 |
| Fatiga por animaciones (glitch/scanline) | Reservadas a hover/transición, nunca en bucle permanente |
| Contenido largo (Garden) sintiéndose "frío" o difícil de leer | Tipografía sans estándar fuera del "chrome" de HUD, el mono queda solo para metadatos |
