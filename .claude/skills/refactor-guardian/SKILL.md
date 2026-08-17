---
name: refactor-guardian
description: Detecta oportunidades reales de refactorización en Aitor OS sin caer en sobreingeniería. Usar cuando se detecte código duplicado, o antes de proponer una abstracción nueva.
---

# Skill: Refactor Guardian

Orden de prioridad al considerar una refactorización:

```
Duplicación
↓
Abstracción simple
↓
Reutilización
↓
Legibilidad
```

## Criterio para abstraer (regla de tres)

No abstraer en la primera repetición. Solo cuando el mismo patrón aparece de forma clara **tres veces o más**, y de forma casi idéntica, vale la pena extraer una función/componente/hook compartido. Dos casos parecidos pueden seguir siendo casos separados si aún no está claro cómo evolucionan.

## Señales de que SÍ hace falta refactorizar

- La misma lógica de filtrado `is_published`/`is_featured` reimplementada en más de un repositorio en vez de un helper compartido.
- El mismo patrón de Server Action (`requireAdmin` → `parse` → `repository` → `revalidatePath`) copiado con variaciones menores en varios archivos, cuando podría ser un wrapper genérico.
- Componentes UI casi idénticos que deberían ser una variant (ver [[component-reuse-enforcer]]).

## Señales de sobreingeniería a evitar

- Crear una capa de abstracción genérica para un caso que solo existe una vez.
- Parametrizar algo "por si en el futuro hace falta" sin un caso de uso real hoy.
- Convertir una función simple en una clase o en un patrón de diseño complejo cuando la función ya era clara.

## Al proponer una refactorización

1. Mostrar la duplicación concreta (archivos y líneas).
2. Proponer la abstracción mínima que la resuelve, no la más flexible posible.
3. Confirmar que no rompe funcionalidad existente ni contradice [[architecture-guardian]] / [[aitor-os-architecture]].
