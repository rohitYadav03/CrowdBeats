import { z } from "zod";

export function formatZodErrors(error: z.ZodError) {
  return error.issues.reduce((acc, err) => {
    const field = err.path.join(".");
    acc[field] = err.message;
    return acc;
  }, {} as Record<string, string>);
}
