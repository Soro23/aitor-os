# Mockups — Anime Interface (modo claro)

Los 12 archivos `.dc.html` de esta carpeta son el sitio completo rediseñado con la dirección **Anime Interface**, un archivo por página:

| Archivo | Sección |
|---|---|
| `Main.dc.html` | Inicio |
| `SobreMi.dc.html` | Sobre mí |
| `Proyectos.dc.html` | Proyectos (listado) |
| `ProyectoDetalle.dc.html` | Proyecto — detalle |
| `Garden.dc.html` | Digital Garden (listado) |
| `GardenNota.dc.html` | Garden — nota individual |
| `Dashboard.dc.html` | Dashboard |
| `Now.dc.html` | Now |
| `Lab.dc.html` | Lab |
| `Stack.dc.html` | Stack tecnológico |
| `Recursos.dc.html` | Recursos |
| `Contacto.dc.html` | Contacto |

**No se abren directamente en el navegador** — cada archivo referencia `./support.js`, un runtime que solo existe cuando se publican dentro del visor de Claude Design (`/design`). Son HTML/CSS real y autocontenido (ver el `<style>` de cada uno para el CSS completo, sin dependencias externas salvo la fuente de Google Fonts), pero pensados como referencia de maquetación para traducir a los componentes reales de `src/components/ui/`, no como páginas standalone.

Para verlos renderizados: la última versión publicada vive en el enlace del canvas de diseño (ver la conversación donde se generaron, o pedir que se vuelva a publicar desde estos mismos archivos con la skill `/design`).
