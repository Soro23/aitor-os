---
name: ui-component-architect
description: Define cómo deben construirse los componentes reutilizables de Aitor OS — composición, props pequeñas, variants, interfaces simples. Usar SIEMPRE al diseñar la API de un componente nuevo (props, variants, composición), después de confirmar con component-reuse-enforcer que hace falta crearlo.
---

# Skill: UI Component Architect

Se usa después de [[component-reuse-enforcer]] haya confirmado que un componente nuevo es necesario. Esta skill decide *cómo* construirlo bien.

## Principios

- **Composición sobre configuración excesiva.** Preferir `<Panel><Panel.Header /><Panel.Body /></Panel>` a un componente con 15 props booleanas que activan/desactivan partes.
- **Props pequeñas y con propósito claro.** Si un componente necesita más de ~6-7 props, es señal de que debería dividirse o componerse.
- **Variants explícitas, no booleanos combinables sin sentido.** `variant="danger" | "success" | "warning"` en vez de `isDanger`, `isSuccess`, `isWarning` que permiten combinaciones inválidas.
- **Componentes desacoplados de una entidad concreta.** `DataTable` no debe saber qué es un "proyecto" — recibe columnas y datos genéricos. `StatusBadge` no debe tener un `if (tipo === 'proyecto')` interno.
- **Interfaz simple primero.** Empezar con las props mínimas que resuelven el caso de uso actual; añadir más solo cuando aparece un segundo caso de uso real.

## Forma esperada de un componente base

```tsx
type StatusBadgeProps = {
  status: "idea" | "in-progress" | "beta" | "done" | "paused";
  className?: string;
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  // mapea status → color semántico de aitor-os-design-system, no colores hardcodeados
}
```

## Checklist antes de dar por bueno un componente nuevo

- [ ] ¿Sus props son genéricas o están atadas a una entidad concreta sin necesidad?
- [ ] ¿Usa variants en vez de combinaciones de booleanos?
- [ ] ¿Sigue la paleta/tipografía de [[aitor-os-design-system]] en vez de valores propios?
- [ ] ¿Se puede reutilizar en al menos dos contextos distintos del proyecto, o es innecesariamente específico?
