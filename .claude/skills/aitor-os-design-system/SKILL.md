---
name: aitor-os-design-system
description: Conoce el lenguaje visual HUD/cyberpunk de Aitor OS — paleta, tipografía, componentes oficiales (Panel, ClipCard, StatusBadge, ProgressBar, PulseIndicator, DataTable, PublishToggle, FeaturedToggle, MarkdownEditor) y patrones de bordes cortados. Usar SIEMPRE antes de escribir CSS, JSX con estilos, o cualquier elemento visual nuevo, para no reinventar el lenguaje visual del proyecto.
---

# Skill: Aitor OS — Design System

Fuente de verdad: `design-concept.md` en la raíz del repo.

Antes de escribir cualquier estilo o marcado visual, preguntarse:

1. ¿Existe ya un componente en `src/components/ui/` o `src/components/admin/` que resuelva esto? → usarlo (ver [[component-reuse-enforcer]]).
2. ¿El valor que voy a usar (color, spacing, radio) está en la paleta o es un número inventado? → si es inventado, no usarlo.
3. ¿Esta pantalla necesita "su propio estilo" o puede heredar el lenguaje ya definido? → casi siempre lo segundo.

## Concepto

HUD futurista de sistema en vivo, no un portfolio decorado con neón. El Dashboard es la pieza central de identidad visual; todas las secciones comparten el mismo lenguaje de telemetría, estados y monitorización.

Reglas de principio:
- El neón es acento, nunca base.
- Un único acento dominante por sección — no mezclar cian/violeta/ámbar en el mismo bloque salvo estados semánticos puntuales.
- Densidad con jerarquía tipográfica clara, nunca ruido plano.
- Mismos componentes reutilizados en todas las secciones (bordes cortados, indicadores de estado, barras de progreso).

## Paleta (valores exactos — no aproximar)

Base:
| Uso | Hex |
|---|---|
| Fondo principal | `#05060A` |
| Fondo secundario (paneles) | `#0B0E17` |
| Bordes / divisores | `#1C2333` |
| Texto principal | `#E8ECF4` |
| Texto secundario | `#8A93A8` |

Acentos neón (uso selectivo, nunca simultáneo en bloque):
| Acento | Hex | Uso |
|---|---|---|
| Cian | `#00F0FF` | Primario del sistema — títulos HUD, líneas de conexión, foco |
| Violeta/Magenta | `#B84DFF` | Secundario — Digital Garden, IA/conocimiento |
| Verde neón | `#39FF88` | Estado activo / completado / online |
| Ámbar | `#FFB020` | Estado en progreso / atención |
| Rojo/Magenta intenso | `#FF3D5A` | Estado pausado / alerta / error |

Regla de accesibilidad no negociable: texto de lectura larga siempre en `#E8ECF4` sobre `#05060A`/`#0B0E17`. Nunca texto largo en color neón directo. Antes de aplicar un neón a texto, verificar contraste ≥ 4.5:1 contra el fondo real.

## Tipografía

- Chrome de interfaz (labels de sistema, métricas, estados, navegación): monoespaciada técnica (`JetBrains Mono` / `Space Mono`), mayúsculas, letter-spacing amplio. Ej: `STATUS`, `UPTIME`, `MODULE_03`.
- Contenido de lectura (Garden, Sobre mí, descripciones de proyecto): sans neutra de alta legibilidad (`Inter` o similar). El HUD no invade el texto largo.
- Titulares: portada/Dashboard → mono; Garden/Sobre mí → sans.

## Patrones visuales recurrentes

- Bordes cortados con `clip-path` (esquinas en diagonal) en vez de `border-radius`, en tarjetas y paneles principales.
- Conectores tipo circuito: líneas finas 1px uniendo bloques relacionados.
- Scanline/glitch sutil SOLO en transición u hover — nunca en bucle permanente (fatiga visual).
- Barras/medidores con glow en el acento correspondiente al estado.
- Indicadores de pulso/radar para actividad en vivo (último commit, proyecto activo, "now").

## Mapeo de estado → color (usar siempre estos, no inventar otros)

Estados de proyecto (Idea → En desarrollo → Beta → Finalizado → Pausado) y estados equivalentes en otras colecciones deben mapear a los colores semánticos de la tabla de acentos — nunca a colores fuera de la paleta.

## Componentes oficiales

El inventario completo y actualizado vive en [[aitor-os-component-library]] — es la única fuente de verdad de qué componentes existen. No mantener una segunda copia de esa lista aquí: consultarla antes de crear cualquier elemento visual, y actualizarla en la misma tarea si se crea un componente nuevo.

## Errores a bloquear en revisión

- `margin-top: 17px`, `border-radius: 13px` o cualquier valor de spacing/radio arbitrario no derivado de la paleta/sistema (ver [[design-token-manager]] para cómo deben centralizarse estos valores en tokens).
- Texto largo en color neón sobre fondo oscuro sin verificar contraste.
- Dos o más acentos neón compitiendo en el mismo bloque visual.
- Animación glitch/scanline en bucle permanente.
- Un componente visual nuevo que ya existe con otro nombre.
