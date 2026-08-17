---
name: rls-security-reviewer
description: Revisa las políticas RLS de Postgres/Supabase para cualquier tabla nueva o modificada en Aitor OS. Usar SIEMPRE al crear una migración SQL o al añadir/modificar una tabla, antes de darla por terminada.
---

# Skill: RLS Security Reviewer

Principio del proyecto (ver [[aitor-os-architecture]]): el frontend nunca es la frontera de seguridad. La autorización real vive en RLS de Postgres. Aunque una ruta pública tenga un bug y exponga una query sin filtrar, la base de datos nunca debe devolver contenido no autorizado.

## Para cada tabla nueva, comprobar las 4 operaciones

```
SELECT
INSERT
UPDATE
DELETE
```

## Patrón estándar del proyecto (dos políticas por tabla editorial)

1. **Lectura pública**: `anon`/`authenticated` leen solo filas con `is_published = true` (o el equivalente `is_active`/`is_visible` en `now_items`/`stack_items`, que no tienen flujo de publicación pero sí de visibilidad).
2. **Escritura admin**: solo si `is_admin()` devuelve verdadero. `is_admin()` es una función `security definer` que comprueba `auth.uid()` contra la tabla `app_admins`.

## Checklist obligatorio por tabla

- [ ] ¿RLS está **activado** en la tabla (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY`)? Sin esto, las políticas no se aplican.
- [ ] ¿Existe política de `SELECT` que filtre por `is_published`/`is_active` para el rol público? Sin política explícita, por defecto no hay acceso — pero comprobar que no se haya dejado una política demasiado permisiva (`USING (true)`) por comodidad.
- [ ] ¿Las políticas de `INSERT`/`UPDATE`/`DELETE` usan `is_admin()` y no una condición más débil (ej. comprobar solo `auth.uid() IS NOT NULL`, que permitiría a cualquier usuario autenticado escribir)?
- [ ] Para `contact_messages`: ¿INSERT es público (formulario de contacto) pero SELECT es solo admin? Confirmar que no hay política de SELECT pública accidental.
- [ ] Para `app_admins`: ¿la tabla en sí está protegida contra lectura/escritura pública? Es la tabla que decide quién es admin — un fallo aquí compromete todo.
- [ ] ¿Los borradores (`is_published = false`) son de verdad inaccesibles a `anon`, incluso conociendo el `id` directamente (no solo en listados, también en `findById`)?
- [ ] ¿Las políticas usan `auth.uid()` correctamente (no `auth.jwt() ->> 'sub'` ni variantes inconsistentes con el resto del proyecto)?

## Errores comunes a bloquear

- Tabla nueva sin `ENABLE ROW LEVEL SECURITY` — queda accesible según los defaults, casi siempre un agujero.
- Política de escritura que comprueba `auth.role() = 'authenticated'` en vez de `is_admin()` — con single-admin y registro público desactivado esto puede no ser explotable hoy, pero es el patrón equivocado y no debe repetirse.
- Política de `SELECT` sin filtro de `is_published` en una tabla editorial — expone borradores.
- Migraciones que crean tabla y datos pero postergan RLS "para después" — no debe pasar CI/aitor-os-code-review sin RLS.
- Uso del cliente `admin` (service-role) en código que responde a requests públicas para "saltarse" RLS en vez de arreglar la política — ver [[code-boundaries]].

## Al terminar

Ejecutar mentalmente el escenario: "si mañana `app/(public)/proyectos/[id]/page.tsx` tuviera un bug que quita el filtro `WHERE is_published`, ¿seguiría siendo imposible ver un borrador?" Si la respuesta no es un "sí" seguro basado en RLS, la tabla no está lista.
