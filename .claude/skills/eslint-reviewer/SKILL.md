---
name: eslint-reviewer
description: Comprueba errores y warnings de ESLint en Aitor OS — imports, código muerto, variables sin usar, hooks incorrectos. Usar SIEMPRE antes de considerar terminado un cambio, como paso previo al pipeline de CI.
---

# Skill: ESLint Reviewer

Paso equivalente al `Lint` del pipeline (ver [[ci-guardian]]), pero ejecutado como revisión activa, no solo esperando a que CI lo bloquee.

## Qué comprobar

- **Imports**: sin imports sin usar, sin imports circulares, orden consistente (si el proyecto tiene una regla de orden configurada).
- **Código muerto**: funciones, componentes o variables exportadas que ya no se usan en ningún sitio.
- **Variables sin usar**: parámetros de función, destructuring, catch bindings sin usar (`catch (e)` cuando `e` nunca se lee — usar `catch` sin binding si el proyecto lo permite, o `catch (_e)` si hace falta capturarlo).
- **Hooks de React incorrectos**: dependencias de `useEffect`/`useMemo`/`useCallback` incompletas o inventadas, hooks llamados condicionalmente, hooks fuera del nivel superior del componente.
- **Reglas propias de Server Actions/Server Components de Next.js**: `"use server"`/`"use client"` en el sitio correcto, sin mezclar código de servidor en un módulo marcado `"use client"`.

## Regla de proyecto sobre warnings

No silenciar un warning con `// eslint-disable-next-line` sin un comentario que explique por qué el warning no aplica en ese caso concreto. Un `eslint-disable` sin justificación es casi siempre un bug escondido, no una excepción legítima.

## Checklist

- [ ] ¿`npm run lint` pasa sin errores?
- [ ] ¿Hay algún `eslint-disable` nuevo sin comentario justificativo?
- [ ] ¿Algún hook de React tiene un array de dependencias sospechoso (vacío cuando debería tener algo, o con algo que cambia cada render)?
- [ ] ¿Queda código muerto tras un refactor (funciones que ya nadie llama)?
