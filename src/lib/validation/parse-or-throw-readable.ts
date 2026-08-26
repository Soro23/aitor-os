import { ZodError } from "zod";

export function parseOrThrowReadable<T>(schema: { parse: (input: unknown) => T }, input: unknown): T {
  try {
    return schema.parse(input);
  } catch (err) {
    if (err instanceof ZodError) {
      const detail = err.issues
        .map((issue) => `${issue.path.join(".") || "campo"}: ${issue.message}`)
        .join(" · ");
      throw new Error(detail);
    }
    throw err;
  }
}
