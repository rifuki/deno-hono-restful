import "@std/dotenv/load";
import { Hono } from "@hono/hono";

import { honoAppError, jsonBodyMiddleware } from "@/middleware/index.ts";
import { userController } from "@/controller/index.ts";

const app = new Hono();

app.use("/api/*", jsonBodyMiddleware);

app.route("/", userController);

app.onError(honoAppError);

export default app;
