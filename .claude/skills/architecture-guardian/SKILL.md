---
name: architecture-guardian
description: Vigila que se respeta la arquitectura general de Aitor OS (UI → Server Actions → Repositories → Supabase) y evalúa cualquier propuesta de nueva estructura antes de introducirla. Usar SIEMPRE que se proponga un patrón, carpeta o dependencia que no encaje claramente en la arquitectura ya documentada.
---

# Skill: Architecture Guardian

Complementa a [[aitor-os-architecture]] (que documenta la arquitectura) con el rol de vigilarla activamente cuando algo la pone en riesgo.

## Qué vigilar

- Lógica de negocio filtrándose en componentes en vez de vivir en repositorios/server actions.
- Acceso directo a Supabase desde UI (ver [[code-boundaries]]).
- Nuevas "capas" o "servicios" propuestos sin que el patrón se repita ya varias veces (ver [[refactor-guardian]] para el criterio de cuándo abstraer).
- Estructuras de carpetas alternativas (`features/`, `modules/`, `domains/`) que contradicen la organización por capa técnica ya establecida.
- Dependencias entre capas no adyacentes (UI importando directamente de `server/repositories/`).

## Antes de aceptar una estructura nueva

1. ¿Ya existe un lugar natural para esto en `server/actions`, `server/repositories`, `lib/`, `types/dto`, `components/ui`, `components/admin`? → usarlo.
2. ¿La propuesta añade una capa/carpeta nueva? → exigir una razón concreta (no "por si acaso"), y si se acepta, documentarla en `ARCHITECTURE.md` en el mismo cambio.
3. ¿La propuesta rompe el flujo `UI → Server Actions → Repositories → Supabase`? → rechazar salvo justificación explícita del usuario.

## Señal de alerta explícita

Si una tarea pide "vamos a organizar esto por feature en vez de por capa", detenerse y preguntar antes de proceder — es un cambio de arquitectura, no un detalle de implementación, y ARCHITECTURE.md ya fijó la decisión contraria.
