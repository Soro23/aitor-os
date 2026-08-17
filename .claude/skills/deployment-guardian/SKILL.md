---
name: deployment-guardian
description: Checklist genérico de orquestación de despliegue de Aitor OS de extremo a extremo — CI correcto, build Docker, migraciones, deploy, healthcheck, smoke test. Usar SIEMPRE al orquestar o diagnosticar un despliegue completo; para el mapeo de estos pasos a la infraestructura concreta del proyecto (Coolify/Supabase self-hosted), usar aitor-os-deployment.
---

# Skill: Deployment Guardian

Checklist genérico de orquestación — el mapeo de cada paso a la infraestructura real del proyecto (Coolify, Supabase self-hosted) vive en [[aitor-os-deployment]], que reutiliza esta secuencia. Si se está preparando un release versionado, ver también [[release-manager]] para la capa de versión/changelog por encima de este flujo.

Flujo completo que esta skill vigila como conjunto (cada paso tiene su propia skill dedicada para el detalle):

```
CI correcto        → ver ci-guardian
↓
Build Docker         → ver docker-architect / dockerfile-reviewer
↓
Migraciones            → ver migration-deployment-guardian
↓
Deploy                  → ver coolify-deployment
↓
Healthcheck               → ver healthcheck-validator
↓
Smoke Test
```

Enlaces reales a cada paso del diagrama: [[ci-guardian]], [[docker-architect]], [[dockerfile-reviewer]], [[migration-deployment-guardian]], [[coolify-deployment]], [[healthcheck-validator]].

## Rol de esta skill

No repetir el detalle de cada paso (eso vive en las skills enlazadas) — verificar que la **secuencia completa** se respeta y que no se salta ni reordena ningún paso bajo presión ("vamos a desplegar rápido y migramos después").

## Checklist de orquestación

- [ ] ¿CI pasó los 7 pasos completos antes de siquiera construir la imagen Docker?
- [ ] ¿La imagen Docker se construyó desde el commit exacto que pasó CI, no desde un estado local distinto?
- [ ] ¿Las migraciones se aplicaron explícitamente ANTES de desplegar el nuevo contenedor, nunca en su arranque? (ver [[migration-deployment-guardian]])
- [ ] ¿El healthcheck de Coolify confirma que el nuevo contenedor está sano antes de enrutar tráfico hacia él?
- [ ] ¿Hay un smoke test mínimo tras el deploy (ej. cargar la home, comprobar que `/api/health` responde 200, comprobar que el login admin funciona) antes de dar el despliegue por bueno?
- [ ] ¿Existe un plan de rollback si algo de lo anterior falla? (ver [[rollback-planner]])

## Cuándo detener un despliegue

Si CI no pasó completo, si las migraciones no se han aplicado, o si el healthcheck falla tras el deploy — detener el proceso y no forzar el paso siguiente. Un despliegue a medias en producción es peor que no desplegar.
