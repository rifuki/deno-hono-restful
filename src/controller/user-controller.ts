import { Hono } from "@hono/hono";
import { HTTPException } from "@hono/hono/http-exception";

import { RegisterUserRequest } from "@/model/user-model.ts";
import { UserService } from "@/service/user-service.ts";

export const userController = new Hono();

userController.post("/api/users", async (c) => {
  let request: RegisterUserRequest;
  try {
    request = await c.req.json();
  } catch (_) {
    throw new HTTPException(400, {
      message: "Invalid JSON format.",
    });
  }

  const response = await UserService.register(request);

  return c.json({
    data: response,
  });
});
