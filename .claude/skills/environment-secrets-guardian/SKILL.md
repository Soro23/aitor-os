---
name: environment-secrets-guardian
description: Evita que secretos de Aitor OS (SUPABASE_SERVICE_ROLE_KEY, GITHUB_TOKEN) se filtren a frontend, logs, Git o la imagen Docker. Usar SIEMPRE al tocar variables de entorno, código que las lee, o antes de un commit que toque configuración.
---

# Skill: Environment Secrets Guardian

## Variables del proyecto y su alcance (ver [[coolify-deployment]])

| Variable | Alcance permitido |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Pública — puede estar en el bundle de cliente |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Pública — respeta RLS, diseñada para exponerse |
| `SUPABASE_SERVICE_ROLE_KEY` | **Nunca** pública, nunca `NEXT_PUBLIC_*`, solo en scripts de administración server-side |
| `GITHUB_TOKEN` | Server-side únicamente, para el proxy `/api/github` |

## Nunca debe aparecer en

```
frontend (bundle de cliente)
logs
Git (commits, historial)
Docker image (capas intermedias con el valor hardcodeado)
NEXT_PUBLIC_*
```

## Checklist antes de un commit o PR

- [ ] ¿Algún `.env` con valores reales está en el diff? (debe estar en `.gitignore`, solo `.env.example` con placeholders se versiona)
- [ ] ¿`SUPABASE_SERVICE_ROLE_KEY` o `GITHUB_TOKEN` aparecen hardcodeados en algún archivo fuente, test, o script?
- [ ] ¿Algún `console.log` imprime el valor de una variable de entorno sensible, aunque sea "temporalmente para debug"?
- [ ] ¿El Dockerfile usa `ARG`/`ENV` de forma que el secreto quede grabado en una capa de la imagen final en vez de inyectarse en runtime?
- [ ] ¿Un error no controlado podría filtrar una variable de entorno en su mensaje o stack trace hacia el cliente? (ver gestión de errores del proyecto — no exponer errores internos al cliente)

## Si un secreto se filtró

Rotar la clave inmediatamente (regenerar `SUPABASE_SERVICE_ROLE_KEY` o el token de GitHub) — no basta con eliminar el commit, porque puede seguir en el historial de Git o en logs ya emitidos. Señalar esto explícitamente al usuario si se detecta, no arreglarlo en silencio.
