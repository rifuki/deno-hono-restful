import { Context } from "@hono/hono";
import { HTTPException } from "@hono/hono/http-exception";
import { HTTPResponseError } from "@hono/hono/types";
import { ZodError } from "zod";

function honoAppError(
  err: Error | HTTPResponseError,
  c: Context,
) {
  if (err instanceof HTTPException) {
    return c.json({
      errors: err.message,
    }, err.status);
  } else if (err instanceof ZodError) {
    return c.json({
      message: "Validation failed",
      errors: err.errors.map((e) => ({
        path: e.path.join("."),
        message: e.message,
      })),
    }, 400);
  } else {
    return c.json({
      errors: err.message,
    }, 500);
  }
}

export default honoAppError;
