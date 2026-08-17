import { describe, expect, it } from "vitest";
import { isRateLimited } from "@/lib/rate-limit";

describe("isRateLimited", () => {
  it("permite las primeras peticiones dentro del limite", () => {
    const key = `test-${Math.random()}`;
    expect(isRateLimited(key)).toBe(false);
    expect(isRateLimited(key)).toBe(false);
    expect(isRateLimited(key)).toBe(false);
  });

  it("bloquea a partir de la peticion que supera el limite", () => {
    const key = `test-${Math.random()}`;
    isRateLimited(key);
    isRateLimited(key);
    isRateLimited(key);
    expect(isRateLimited(key)).toBe(true);
  });

  it("cuenta cada clave (IP) por separado", () => {
    const keyA = `test-a-${Math.random()}`;
    const keyB = `test-b-${Math.random()}`;
    isRateLimited(keyA);
    isRateLimited(keyA);
    isRateLimited(keyA);
    expect(isRateLimited(keyA)).toBe(true);
    expect(isRateLimited(keyB)).toBe(false);
  });
});
