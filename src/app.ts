import "@std/dotenv/load";
import { Hono } from "@hono/hono";
import { ZodError } from "zod";

import { userController } from "./controller/user-controller.ts";
import { HTTPException } from "@hono/hono/http-exception";

const app = new Hono();

app.route("/", userController);

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    c.status(err.status);
    return c.json({
      errors: err.message,
    });
  } else if (err instanceof ZodError) {
    c.status(400);
    return c.json({
      errors: err.message,
    });
  } else {
    c.status(500);
    return c.json({
      errors: err.message,
    });
  }
});

export default app;
