---
name: typescript-strict
description: Mantiene TypeScript estricto en Aitor OS — sin any, DTOs bien tipados, Server Actions y repositorios con tipos explícitos, tipos generados de Supabase reutilizados. Usar SIEMPRE al escribir cualquier archivo .ts/.tsx nuevo o al revisar tipos.
---

# Skill: TypeScript Strict

## Reglas

- **Sin `any`.** Si de verdad no hay forma razonable de tipar algo (ej. un payload externo impredecible), usar `unknown` y validar con zod antes de usarlo — nunca `any` como atajo.
- **DTOs, no tipos de base de datos crudos en la UI.** Ver [[dto-contract-guardian]].
- **Server Actions tipadas explícitamente**: parámetros e input validado con zod (`z.infer<typeof schema>`), retorno con un tipo explícito, no inferencia implícita de una unión de errores/éxitos sin nombre.
- **Repositorios tipados**: cada método declara su tipo de retorno explícitamente (el DTO correspondiente), no `Promise<any>` ni inferencia de lo que Supabase devuelve crudo.
- **Tipos generados de Supabase cuando corresponda**: los `Database Types` (ver [[dto-contract-guardian]]) deben generarse desde el esquema real, no escribirse a mano y arriesgarse a que diverjan.
- **No duplicar tipos existentes**: si ya hay un `ProjectDTO` en `types/dto/project.ts`, no crear un tipo estructuralmente idéntico en otro archivo.

## Dónde `any` puede colarse sin que se note

- Callbacks de librerías de terceros mal tipadas.
- `JSON.parse()` sin tipar el resultado.
- Props de componentes con `...rest: any`.
- Catch de errores (`catch (e: any)`) — usar `catch (e: unknown)` y comprobar el tipo antes de usar `e.message`.

## Checklist

- [ ] ¿Aparece `any` en el diff sin un comentario que justifique por qué no hay alternativa razonable?
- [ ] ¿Las Server Actions y repositorios tienen tipos de retorno explícitos?
- [ ] ¿Hay tipos duplicados que deberían reutilizar un DTO ya existente?
- [ ] ¿`tsc --noEmit` pasa sin errores? (ver [[ci-guardian]] para dónde se ejecuta esto en el pipeline)
