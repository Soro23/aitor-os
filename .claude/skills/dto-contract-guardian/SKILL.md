---
name: dto-contract-guardian
description: Vigila que los datos que cruzan capas en Aitor OS usen contratos claros (DTO), diferenciando entre Database Types, DTO, Form Input y Public View Model. Usar SIEMPRE al definir qué datos devuelve un repositorio o recibe una Server Action.
---

# Skill: DTO Contract Guardian

## Los cuatro tipos de contrato a distinguir

```
Database Types    → tal cual sale de Supabase/Postgres (columnas reales, snake_case)
DTO                → forma que cruza servidor → cliente (types/dto/), solo lo necesario
Form Input         → forma que envía un formulario admin, validada con zod
Public View Model  → forma final que consume una página pública, puede ser un subconjunto del DTO
```

No enviar objetos de base de datos completos a la UI si no es necesario. Ejemplo: `projects` puede tener columnas internas de auditoría o borrador que no deben llegar nunca al Public View Model de la página pública, aunque sí puedan aparecer en el DTO usado por el admin.

## Reglas

- Un repositorio devuelve datos ya mapeados a DTO (`types/dto/project.ts`), no el resultado crudo de Supabase con nombres `snake_case` filtrándose a componentes en `camelCase`-land.
- Una Server Action recibe Form Input (validado con zod en `lib/validation/`), nunca el tipo de base de datos directamente como input.
- Una página pública consume Public View Model, no el DTO admin completo — si un campo solo tiene sentido en el panel admin (ej. notas internas), no debe estar en lo que ve la página pública.

## Checklist

- [ ] ¿El repositorio devuelve el tipo de base de datos crudo en vez de un DTO mapeado?
- [ ] ¿Una página pública recibe más datos de los que realmente muestra (filtración de campos internos)?
- [ ] ¿El Form Input de un formulario admin coincide con el esquema zod usado en la Server Action, o hay dos definiciones que pueden divergir?
- [ ] ¿Hay tipos duplicados que deberían ser el mismo DTO reutilizado? (ver [[dependency-guardian]] para el criterio de no duplicar)
