---
name: regression-test-guardian
description: Asegura que todo bug corregido en Aitor OS quede cubierto por un test que reproduce el fallo antes de aplicar la corrección. Usar SIEMPRE al corregir un bug reportado.
---

# Skill: Regression Test Guardian

Flujo obligatorio al corregir un bug:

```
Bug encontrado
↓
Test que reproduce el bug (falla con el código actual)
↓
Corrección
↓
Test verde
```

## Por qué este orden importa

Si se corrige el bug primero y el test se escribe después mirando el código ya corregido, es fácil escribir un test que no habría detectado el bug original — da una falsa sensación de cobertura. Escribir el test primero contra el código roto obliga a que el test realmente ejercite el fallo.

## Dónde vive el test según el tipo de bug

- Bug en una validación → [[unit-test-writer]] sobre el esquema zod.
- Bug en una query/filtrado del repositorio → [[repository-test-writer]].
- Bug en el flujo completo de una Server Action (auth, revalidación) → [[server-action-test-writer]].
- Bug en una política RLS (dato expuesto que no debería) → test de integración específico, ver [[integration-test-writer]] y re-revisar con [[rls-security-reviewer]].
- Bug de flujo completo de usuario (algo se rompe en el navegador) → [[e2e-test-writer]] si el flujo es crítico.

Ver también [[aitor-os-testing-rules]] para el mapa completo de qué skill de testing usar según el tipo de cambio.

## Checklist

- [ ] ¿Existe un test que falla con el código anterior al fix?
- [ ] ¿Ese mismo test pasa después de aplicar la corrección?
- [ ] ¿El test queda en el sitio correcto según el tipo de bug (no todo como e2e "porque es más fácil de ver")?
- [ ] ¿El mensaje/nombre del test deja claro qué regresión previene, para que si vuelve a fallar en el futuro se entienda por qué existe?
