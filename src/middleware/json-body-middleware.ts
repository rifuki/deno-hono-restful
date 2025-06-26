import { HTTPException } from "@hono/hono/http-exception";
import { createMiddleware } from "@hono/hono/factory";

const jsonBodyMiddleware = createMiddleware(
  async (c, next) => {
    try {
      c.req.parseBody = await c.req.json();
    } catch (_) {
      throw new HTTPException(400, { message: "Invalid JSON format." });
    }

    await next();
  },
);

export default jsonBodyMiddleware;
