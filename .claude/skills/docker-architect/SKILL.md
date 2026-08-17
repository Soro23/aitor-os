---
name: docker-architect
description: Responsable del entorno Docker de Aitor OS — multi-stage builds, imagen pequeña, usuario no root, caché eficiente, Next.js standalone. Usar SIEMPRE al diseñar o modificar la estrategia general de containerización, antes de escribir el Dockerfile en sí (ver dockerfile-reviewer para la revisión línea a línea).
---

# Skill: Docker Architect

Complementa a [[dockerfile-reviewer]] (revisión línea a línea) con las decisiones de estrategia general de la imagen.

## Principios

- **Multi-stage build**: al menos tres stages — `deps` (instala dependencias), `builder` (compila con `next build`, `output: 'standalone'`), `runner` (imagen final mínima que solo copia lo necesario de `builder`).
- **Imagen pequeña**: la imagen final no debe contener `node_modules` completo ni el código fuente TypeScript — solo el output `standalone` de Next.js más los assets estáticos y `public/`.
- **Usuario no root**: el stage `runner` crea y usa un usuario sin privilegios (`USER node` o equivalente) para ejecutar la app.
- **Caché eficiente**: copiar `package.json`/`package-lock.json` y correr `npm ci` antes de copiar el resto del código fuente, para que cambios de código no invaliden la capa de dependencias.
- **Variables gestionadas correctamente**: las variables `NEXT_PUBLIC_*` que Next.js necesita en build time se pasan como `ARG`/`ENV` del stage `builder`; los secretos server-only (`SUPABASE_SERVICE_ROLE_KEY`) se inyectan en runtime por Coolify, nunca hardcodeados en el Dockerfile (ver [[environment-secrets-guardian]]).

## Decisión de base image

Usar una imagen Node oficial `-alpine` o `-slim` para runtime, no la imagen completa de desarrollo. Confirmar que la versión de Node coincide con la usada en CI (ver [[ci-guardian]]) para evitar comportamientos distintos entre pipeline y producción.

## Checklist de estrategia

- [ ] ¿Son 3+ stages con propósitos claramente separados?
- [ ] ¿La imagen final excluye devDependencies y código fuente sin compilar?
- [ ] ¿El proceso corre como usuario no root?
- [ ] ¿Los secretos de runtime están ausentes del Dockerfile y de las capas construidas?
- [ ] ¿La versión de Node coincide entre Dockerfile, CI y `package.json` (`engines`)?

Ver también [[aitor-os-deployment]] para dónde encaja el build de Docker en el flujo completo de despliegue del proyecto.
