---
name: conventional-commits
description: Convención de mensajes de commit para Aitor OS (feat, fix, refactor, chore, docs, test, ci, perf). Usar SIEMPRE al escribir un mensaje de commit.
---

# Skill: Conventional Commits

Formato:

```
feat:
fix:
refactor:
chore:
docs:
test:
ci:
perf:
```

Con scope opcional cuando aclara: `feat(projects): add project publishing toggle`.

## Reglas del proyecto (ver CLAUDE.md)

- Un commit = un cambio lógico. No mezclar un `fix` y un `feat` no relacionado en el mismo commit.
- Evitar mensajes genéricos como "update" o "fix things" — el mensaje debe decir qué cambió y, si no es obvio, por qué.
- No incluir referencias a herramientas de IA en el mensaje — el commit debe leerse como si lo hubiera escrito el propio desarrollador.
- Formato del cuerpo (si hace falta): línea de resumen corta (≤ 50 caracteres aprox.), línea en blanco, cuerpo explicando el "por qué" cuando no sea obvio del diff.

## Ejemplos correctos

```
feat(garden): add relation between garden notes
fix(auth): require admin check in updateProject action
refactor(repositories): extract shared publish/feature filtering
chore: bump next to 15.x
docs: document RLS policy pattern in ARCHITECTURE.md
test(projects): cover reject-without-admin case in server action
ci: add integration test step to pipeline
perf(dashboard): avoid duplicate supabase query on load
```

## Checklist antes de commitear

- [ ] ¿El tipo (`feat`/`fix`/...) refleja realmente la naturaleza del cambio?
- [ ] ¿El commit contiene un único cambio lógico?
- [ ] ¿El mensaje sería entendible por alguien sin el contexto de esta conversación?
