/**
 * Rate limit en memoria, de proceso unico (Aitor OS se despliega como un
 * unico contenedor Docker — ver ARCHITECTURE.md §2 — no serverless
 * multi-instancia, así que un Map en memoria es suficiente sin necesidad de
 * un store compartido tipo Redis).
 */
const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 3;

const hits = new Map<string, number[]>();

export function isRateLimited(key: string): boolean {
  const now = Date.now();
  const recentHits = (hits.get(key) ?? []).filter((timestamp) => now - timestamp < WINDOW_MS);
  recentHits.push(now);
  hits.set(key, recentHits);
  return recentHits.length > MAX_REQUESTS_PER_WINDOW;
}
