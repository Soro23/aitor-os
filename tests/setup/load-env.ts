import { existsSync } from "node:fs";

// npm run test:integration necesita las variables de Supabase local + el
// admin de prueba (ver .env.test.example). Prioriza .env.test, cae a
// .env.local si no existe.
for (const file of [".env.test", ".env.local"]) {
  if (existsSync(file)) {
    process.loadEnvFile(file);
    break;
  }
}
