---
name: build-validator
description: Garantiza que npm run build funciona en Aitor OS antes de desplegar. Usar SIEMPRE tras cambios significativos, antes de dar una tarea por terminada o de proponer un despliegue.
---

# Skill: Build Validator

`next build` debe completar sin errores antes de considerar cualquier cambio terminado. Es el último filtro antes de [[coolify-deployment]] — ver [[aitor-os-deployment]] para el flujo completo de despliegue del proyecto.

## Qué comprobar

- [ ] `npm run build` termina con código de salida 0, sin errores de compilación ni de tipos.
- [ ] `output: 'standalone'` en `next.config.ts` sigue generando correctamente `.next/standalone` — el Dockerfile depende de esto (ver [[dockerfile-reviewer]]).
- [ ] No hay warnings de build ignorados que en realidad apunten a un problema real (ej. imports dinámicos mal resueltos, variables de entorno no definidas en build time).
- [ ] Las Server Actions y rutas nuevas se listan correctamente en el resumen de build de Next.js (tamaño de bundle razonable, sin rutas marcadas como error).
- [ ] El build no depende de variables de entorno que solo existen en local y faltan en el pipeline de CI/Coolify — si el build falla solo "en producción", casi siempre es esto.

## Diferencia con `ci-guardian`

[[ci-guardian]] define el build como uno de los 7 pasos del pipeline; esta skill es la que efectivamente valida que ese paso concreto pasa y diagnostica por qué si falla.

## Si el build falla

1. Leer el error completo, no asumir la causa.
2. Comprobar si es un error de tipos (→ [[typescript-strict]]), de import roto, o de variable de entorno faltante.
3. No "arreglar" ocultando el error (ej. `// @ts-ignore`) sin resolver la causa real.
