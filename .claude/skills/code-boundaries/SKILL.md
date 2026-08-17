---
name: code-boundaries
description: Controla los límites entre capas del proyecto (UI, Server Actions, Repositorios, Supabase). Usar SIEMPRE al escribir o revisar código que toque datos, para detectar violaciones de capa antes de que se conviertan en deuda técnica.
---

# Skill: Code Boundaries

El flujo de capas de Aitor OS (ver [[aitor-os-architecture]]) es innegociable:

```
UI → Server Actions → Repositorios → Supabase
```

## Reglas duras

1. **Los componentes (UI) no acceden directamente a Supabase.** Nunca `import { createClient } from '@/lib/supabase/...'` dentro de un componente cliente ni de una página que no sea la que orquesta la llamada al repositorio a través de un Server Action o de una función de lectura server-side.
2. **Las Server Actions no contienen SQL ni lógica de persistencia.** Una Server Action valida (zod) y delega en el repositorio. Si una Server Action tiene un `.from('tabla').select(...)` inline, es una violación.
3. **Los repositorios son el único punto de acceso a datos.** Toda query a Supabase vive en `server/repositories/*`. Si aparece una query en cualquier otro sitio, es una violación — mover a un repositorio existente o crear uno nuevo (ver [[repository-pattern]]).
4. **Los detalles internos permanecen encapsulados.** Un componente admin no debe conocer el nombre de columna real de la base de datos si puede trabajar con un DTO tipado (ver `types/dto/`).
5. **Sin imports "por atajo" entre capas no adyacentes.** UI no importa nada de `server/repositories/` directamente, solo a través de una Server Action o de una función de lectura expuesta explícitamente para Server Components.

## Patrón correcto de Server Action

```ts
"use server";

requireAdmin();

const data = schema.parse(input);

await repository.update(id, data);

revalidatePath("/projects");
```

Flujo: Autenticación → Validación → Repository → Revalidación → Respuesta. Ver también [[server-action-pattern]] si existe una skill dedicada; si no, esta es la referencia.

## Checklist de revisión

- [ ] ¿Hay algún `supabase.from(...)` fuera de `server/repositories/`?
- [ ] ¿Alguna Server Action hace más que validar + llamar al repositorio + revalidar?
- [ ] ¿Algún componente cliente importa algo de `server/` directamente?
- [ ] ¿Se usa el cliente correcto según el contexto? (`lib/supabase/browser` en cliente, `lib/supabase/server` en Server Components/Actions respetando RLS, `lib/supabase/admin` con service-role SOLO en scripts, nunca en el camino de una request pública)
- [ ] ¿La ruta pública consulta a través de un repositorio, o tiene su propia query ad-hoc?

## Errores frecuentes a bloquear

- Query directa a Supabase dentro de una página `app/(public)/**`.
- Cliente `admin` (service-role) usado en un Server Action que responde a una request de usuario — el service-role bypassa RLS y nunca debe estar en el camino de request pública.
- Lógica de negocio (cálculos, transformaciones de estado) escrita dentro de un componente en vez de en el repositorio o en un helper de `lib/`.
