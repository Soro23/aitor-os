# Aitor OS — Web Personal

## Concepto general

La web sería una mezcla de **marca personal + espacio de conocimiento + centro de actividad**.

La idea es que no funcione como un simple portfolio estático, sino como una web viva que represente:

- Quién eres.
- Qué sabes hacer.
- Qué estás aprendiendo.
- En qué estás trabajando.
- Qué proyectos has desarrollado.
- Cómo evoluciona tu conocimiento con el tiempo.

El concepto general puede plantearse como una especie de **sistema operativo personal público**.

---

# 1. Inicio

La portada debe explicar en pocos segundos quién eres y qué haces.

## Contenido

- Nombre.
- Frase corta de presentación.
- Especialidades principales.
- Tecnologías o áreas en las que trabajas.
- 2-3 proyectos destacados.
- Acceso rápido al Digital Garden.
- Acceso al Dashboard.
- GitHub.
- LinkedIn.
- Contacto.

## Elementos dinámicos

También puede mostrar información que vaya cambiando:

- Proyecto actual.
- Última nota publicada.
- Tecnología que estás aprendiendo.
- Actividad reciente.
- Último experimento publicado.

## Ejemplo de presentación

> Técnico informático y desarrollador centrado en sistemas, automatización, desarrollo e inteligencia artificial.

La portada debe actuar como resumen del resto de la web.

---

# 2. Sobre mí

Esta sección explica mejor tu perfil sin convertirse en un CV tradicional.

## Contenido

- Quién eres.
- Qué haces actualmente.
- Cómo empezaste en informática.
- Áreas que más te interesan.
- Qué estás aprendiendo.
- Qué tipo de problemas te gusta resolver.
- Tu forma de trabajar.
- Objetivos profesionales.

## Línea temporal

También puede incluir una pequeña línea temporal con tu evolución profesional.

```text
2024
Empiezo a profundizar en sistemas

2025
Active Directory / Windows Server

2026
Desarrollo + IA + automatización
```

La idea es mostrar evolución, no únicamente experiencia acumulada.

---

# 3. Proyectos

Será una de las partes más importantes de la web.

Cada proyecto debería tener su propia página.

## Ejemplo de URLs

```text
/proyectos/trading-platform
/proyectos/bob-ai
/proyectos/homelab
```

## Cada proyecto podría incluir

- Nombre.
- Descripción.
- Problema que querías resolver.
- Solución planteada.
- Tecnologías utilizadas.
- Arquitectura.
- Capturas de pantalla.
- Estado actual.
- GitHub.
- Demo.
- Qué aprendiste.
- Problemas encontrados.
- Próximos pasos.

## Estados posibles

- Idea.
- En desarrollo.
- Beta.
- Finalizado.
- Pausado.

No es necesario mostrar únicamente proyectos terminados. También resulta interesante enseñar proyectos en construcción.

---

# 4. Digital Garden

El Digital Garden sería tu **base de conocimiento pública**.

A diferencia de un blog tradicional, no necesitas publicar únicamente artículos largos y terminados.

Puedes publicar:

- Notas.
- Ideas.
- Documentación.
- Aprendizajes.
- Soluciones a problemas.
- Fragmentos de conocimiento.
- Experimentos.

## Organización posible

```text
Garden

Sistemas
 ├── Active Directory
 ├── Windows Server
 ├── GPO
 └── Redes

Desarrollo
 ├── JavaScript
 ├── TypeScript
 ├── React
 └── PHP

IA
 ├── Agentes
 ├── RAG
 ├── Prompts
 └── Automatización

Ideas
 ├── Proyectos
 ├── Experimentos
 └── Conceptos
```

## Cada nota podría incluir

- Título.
- Categoría.
- Estado.
- Fecha de creación.
- Última actualización.
- Contenido.
- Ejemplos.
- Comandos.
- Problemas habituales.
- Referencias.
- Notas relacionadas.

---

# 5. Estados de las notas

Una característica interesante del Digital Garden es mostrar que el conocimiento evoluciona.

## Seed

Idea o nota inicial.

## Growing

Contenido que estás desarrollando y mejorando.

## Evergreen

Contenido que consideras suficientemente completo y útil a largo plazo.

## Ejemplo

```text
Active Directory
Growing

TypeScript Patterns
Evergreen

Ideas para agentes IA
Seed
```

Esto permite publicar contenido sin necesidad de que esté completamente terminado.

---

# 6. Dashboard

El Dashboard sería una representación visual de lo que estás haciendo actualmente.

Funcionaría como tu centro de actividad personal.

## Actualmente

```text
Currently building
Trading Platform

Currently learning
Docker

Currently exploring
AI Agents
```

## Proyectos activos

Cada proyecto puede mostrarse mediante tarjetas con:

- Nombre.
- Estado.
- Progreso.
- Última actualización.
- Tecnologías.
- Enlace al proyecto.

Ejemplo:

```text
Trading Platform
████████░░ 80%

AI E-commerce
██████░░░░ 60%
```

---

# 7. GitHub

El Dashboard puede integrar actividad de GitHub.

## Información interesante

- Commits recientes.
- Repositorios.
- Lenguajes utilizados.
- Proyecto más activo.
- Contribuciones.
- Últimos repositorios actualizados.

## Ejemplo

```text
GitHub Activity

23 commits this month

Most active repository
trading-platform

Main languages

TypeScript  45%
JavaScript  30%
PHP         15%
Other       10%
```

Esto sirve para mostrar actividad técnica real.

---

# 8. Stack tecnológico

Sección visual con las herramientas y tecnologías que utilizas.

Es mejor dividirlas por categorías en lugar de mostrar únicamente una nube de logos.

## Desarrollo

- JavaScript.
- TypeScript.
- React.
- React Native.
- PHP.

## Sistemas

- Windows Server.
- Active Directory.
- GPO.
- PowerShell.
- Networking.

## Infraestructura

- Docker.
- Linux.
- Git.
- GitHub.

## Inteligencia Artificial

- LLM.
- APIs.
- RAG.
- Agentes.
- Automatización.

## Nivel de uso

En lugar de porcentajes arbitrarios, usar estados como:

```text
Uso diario
Uso frecuente
Aprendiendo
Explorando
```

---

# 9. Now

Crear una página específica:

```text
/now
```

Su objetivo es explicar brevemente qué estás haciendo actualmente.

## Ejemplo

### Trabajando en

- Plataforma de trading.
- Proyecto IA para e-commerce.

### Aprendiendo

- Docker.
- Arquitectura backend.
- Agentes IA.

### Explorando

- SaaS.
- Automatización.
- Sistemas distribuidos.

Puede actualizarse periódicamente.

---

# 10. Lab / Experimentos

Crear una sección:

```text
/lab
```

Aquí puedes publicar pequeñas pruebas que no necesitan convertirse en proyectos completos.

## Posibles contenidos

- Bots.
- Scripts.
- Interfaces.
- Experimentos con IA.
- APIs.
- Automatizaciones.
- Visualizaciones.
- Prototipos.

## Ejemplo

```text
LAB #014

Generador de documentación con IA

TypeScript + OpenAI API

Status: Experiment
```

Esta sección sirve para mostrar curiosidad técnica y experimentación.

---

# 11. Recursos

Dentro del Garden puede existir una sección específica:

```text
/resources
```

## Contenido

- Herramientas que utilizas.
- Librerías.
- Extensiones.
- Cursos.
- Libros.
- Repositorios interesantes.
- Documentación.
- Prompts.
- Snippets.
- Recursos técnicos.

Puede convertirse en tu propia biblioteca personal de referencias.

---

# 12. Contacto

Sección sencilla y directa.

## Contenido

- Email.
- LinkedIn.
- GitHub.
- Formulario de contacto.

También puedes indicar el tipo de proyectos que te interesan.

```text
Interested in

Development
AI projects
Automation
Infrastructure
Interesting technical projects
```

---

# Estructura general

```text
/
├── Inicio
├── Sobre mí
├── Proyectos
│   └── Proyecto individual
├── Garden
│   ├── Sistemas
│   ├── Desarrollo
│   ├── IA
│   └── Ideas
├── Dashboard
├── Now
├── Lab
├── Recursos
└── Contacto
```

---

# Filosofía de la web

La web no debería sentirse como:

```text
CV + Blog + GitHub
```

Debería sentirse como:

```text
AITOR
│
├── Identity
├── Work
├── Knowledge
├── Experiments
└── Activity
```

La web debe permitir conocer tres cosas principales:

## Lo que has hecho

→ Proyectos.

## Lo que sabes

→ Digital Garden.

## Lo que estás haciendo ahora

→ Dashboard.

La combinación de estas tres partes convierte la web en una plataforma personal viva, mucho más completa que un portfolio tradicional.
