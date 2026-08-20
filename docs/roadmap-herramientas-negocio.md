# Roadmap — herramientas de negocio pendientes

Este documento recoge lo que quedó **fuera de la primera entrega** de herramientas admin-only para vender servicios de consultoría/freelance desde Aitor OS. La entrega ya implementada (Leads, Calculadora, Plantillas, Finanzas) sigue el plan original en `C:\Users\aitol\.claude\plans\de-estos-10-proyectos-sprightly-twilight.md` (fuera del repo, en la máquina de desarrollo).

## Pendiente de contenido (no requiere código)

### Nota SOP (Evergreen)

Crear vía el CRUD ya existente en `/admin/garden` → nueva nota:
- `category`: `sistemas`
- `status`: `evergreen` desde el inicio (no pasar por `seed`/`growing`)
- `is_published`: a decidir — `true` refuerza el posicionamiento ante clientes que naveguen el Garden; `false` la mantiene privada hasta publicarla más adelante

Contenido sugerido (requiere el proceso real de Aitor, no se ha redactado por eso):
1. Cómo evalúa una oportunidad nueva (criterios de fit / qué proyectos acepta).
2. Proceso de primer contacto → llamada de descubrimiento.
3. Cómo llega a un número (referencia conceptual al proceso de estimar, sin exponer la calculadora interna).
4. Estructura de una propuesta tipo (referencia a que usa plantillas reutilizables de `/admin/plantillas`).
5. Herramientas de trabajo con clientes: comunicación, entregas, facturación.
6. Política de cambios de alcance / revisiones.
7. Cómo cierra un proyecto: entrega, documentación, soporte posterior.
8. Principios no negociables (transparencia, calidad de código, comunicación).

## Fuera de alcance de la primera entrega (mejoras futuras)

| Item | Alcance pedido | Estado |
|------|-----------------|--------|
| Portfolio piece (proyectos) | Mejorar | Ya existe como sección Proyectos; revisar que al menos 1 proyecto tenga demo real desplegada, no solo mockup, antes de usarlo en conversaciones con clientes. |
| Website / landing | Mejorar | Revisar Inicio/Sobre mí para reflejar que ahora se ofrecen servicios a clientes (mensaje, CTA de contacto, tipo de proyectos que se aceptan). |
| Content system para visibilidad propia | Preparar idea inicial | Ya existe la base (Garden/Lab/Now/Dashboard); falta definir una cadencia o estrategia de publicación — no es una feature de código, es un proceso a diseñar. |
| Outreach sequence | Preparar idea inicial, admin-only | Sin implementar. Es candidato a proceso externo (email/CRM) más que a tabla nueva; si se decide construirlo dentro del stack, evaluar entonces si conviene separar `leads` de `contact_messages` (ver nota de riesgo aceptado en la Fase 1 del plan original). |
| Referral request system | Preparar idea inicial, admin-only | Sin implementar. Candidato de bajo coste una vez exista outreach: un CTA/email automático disparado al marcar un lead como `ganado` en `/admin/leads`. |

## Testing pendiente (limitación de entorno, no de diseño)

Las 3 migraciones nuevas de la primera entrega (`20260820100000_add_lead_pipeline_to_contact_messages.sql`, `20260820100100_create_proposal_templates.sql`, `20260820100200_create_financial_entries.sql`) tienen sus tests de integración RLS ya escritos (`tests/integration/contact-messages-rls.test.ts`, `tests/integration/proposal-templates-rls.test.ts`, `tests/integration/financial-entries-rls.test.ts`) pero **no ejecutados** — requieren Docker, no disponible en esta máquina de desarrollo (virtualización desactivada en BIOS, ver nota de entorno en `CLAUDE.md`). Ejecutar `npm run test:integration` en cuanto haya un entorno con Docker disponible, junto con el resto de pendientes ya documentados en `CLAUDE.md` (`test:e2e`, prueba manual en navegador, `docker build` real).
