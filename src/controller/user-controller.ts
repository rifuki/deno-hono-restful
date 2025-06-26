import { Hono } from "@hono/hono";
import { HTTPException } from "@hono/hono/http-exception";

import { ApplicationVariables } from "@/model/app-model.ts";
import { UserService } from "@/service/index.ts";

const userController = new Hono<{ Variables: ApplicationVariables }>();

userController.post("/", async (c) => {
  const raw_json = c.req.parseBody;

  const response = await UserService.register(raw_json);

  return c.json({
    data: response,
  }, 201);
});

userController.post("/login", async (c) => {
  const raw_json = c.req.parseBody;

  const response = await UserService.login(raw_json);

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

userController.patch("/@me", async (c) => {
  const user = c.get("user");
  const raw_json = c.req.parseBody;

  const response = await UserService.update(user, raw_json);

  return c.json({
    data: response,
  });
});

export default userController;
