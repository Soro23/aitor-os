---
name: unit-test-writer
description: Escribe tests unitarios de Aitor OS con Vitest para lógica aislada — validaciones zod, helpers, transformaciones, reglas de negocio puras. Usar SIEMPRE al añadir una función pura nueva en lib/ o un esquema de validación nuevo.
---

# Skill: Unit Test Writer

Alcance: funciones sin dependencias externas (sin Supabase, sin Next.js) — esquemas zod, helpers de `lib/`, cálculos, mapeos DTO. Ver [[aitor-os-testing-rules]] para el mapa completo de qué skill de testing usar según el tipo de cambio.

## Qué priorizar

- Esquemas de validación en `lib/validation/`: casos válidos, casos inválidos (campo faltante, tipo incorrecto, valor fuera de rango), y casos límite (string vacío vs ausente, número negativo donde no debería, enum fuera del set permitido).
- Helpers de mapeo (ej. Database Type → DTO, ver [[dto-contract-guardian]]): que el mapeo preserve los campos esperados y descarte los que no deben cruzar a la UI.
- Reglas de negocio puras (ej. cálculo de `sort_order` por defecto, lógica de qué estados son válidos para transición en `lab_experiments`).

## Qué NO testear aquí

- Nada que toque Supabase real → eso es [[integration-test-writer]] o [[repository-test-writer]].
- Nada que toque una Server Action completa → eso es [[server-action-test-writer]].
- Detalles internos de implementación que no son comportamiento observable (ej. no testear que una función interna se llama con tal argumento exacto si el resultado final ya lo verifica).

## Forma de referencia (Vitest)

```ts
import { describe, expect, it } from "vitest";
import { createProjectSchema } from "@/lib/validation/project";

describe("createProjectSchema", () => {
  it("acepta un proyecto válido", () => {
    expect(createProjectSchema.safeParse(validInput).success).toBe(true);
  });

  it("rechaza un proyecto sin nombre", () => {
    const result = createProjectSchema.safeParse({ ...validInput, name: "" });
    expect(result.success).toBe(false);
  });
});
```

## Checklist

- [ ] ¿Cada esquema zod nuevo tiene al menos un caso válido y uno inválido por campo obligatorio?
- [ ] ¿Los tests describen comportamiento (qué debe pasar), no implementación interna?
- [ ] ¿Los nombres de test son legibles como frase ("rechaza X cuando Y")?
