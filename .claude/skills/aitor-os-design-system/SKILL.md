---
name: aitor-os-design-system
description: Conoce el lenguaje visual Anime Interface de Aitor OS — paleta clara/oscura, tipografía, componentes oficiales (Panel, ClipCard, StatusBadge, ProgressBar, PulseIndicator, DataTable, PublishToggle, FeaturedToggle, MarkdownEditor, ThemeToggle) y esquinas rectas. Usar SIEMPRE antes de escribir CSS, JSX con estilos, o cualquier elemento visual nuevo, para no reinventar el lenguaje visual del proyecto.
---

# Skill: Aitor OS — Design System

Fuente de verdad: `design-concept.md` en la raíz del repo.

> Historial: la dirección original de este proyecto era un HUD/cyberpunk oscuro (bordes cortados vía `clip-path`, acentos neón cian/violeta). Se abandonó tras un proceso de exploración — ver `docs/design/` — en favor de **Anime Interface**: paleta clara (rosa+teal), esquinas rectas. Si ves código o documentación que aún describe neón/`clip-path` como el estándar activo, está desactualizado.

Antes de escribir cualquier estilo o marcado visual, preguntarse:

1. ¿Existe ya un componente en `src/components/ui/` o `src/components/admin/` que resuelva esto? → usarlo (ver [[component-reuse-enforcer]]).
2. ¿El valor que voy a usar (color, spacing, radio) está en la paleta o es un número inventado? → si es inventado, no usarlo.
3. ¿Esta pantalla necesita "su propio estilo" o puede heredar el lenguaje ya definido? → casi siempre lo segundo.

## Concepto

Panel de control de un sistema en vivo, pero con la energía gráfica de una interfaz de anime/mecha: paneles claros, un color de identidad (rosa→teal) que recorre cada bloque, líneas de velocidad y un "ping" de radar como firma de actividad. El Dashboard sigue siendo la pieza central de identidad visual; todas las secciones comparten el mismo lenguaje de telemetría, estados y monitorización.

Reglas de principio:
- El rosa y el teal son acento, nunca base de texto largo.
- Rosa = identidad, teal = conocimiento — el resto de acentos (ámbar/rojo/verde) quedan reservados a estados semánticos puntuales, nunca como color de marca.
- Densidad con jerarquía tipográfica clara, nunca ruido plano.
- Mismos componentes reutilizados en todas las secciones (esquinas rectas, indicadores de estado, barras de progreso).

## Paleta (valores exactos — no aproximar)

### Tema claro (por defecto)
| Uso | Hex |
|---|---|
| Fondo principal | `#FBEEF2` |
| Fondo secundario (paneles) | `#FFFFFF` |
| Bordes / divisores | `#F0D3DC` |
| Texto principal | `#1C1420` |
| Texto secundario | `#8A7280` |

### Tema oscuro
Misma identidad, superficies invertidas — activado con la clase `dark` en `<html>` (`next-themes`), sigue `prefers-color-scheme` por defecto, el usuario puede fijar su elección con `ThemeToggle` (persistida en `localStorage`).

| Uso | Hex |
|---|---|
| Fondo principal | `#14101A` |
| Fondo secundario (paneles) | `#1E1826` |
| Fondo terciario (paneles secundarios) | `#241C2E` |
| Bordes / divisores | `#33283C` |
| Texto principal | `#F5EEF1` |
| Texto secundario | `#B9A8B6` |

### Acentos (uso selectivo, iguales en ambos temas — nunca simultáneos en un mismo bloque)
| Acento | Hex | Uso |
|---|---|---|
| Rosa | `#FF4D94` | Primario/identidad — barra lateral, marca, foco, botón primario |
| Teal | `#0091A3` | Secundario — Digital Garden, extremo inferior de la barra de identidad |
| Verde | `#1A9E6B` | Estado activo / completado / éxito |
| Ámbar | `#D98A12` | Estado en progreso / atención |
| Rojo | `#D43A4F` | Estado pausado / alerta / error |

Regla de accesibilidad no negociable: texto de lectura larga siempre en el par texto-principal/texto-secundario del tema activo, nunca directamente en color de acento saturado. Antes de aplicar un acento a texto, verificar contraste ≥ 4.5:1 contra el fondo real (verificado para ambos temas con la paleta de arriba).

Implementación técnica: `src/styles/tokens.css` — solo los 6 tokens de superficie/texto varían por tema (bloque `:root.dark`); acentos, spacing, tipografía y `--glow-*` son iguales en ambos.

## Tipografía

- Chrome de interfaz (labels de sistema, métricas, estados, navegación): monoespaciada técnica (`JetBrains Mono` / `Space Mono`), mayúsculas, letter-spacing amplio. Ej: `STATUS`, `UPTIME`, `MODULE_03`.
- Contenido de lectura (Garden, Sobre mí, descripciones de proyecto): sans neutra de alta legibilidad (`Inter` o similar).
- Titulares: portada/Dashboard → mono; Garden/Sobre mí → sans.

## Patrones visuales recurrentes

- Esquinas rectas — sin `clip-path` ni `border-radius` en paneles y tarjetas; única excepción deliberada: forma circular en radio buttons, punto de estado de avatar, pulgar de slider, anillo de spinner.
- Barra de identidad: franja vertical de 26px a la izquierda del panel principal, degradado rosa→teal, con etiqueta rotada 90°.
- Líneas de velocidad: franja diagonal decorativa en la esquina superior derecha del panel hero — solo en paneles principales, nunca en tarjetas de listado.
- Ping de radar: indicador de actividad en vivo (equivalente a `PulseIndicator`).
- Barras/medidores con glow en el acento correspondiente al estado.

## Mapeo de estado → color (usar siempre estos, no inventar otros)

Estados de proyecto (Idea → En desarrollo → Beta → Finalizado → Pausado) y estados equivalentes en otras colecciones deben mapear a los colores semánticos de la tabla de acentos — nunca a colores fuera de la paleta.

## Componentes oficiales

El inventario completo y actualizado vive en [[aitor-os-component-library]] — es la única fuente de verdad de qué componentes existen. No mantener una segunda copia de esa lista aquí: consultarla antes de crear cualquier elemento visual, y actualizarla en la misma tarea si se crea un componente nuevo.

## Errores a bloquear en revisión

- `margin-top: 17px`, `border-radius: 13px` o cualquier valor de spacing/radio arbitrario no derivado de la paleta/sistema (ver [[design-token-manager]] para cómo deben centralizarse estos valores en tokens).
- Texto largo en color de acento saturado sin verificar contraste, en cualquiera de los dos temas.
- Dos o más acentos compitiendo en el mismo bloque visual fuera de estados semánticos puntuales.
- Un color hardcodeado (`#RRGGBB`) fuera de `tokens.css` — rompe el modo oscuro porque no responde a `:root.dark`.
- Un componente visual nuevo que ya existe con otro nombre.
