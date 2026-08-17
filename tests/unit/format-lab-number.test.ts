import { describe, expect, it } from "vitest";
import { formatLabNumber } from "@/lib/format-lab-number";

describe("formatLabNumber", () => {
  it("rellena con ceros a la izquierda hasta 3 dígitos", () => {
    expect(formatLabNumber(1)).toBe("LAB #001");
    expect(formatLabNumber(14)).toBe("LAB #014");
    expect(formatLabNumber(999)).toBe("LAB #999");
  });

  it("no trunca números de más de 3 dígitos", () => {
    expect(formatLabNumber(1000)).toBe("LAB #1000");
  });
});
