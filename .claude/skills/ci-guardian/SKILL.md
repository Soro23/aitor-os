---
name: ci-guardian
description: Define y vigila el pipeline de integración continua de Aitor OS (install, lint, typecheck, tests, build, seguridad). Usar SIEMPRE al crear o modificar workflows de CI, o antes de considerar válido un cambio que vaya a mergearse.
---

# Skill: CI Guardian

Un PR no se considera válido si falla cualquiera de estos pasos, en este orden:

```
Install
↓
Lint
↓
Typecheck
↓
Unit Tests
↓
Integration Tests
↓
Build
↓
Security Checks
```

## Detalle por paso (stack real: Next.js + TypeScript + Supabase self-hosted)

1. **Install** — `npm ci` (no `npm install`, para builds reproducibles a partir del lockfile).
2. **Lint** — ESLint sobre el proyecto completo. Sin warnings silenciados con `eslint-disable` salvo justificación.
3. **Typecheck** — `tsc --noEmit`. Bloqueante: cualquier error de tipos rompe el pipeline.
4. **Unit tests** — Vitest, sobre validaciones, helpers, utilidades y reglas de negocio puras.
5. **Integration tests** — Vitest, sobre Server Actions, repositorios y su interacción con la base de datos (contra un Supabase de test, no mocks — ver nota de testing más abajo).
6. **Build** — `next build`. Debe completar sin errores; `output: 'standalone'` debe generar correctamente el bundle para Docker.
7. **Security checks** — `npm audit` (o equivalente) para dependencias, y verificación de que no hay secretos hardcodeados (grep de patrones tipo `SUPABASE_SERVICE_ROLE_KEY`, `sk-`, etc. en el diff).

## Nota sobre mocks

Si el proyecto decide (o ya decidió) no mockear la base de datos en tests de integración, respetar esa decisión — usar una instancia real de Supabase de test en el pipeline, no mocks que puedan divergir del comportamiento real de RLS.

## Esqueleto de referencia (GitHub Actions)

```yaml
name: CI
on:
  pull_request:
  push:
    branches: [main]
jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run test:unit
      - run: npm run test:integration
      - run: npm run build
      - run: npm audit --audit-level=high
```

Adaptar nombres de scripts a los que existan realmente en `package.json` — no inventar scripts que no están definidos.

## Checklist al tocar el pipeline

- [ ] ¿Los 7 pasos están presentes y en este orden?
- [ ] ¿Algún paso está marcado `continue-on-error` sin motivo explícito? → normalmente incorrecto.
- [ ] ¿Los tests de integración usan una base de datos real de test, no un mock que pueda mentir sobre RLS?
- [ ] ¿El build usa exactamente el mismo `next.config.ts` (`output: 'standalone'`) que usará `docker/Dockerfile`? Ver [[coolify-deployment]].
- [ ] ¿Hay algún secreto expuesto en logs del pipeline o en el propio workflow YAML?

Ver también [[aitor-os-deployment]] para dónde encaja este pipeline en el flujo completo de despliegue del proyecto.
