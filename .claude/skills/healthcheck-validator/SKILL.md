---
name: healthcheck-validator
description: Verifica el endpoint /api/health de Aitor OS y sus dependencias críticas. Usar SIEMPRE al crear o modificar app/api/health/, o al diagnosticar por qué Coolify marca el contenedor como no saludable.
---

# Skill: Healthcheck Validator

Endpoint: `app/api/health/`. Coolify lo usa para decidir si el contenedor está sano y puede recibir tráfico (ver [[coolify-deployment]] y [[aitor-os-deployment]] para dónde encaja este paso en el flujo completo).

## Qué debe comprobar el healthcheck

- Que el proceso Next.js responde (mínimo: 200 OK sin lógica adicional).
- Opcionalmente, y de forma consciente, conectividad básica a Supabase — pero sin que una query pesada o lenta convierta el healthcheck en un cuello de botella o en un falso negativo por timeout.

## Decisión a tomar explícitamente

¿El healthcheck debe fallar si Supabase está caído, o debe responder OK igualmente porque "el proceso Next.js en sí está bien"? Ambas son válidas pero tienen consecuencias distintas: si falla cuando Supabase cae, Coolify puede reiniciar el contenedor en bucle sin que reiniciar arregle nada (el problema no es el contenedor). Si no falla, un problema real de conectividad a datos puede quedar enmascarado como "todo verde". Documentar la decisión tomada en el propio código del endpoint con un comentario breve.

## Forma de referencia

```ts
export async function GET() {
  return Response.json({ status: "ok", timestamp: new Date().toISOString() });
}
```

Si se añade comprobación de Supabase, debe tener timeout corto explícito y no bloquear indefinidamente.

## Checklist

- [ ] ¿Responde rápido (sub-segundo) en el caso normal?
- [ ] ¿Tiene timeout explícito si comprueba alguna dependencia externa?
- [ ] ¿No expone información sensible en la respuesta (versión exacta, stack interno, variables de entorno)?
- [ ] ¿El intervalo/timeout configurado en Coolify es coherente con el tiempo real que tarda el endpoint?
