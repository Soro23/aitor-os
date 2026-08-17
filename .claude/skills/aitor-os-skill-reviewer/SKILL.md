---
name: aitor-os-skill-reviewer
description: Supervisa el conjunto completo de skills de Aitor OS — coherencia, cohesión, enlaces sin huérfanos, claridad de explicación, reglas que no se contradicen, y vigencia frente a cambios de arquitectura/diseño en ARCHITECTURE.md y design-concept.md. Usar SIEMPRE al añadir, eliminar o modificar sustancialmente una skill, y periódicamente cuando ARCHITECTURE.md o design-concept.md cambien.
---

# Skill: Aitor OS — Skill Reviewer

Meta-skill: no revisa código de la aplicación, revisa las propias skills en `.claude/skills/`. Es la única skill del proyecto cuyo objeto de trabajo son las demás skills.

## Cuándo se dispara

1. Se ha añadido, borrado o cambiado sustancialmente una skill.
2. `ARCHITECTURE.md` o `design-concept.md` han cambiado (nueva decisión de arquitectura, nuevo componente, paleta modificada, etc.) — esas dos fuentes son la verdad de la que dependen casi todas las skills de este proyecto.
3. El usuario pide explícitamente "revisa las skills" o equivalente.
4. Tras una ampliación grande del conjunto de skills (como al crear este mismo conjunto).

## Inventario de referencia (mantener actualizado — 60 skills)

```
Arquitectura:  aitor-os-architecture, architecture-guardian, code-boundaries,
               dependency-guardian, module-boundary-enforcer, refactor-guardian

Frontend:      aitor-os-design-system, component-reuse-enforcer, ui-component-architect,
               design-system-guardian, design-token-manager, visual-consistency-reviewer,
               responsive-ui-reviewer, accessibility-reviewer

Backend:       repository-pattern, server-action-pattern, dto-contract-guardian,
               public-api-enforcer, feature-isolation

Database:      rls-security-reviewer, supabase-architect, database-migration-reviewer,
               postgres-schema-reviewer, auth-security-reviewer, environment-secrets-guardian

Testing:       unit-test-writer, integration-test-writer, e2e-test-writer,
               repository-test-writer, server-action-test-writer, regression-test-guardian

Quality:       typescript-strict, code-reviewer, eslint-reviewer, test-coverage-reviewer

DevOps:        ci-guardian, build-validator, docker-architect, dockerfile-reviewer,
               deployment-guardian, coolify-deployment, production-readiness,
               healthcheck-validator, migration-deployment-guardian, rollback-planner

Git:           git-workflow, conventional-commits, pull-request-reviewer,
               branch-strategy, release-manager, changelog-generator

Aitor OS:      aitor-os-feature-generator, aitor-os-crud-generator, aitor-os-security-rules,
               aitor-os-testing-rules, aitor-os-code-review, aitor-os-deployment,
               aitor-os-component-library, aitor-os-claude-md, aitor-os-skill-reviewer (esta misma)
```

Si al auditar aparece una skill en `.claude/skills/` que no está en esta lista, o falta una que sí está aquí pero ya no existe en disco, actualizar esta lista en la misma tarea — es el primer síntoma de que el inventario se ha desincronizado.

## Proceso de auditoría

### 1. Barrido de inventario

Listar todas las carpetas bajo `.claude/skills/` (Glob `**/SKILL.md`) y compararlas contra el inventario de arriba. Divergencias = hallazgo inmediato.

### 2. Coherencia de frontmatter

Para cada `SKILL.md`:
- [ ] `name` en el frontmatter coincide exactamente con el nombre de la carpeta.
- [ ] `description` explica *cuándo* usar la skill (no solo qué es), en una frase accionable — si dice solo "gestiona X" sin un disparador ("usar cuando...", "usar al..."), está incompleta.
- [ ] La descripción no es tan genérica que se solape sin distinción con otra skill (ej. dos skills que dicen literalmente "revisa la calidad del código" sin diferenciar ámbito).

### 3. Grafo de enlaces — sin huérfanos

Cada skill enlaza a otras con `[[nombre]]`. Construir mentalmente el grafo:
- [ ] Todo `[[nombre]]` referenciado corresponde a una skill que existe de verdad en el inventario (no un nombre inventado o renombrado).
- [ ] Toda skill es alcanzable desde al menos un punto de entrada natural — o bien está enlazada desde otra skill, o bien es ella misma un punto de entrada obvio para una tarea concreta (ej. `dockerfile-reviewer` se alcanza desde `docker-architect` y desde `aitor-os-deployment`). Una skill sin ningún enlace entrante Y sin una razón clara de descubrimiento por descripción es una skill huérfana — señalarla.
- [ ] Las skills "índice" (`aitor-os-security-rules`, `aitor-os-testing-rules`, `aitor-os-deployment`, `aitor-os-code-review`) referencian de verdad a las skills específicas de su dominio, sin dejar ninguna fuera por olvido.

### 4. Contradicciones de reglas

Comparar reglas que tratan el mismo tema en skills distintas:
- [ ] ¿Dos skills dan una regla distinta para el mismo caso (ej. una dice "usa el cliente admin para X" y otra dice "el cliente admin nunca en request pública" sin que quede claro cuál aplica cuándo)?
- [ ] ¿Una skill general (`code-reviewer`) contradice a una específica del proyecto (`aitor-os-code-review`) en vez de complementarla?
- [ ] ¿Los checklists de skills solapadas (ej. `deployment-guardian` vs `aitor-os-deployment`) listan los mismos pasos en órdenes distintos?

### 5. Duplicación de contenido sin valor añadido

- [ ] ¿Una skill repite párrafos completos de otra en vez de enlazarla con `[[nombre]]`? Repetir contenido es la primera causa de que quede desactualizado en un solo sitio y no en el otro.
- [ ] Si dos skills cubren exactamente lo mismo sin diferencia de ámbito, señalar candidata a fusión — no fusionar sin confirmar con el usuario.

### 6. Vigencia frente a `ARCHITECTURE.md` y `design-concept.md`

Estas dos fuentes gobiernan la mayoría del contenido técnico y visual de las skills. Ante cualquier cambio en ellas:
- [ ] ¿Cambió la paleta de colores, tipografía o algún componente del design system? → revisar `aitor-os-design-system`, `design-system-guardian`, `design-token-manager`, `aitor-os-component-library`.
- [ ] ¿Cambió la estructura de carpetas o el flujo de capas? → revisar `aitor-os-architecture`, `code-boundaries`, `architecture-guardian`, `module-boundary-enforcer`.
- [ ] ¿Cambió el modelo de datos (tablas, columnas, patrón `is_published`/`is_featured`) o el modelo de permisos? → revisar `rls-security-reviewer`, `postgres-schema-reviewer`, `aitor-os-security-rules`, `repository-pattern`.
- [ ] ¿Cambió la infraestructura de despliegue (Coolify, Docker, Supabase self-hosted)? → revisar `coolify-deployment`, `docker-architect`, `dockerfile-reviewer`, `aitor-os-deployment`.
- [ ] Un valor concreto citado en una skill (un hex, un nombre de tabla, una ruta de carpeta) que ya no coincide con la fuente de verdad es un hallazgo bloqueante, no una nota menor — las skills existen para dar reglas exactas, no aproximadas.

## Formato de salida de la auditoría

Para cada hallazgo: skill afectada, tipo (huérfana / contradicción / duplicación / desactualizada / descripción poco clara), qué está mal exactamente, y la corrección concreta propuesta. Agrupar por severidad:

1. **Bloqueante**: contradice `ARCHITECTURE.md`/`design-concept.md`, o dos skills se contradicen entre sí de forma que seguir una rompe la otra.
2. **Importante**: skill huérfana, enlace roto a una skill que no existe, información desactualizada.
3. **Menor**: duplicación de contenido, descripción mejorable, formato inconsistente.

No corregir las skills automáticamente sin mostrar antes el listado de hallazgos — el usuario decide qué se cambia, esta skill audita y propone, no reescribe en silencio.
