---
name: auth-security-reviewer
description: Comprueba la seguridad de autenticación y autorización de Aitor OS — protección de /admin, requireAdmin(), app_admins, cookies, separación auth/autorización. Usar SIEMPRE al tocar middleware.ts, lib/auth/, o cualquier ruta bajo app/admin/.
---

# Skill: Auth Security Reviewer

## Modelo del proyecto

Single-admin. Email + contraseña vía Supabase Auth (GoTrue). Registro público desactivado. La autorización real (quién puede escribir) vive en Postgres (`app_admins` + RLS + `is_admin()`), no solo en el código de la app — ver [[aitor-os-architecture]] y [[rls-security-reviewer]].

## Checklist

- [ ] **`/admin/**` protegido por `middleware.ts`**: ¿toda ruta bajo `app/admin/` (excepto login) redirige a login si no hay sesión?
- [ ] **`requireAdmin()` en toda Server Action de escritura**: no basta con proteger la ruta de UI — la Server Action debe volver a comprobar, porque puede invocarse sin pasar por la página (ver [[server-action-pattern]]).
- [ ] **Registro público desactivado**: confirmar que no hay ningún flujo de sign-up expuesto ni endpoint que permita crear usuarios sin pasar por `app_admins`.
- [ ] **`app_admins` como fuente de verdad**: `requireAdmin()` debe comprobar contra esta tabla (directamente o vía `is_admin()` en la propia query RLS), no contra un rol hardcodeado en el JWT que pueda no reflejar la tabla real.
- [ ] **Cookies seguras**: la sesión de Supabase Auth debe usar cookies `httpOnly`, `secure` (en producción, servida por HTTPS) y `sameSite` apropiado.
- [ ] **Separación autenticación / autorización**: "estar logueado" (autenticación) no es lo mismo que "ser admin" (autorización). Un bug que confunda ambos (ej. dejar pasar a cualquier usuario autenticado a `/admin`) es crítico.

## Escenario a validar siempre

Si `middleware.ts` tuviera un bug y dejara pasar una request a `/admin/proyectos/nuevo` sin sesión, ¿la Server Action subyacente (`requireAdmin()`) seguiría bloqueando la escritura? Debe ser sí — defensa en profundidad, no un único punto de fallo.

## Errores a bloquear

- Middleware que protege la ruta de UI pero una Server Action correspondiente sin `requireAdmin()`.
- Comprobación de admin basada solo en `auth.uid() IS NOT NULL` en vez de verificar pertenencia a `app_admins`.
- Cualquier endpoint (incluido `/api/*`) que mute datos sin pasar por la misma comprobación de admin.
