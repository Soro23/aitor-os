---
name: dockerfile-reviewer
description: Revisa línea a línea docker/Dockerfile de Aitor OS — capas, caché, dependencias, seguridad, tamaño, runtime. Usar SIEMPRE al modificar docker/Dockerfile directamente.
---

# Skill: Dockerfile Reviewer

Revisión concreta de `docker/Dockerfile`, aplicando la estrategia definida en [[docker-architect]].

## Checklist línea a línea

- [ ] **Orden de capas**: ¿`COPY package*.json` + `RUN npm ci` ocurre antes de `COPY . .`? Si no, cualquier cambio de código invalida la caché de dependencias innecesariamente.
- [ ] **`.dockerignore`**: ¿existe y excluye `node_modules`, `.git`, `.env*`, `.next` local, archivos de test? Sin esto, el contexto de build es más lento y puede filtrar archivos sensibles.
- [ ] **Stage `runner` mínimo**: ¿copia solo `.next/standalone`, `.next/static`, `public/`, y lo estrictamente necesario del stage `builder`? Nada de `node_modules` completo ni `src/`.
- [ ] **Usuario no root**: ¿hay un `USER` explícito antes del `CMD`/`ENTRYPOINT` final?
- [ ] **`EXPOSE`**: ¿el puerto declarado coincide con el que realmente escucha Next.js en el stage runner y con lo configurado en Coolify?
- [ ] **`CMD`/`ENTRYPOINT`**: ¿arranca `server.js` del output standalone directamente (`node server.js`), sin pasos intermedios innecesarios (no `npm start` que añade una capa de proceso extra sin motivo)?
- [ ] **Sin secretos hardcodeados**: ningún `ENV SUPABASE_SERVICE_ROLE_KEY=...` con valor real en el Dockerfile (ver [[environment-secrets-guardian]]).
- [ ] **Sin migraciones en el `CMD`**: el arranque del contenedor no ejecuta `supabase migration up` — eso es un paso de despliegue separado y explícito (ver [[migration-deployment-guardian]] y [[coolify-deployment]]).

## Errores comunes a bloquear

- `COPY . .` antes de instalar dependencias (rompe caché).
- Imagen final basada en el stage `builder` completo en vez de un `runner` reducido.
- Falta de `.dockerignore`, copiando `.git` o `.env` al contexto de build.
- `CMD` que ejecuta un script que también corre migraciones — condición de carrera con múltiples instancias.

Ver también [[aitor-os-deployment]] para dónde encaja el Dockerfile en el flujo completo de despliegue del proyecto.
