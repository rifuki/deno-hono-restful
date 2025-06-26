import { Hono } from "@hono/hono";

import { UserService } from "@/service/index.ts";

const userController = new Hono();

userController.post("/api/users", async (c) => {
  const request = c.req.parseBody;

  const response = await UserService.register(request);

  return c.json({
    data: response,
  });
});

userController.post("/api/users/login", async (c) => {
  const request = c.req.parseBody;

  const response = await UserService.login(request);

  return c.json({ data: response });
});

export default userController;
