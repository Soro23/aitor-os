---
name: aitor-os-claude-md
description: Crea o actualiza el CLAUDE.md de la raíz de Aitor OS a partir del estado real del repositorio — comandos verificables, arquitectura, límites arquitectónicos, convenciones y piezas reutilizables. Usar SIEMPRE que se pida inicializar, generar o actualizar la documentación del proyecto para Claude Code, o cuando el repositorio cambie de forma sustancial (nuevo stack, nueva estructura, nuevos comandos) y CLAUDE.md quede desactualizado.
---

# Skill: Aitor OS — CLAUDE.md Writer

Genera o actualiza `CLAUDE.md` en la raíz del repositorio (`D:\Code\ClaudeWorkspace\aitor-os\CLAUDE.md`). Es la única skill del proyecto cuyo entregable es ese archivo — el resto de skills documentan reglas de ejecución, esta documenta el mapa de orientación inicial.

## Idioma

Toda la documentación generada va en **castellano**: títulos, explicaciones, notas arquitectónicas, instrucciones. Los nombres técnicos, comandos, rutas, nombres de archivo, identificadores de código y términos que normalmente se usan en inglés se mantienen sin traducir cuando traducirlos reduce la claridad (`Server Actions`, `Server Components`, `repository`, `middleware`, etc.).

## Principio de evidencia (gobierna todo lo demás)

Cada afirmación importante debe poder justificarse con un archivo o código real del repositorio. Si no se puede verificar con suficiente confianza, no se incluye. Ante una contradicción entre documentación existente y código/configuración real, gana el código real. No inventar comandos, arquitectura ni procesos de desarrollo que no estén verificados.

## Relación con las demás skills del proyecto — no duplicar

Aitor OS ya tiene un conjunto de skills dedicadas (`aitor-os-architecture`, `aitor-os-design-system`, `aitor-os-security-rules`, `aitor-os-testing-rules`, `aitor-os-deployment`, `code-boundaries`, `repository-pattern`, etc. — ver [[aitor-os-skill-reviewer]] para el inventario completo) que ya documentan en detalle arquitectura, seguridad, testing y despliegue, con sus propias reglas de mantenimiento y enlaces cruzados.

`CLAUDE.md` **no** repite ese contenido. Su función es distinta: es el mapa de orientación de 30 segundos — cómo arrancar, cómo validar, y un resumen de las decisiones que ninguna instancia nueva debería tener que redescubrir leyendo 59 archivos. Cuando una sección de `CLAUDE.md` empiece a crecer hasta el nivel de detalle de una skill existente, es señal de que se está duplicando: recortar y apuntar a la skill correspondiente por nombre (sin la sintaxis `[[...]]`, que es interna al grafo de skills — en `CLAUDE.md` basta con nombrarla, ej. "ver la skill `rls-security-reviewer`").

## Qué analizar

### 1. Comandos del proyecto

Identificar los comandos reales para trabajar con el repo: desarrollo local, build, lint, typecheck, tests (y ejecutar un único test/archivo), migraciones, seeds, generación de código, Docker, servicios auxiliares, comandos específicos del proyecto.

Fuentes válidas: `package.json` (scripts), `Makefile`, `docker-compose.yml`, `docker/Dockerfile`, configuración de CI/CD (`.github/workflows/`), scripts internos, documentación existente. Si una fuente no existe todavía en el repo (por ejemplo, no hay `package.json` porque el proyecto aún no tiene código), esa sección no se rellena con comandos supuestos — se omite o se marca explícitamente como pendiente hasta que exista.

### 2. Arquitectura de alto nivel

Documentar solo lo que requiere cruzar varios archivos para entenderse: capas principales y sus responsabilidades, flujo de datos, frontend/backend, Server Actions, API routes, repositories, servicios, base de datos, autenticación/autorización, middleware, integraciones externas, gestión de estado, procesamiento asíncrono, infraestructura relevante.

Para Aitor OS en concreto, esto ya está mayormente fijado en `ARCHITECTURE.md` (flujo `UI → Server Actions → Repositories → Supabase`, estructura de carpetas por capa técnica, modelo de datos, RLS) y en `design-concept.md` (lenguaje visual). `CLAUDE.md` resume esto en un párrafo corto y remite a esos documentos y a `aitor-os-architecture`/`aitor-os-design-system` para el detalle — no reproduce sus tablas completas.

Evitar limitarse a listar la estructura de carpetas: el objetivo es explicar cómo funciona el sistema.

### 3. Límites arquitectónicos y cajas negras

Identificar qué módulos/capas actúan como frontera: qué responsabilidades pertenecen a cada uno, qué código debe consumir una interfaz en vez de acceder a implementaciones internas, qué debe tratarse como caja negra, qué lógica ya está centralizada y no debe duplicarse, qué capas no deben saltarse, qué abstracciones deben reutilizarse.

En Aitor OS esto corresponde a lo que ya vigilan `code-boundaries`, `repository-pattern`, `module-boundary-enforcer` y `public-api-enforcer`. `CLAUDE.md` incluye la regla en una frase (ej. "los componentes nunca acceden a Supabase directamente, todo pasa por `server/repositories/*`") y remite a esas skills para el detalle — no reescribe su checklist.

Solo documentar reglas que se deduzcan claramente del código/configuración existente, no de la intención declarada en un documento de concepto si el código aún no la refleja.

### 4. Convenciones específicas del proyecto

Detectar convenciones reales (no genéricas): dónde se crean features nuevas, organización de módulos, patrones de acceso a datos, patrones de componentes, manejo de errores, imports/aliases, naming, uso de Server/Client Components, forma habitual de añadir una ruta o endpoint. Sin buenas prácticas genéricas de programación.

### 5. Reutilización

Detectar componentes, utilidades, hooks, servicios, layouts, estilos o abstracciones claramente diseñados para reutilizarse, y listar las piezas importantes a comprobar antes de crear algo nuevo — sin convertirlo en un catálogo completo. En Aitor OS, el inventario de componentes visuales vive en `aitor-os-component-library`; `CLAUDE.md` menciona que existe y remite ahí en vez de duplicar la tabla.

### 6. Documentación existente — revisar antes de escribir

Revisar como mínimo, si existen: `README.md`, `CONTRIBUTING.md`, `.cursor/rules/`, `.cursorrules`, `.github/copilot-instructions.md`, `/docs`, configuración de CI/CD, archivos de arquitectura, documentación técnica relevante.

En este repositorio concreto, revisar explícitamente `ARCHITECTURE.md`, `design-concept.md`, `project-concept.md` y `LICENSE.md` en la raíz — son las fuentes primarias hoy. Incorporar a `CLAUDE.md` únicamente lo útil para operar en el repo, sin copiar documentación completa.

## Si ya existe `CLAUDE.md`

1. Leerlo completo.
2. Compararlo con el estado actual del repositorio.
3. Conservar instrucciones específicas que sigan siendo válidas.
4. Eliminar información obsoleta y duplicados.
5. Corregir comandos que ya no existan.
6. Añadir información arquitectónica relevante que falte.
7. Simplificar secciones innecesariamente largas.
8. Traducir al castellano cualquier documentación explicativa que esté en otro idioma, salvo los términos técnicos que convenga mantener.

No reemplazar ciegamente el archivo completo.

## Reglas de contenido

`CLAUDE.md` debe: estar en castellano, ser conciso, orientarse a futuras instancias de Claude Code, contener solo información específica de este repositorio, priorizar lo difícil de descubrir rápido, explicar decisiones arquitectónicas importantes, mostrar comandos exactos, y permitir empezar a modificar el proyecto sin tener que redescubrir su funcionamiento.

No debe: repetirse a sí mismo ni a las skills existentes, listar cada carpeta o componente, incluir consejos genéricos de programación, incluir recomendaciones no respaldadas por el repo, inventar arquitectura/comandos/procesos, añadir secciones genéricas tipo "Common Development Tasks", "Tips for Development", "Support" salvo que esa información exista realmente en el proyecto, ni incluir instrucciones obvias (proteger secretos, escribir código limpio, buenos mensajes de error).

## Prefijo obligatorio

El archivo debe empezar exactamente así, seguido de la documentación en castellano:

```
# CLAUDE.md

Este archivo proporciona contexto a Claude Code (claude.ai/code) al trabajar con código en este repositorio.
```

## Resultado esperado

Al terminar, `CLAUDE.md` debe permitir a una instancia nueva entender rápidamente: cómo ejecutar el proyecto, cómo validarlo, cómo ejecutar tests, cómo está organizado conceptualmente, cómo fluye la información, qué abstracciones debe reutilizar (remitiendo a las skills correspondientes), y qué límites arquitectónicos debe respetar — sin haber tenido que leer las 59 skills del proyecto ni `ARCHITECTURE.md`/`design-concept.md` completos para arrancar.

## Nota sobre el estado actual del repositorio

A fecha de creación de esta skill, `D:\Code\ClaudeWorkspace\aitor-os` no tiene todavía código de aplicación (`src/`, `package.json`, `docker/`, `supabase/migrations/` no existen aún) — solo `ARCHITECTURE.md`, `design-concept.md`, `project-concept.md` y `LICENSE.md`. Si se ejecuta esta skill en ese estado, la sección de comandos quedará vacía o mínima (nada que inventar) y la sección de arquitectura se apoyará en `ARCHITECTURE.md`/`design-concept.md` como fuente de la arquitectura *planeada*, dejando claro que aún no está implementada. Volver a ejecutar esta skill en cuanto exista `package.json` y código real para completar comandos y convenciones verificadas.
