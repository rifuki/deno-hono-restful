import { Hono } from "@hono/hono";
import { HTTPException } from "@hono/hono/http-exception";

import { ApplicationVariables } from "@/model/app-model.ts";
import { UserService } from "@/service/index.ts";

const userController = new Hono<{ Variables: ApplicationVariables }>();

userController.post("/", async (c) => {
  const request = c.req.parseBody;

  const response = await UserService.register(request);

  return c.json({
    data: response,
  });
});

userController.post("/login", async (c) => {
  const request = c.req.parseBody;

  const response = await UserService.login(request);

  return c.json({ data: response });
});

// Middleware to check token and set user in context
userController.use(async (c, next) => {
  const token = c.req.header("Authorization");
  if (!token) {
    throw new HTTPException(401, {
      message: "Authorization token is required.",
    });
  }

  const user = await UserService.get(token);

  c.set("user", user);

  await next();
});

userController.get("/@me", (c) => {
  const user = c.get("user");

  return c.json({
    data: {
      username: user.username,
    },
  });
});

export default userController;
