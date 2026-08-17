---
name: dependency-guardian
description: Controla dependencias externas y acoplamiento entre partes del proyecto en Aitor OS. Usar SIEMPRE antes de añadir una librería nueva al package.json, o cuando dos módulos empiecen a depender fuertemente el uno del otro.
---

# Skill: Dependency Guardian

## Antes de instalar una librería nueva

1. ¿El problema se resuelve con pocas líneas usando lo que ya está en el stack (Next.js, TypeScript, Supabase JS, zod)? → no instalar nada.
2. ¿La librería es mantenida activamente y suficientemente popular como para confiar en ella a largo plazo en un proyecto self-hosted de una sola persona? → si no, buscar alternativa.
3. ¿Ya hay una librería en el proyecto que resuelve un problema equivalente? → reutilizar, no añadir una segunda para lo mismo (ej. dos librerías de validación, dos librerías de fechas).
4. ¿Aporta valor real frente a reinventar una función pequeña? → si el "reinventar" son 10 líneas simples, preferirlo a una dependencia nueva.

## Acoplamiento entre partes del proyecto

- Evitar que `server/repositories/projects.ts` importe cosas de `server/repositories/garden-notes.ts` salvo relación de datos real y documentada (ej. `garden_note_relations`).
- Evitar que un componente de `components/admin/` conozca detalles internos de una entidad concreta si puede recibirlos por props genéricas (ej. `DataTable` no debe saber qué es un "proyecto").
- Detectar dependencias circulares: si el módulo A importa de B y B importa de A, es una señal de que falta extraer algo común a `lib/`.

## Al revisar package.json

- [ ] ¿Cada dependencia nueva tiene un uso real en el código, no quedó de una prueba?
- [ ] ¿Hay dependencias duplicadas conceptualmente (dos libs para lo mismo)?
- [ ] ¿Las dependencias de producción y de desarrollo están correctamente separadas (`dependencies` vs `devDependencies`)?
- [ ] ¿Alguna dependencia nueva mantiene actualizado el resto del árbol o introduce conflictos de versión?

Mantener dependencias actualizadas es responsabilidad continua, no solo al añadir una — pero no forma parte del ámbito de esta skill decidir cuándo actualizar todo el árbol (eso es tarea explícita, no automática).
