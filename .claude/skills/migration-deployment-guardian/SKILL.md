---
name: migration-deployment-guardian
description: Impone que las migraciones de Aitor OS se ejecutan explícitamente antes del nuevo contenedor, nunca en su arranque. Usar SIEMPRE al tocar cualquier script de despliegue, entrypoint de Docker, o workflow de CI/CD relacionado con migraciones.
---

# Skill: Migration Deployment Guardian

Regla dura (ya fijada en `ARCHITECTURE.md` y en [[coolify-deployment]]):

```
Migraciones
ANTES
del nuevo contenedor
```

Nunca ejecutar migraciones automáticamente en el arranque de la app, especialmente con múltiples instancias — crea condiciones de carrera (dos contenedores arrancando a la vez intentan migrar simultáneamente).

## Dónde NO deben estar las migraciones

- `CMD`/`ENTRYPOINT` del Dockerfile (ver [[dockerfile-reviewer]]).
- Un hook de `next start` o similar.
- Cualquier código que se ejecute en cada arranque del proceso Next.js.

## Dónde SÍ deben estar

Como paso explícito y separado del pipeline de despliegue: `supabase migration up` ejecutado una única vez, antes de que Coolify levante el contenedor nuevo, idealmente desde CI/CD contra la base de datos de producción con las credenciales adecuadas.

## Checklist

- [ ] ¿El Dockerfile o el `CMD` del contenedor ejecutan alguna migración? → debe ser no.
- [ ] ¿El workflow de despliegue tiene un paso explícito y separado de "aplicar migraciones" antes del paso de "desplegar contenedor nuevo"?
- [ ] ¿Qué pasa si la migración falla a mitad? ¿El despliegue del contenedor nuevo se detiene, o continúa con un esquema desincronizado? → debe detenerse.
- [ ] ¿La migración es compatible con el código que YA está corriendo, durante la ventana entre "migración aplicada" y "contenedor nuevo desplegado"? (ver [[rollback-planner]] para el caso de columnas nuevas `NOT NULL` sin default, que romperían el contenedor viejo todavía en marcha)

## Caso a vigilar especialmente

Una migración que añade una columna `NOT NULL` sin default rompe el contenedor **viejo** (que todavía no conoce esa columna) si sigue sirviendo tráfico durante la ventana de despliegue. Preferir migraciones compatibles hacia atrás (columna nueva con default, o `NOT NULL` añadido en una migración posterior tras el despliegue del código que la usa).

Ver también [[aitor-os-deployment]] para dónde encaja este paso en el flujo completo de despliegue del proyecto.
