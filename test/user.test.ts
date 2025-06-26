import { assertEquals, assertExists } from "@std/assert";

import app from "@/app.ts";
import { UserTest } from "./test-util.ts";
import {
  LoginUserRequest,
  RegisterUserRequest,
  UpdateUserRequest,
} from "@/model/user-model.ts";
import { logger } from "@/application/logging.ts";

logger.level = "error";

Deno.test("[POST /api/users] should reject register a new user if request body is invalid", async () => {
  const response = await app.request("/api/users", {
    method: "POST",
    body: JSON.stringify(
      {
        "username": "",
        "password": "",
      } satisfies RegisterUserRequest,
    ),
  });
  assertEquals(response.status, 400);

  const body = await response.json();
  assertExists(body.errors);
});

Deno.test({
  name:
    "[POST /api/users] should reject register a new user if username already exists",
  fn: async () => {
    try {
      await UserTest.create();
      const response = await app.request("/api/users", {
        method: "POST",
        body: JSON.stringify(
          {
            username: "testuser",
            password: "testpassword",
          } satisfies RegisterUserRequest,
        ),
      });
      assertEquals(response.status, 400);
      const body = await response.json();
      assertExists(body.errors);
    } finally {
      await UserTest.delete();
    }
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "[POST /api/users] it should register a new user successfully",
  fn: async () => {
    try {
      const response = await app.request("/api/users", {
        method: "POST",
        body: JSON.stringify(
          {
            username: "teto",
            password: "tetopassword",
          } satisfies RegisterUserRequest,
        ),
      });
      assertEquals(response.status, 201);
      const body = await response.json();
      assertExists(body.data);
      assertEquals(body.data.username, "teto");
    } finally {
      await UserTest.delete("teto");
    }
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "[POST /api/users/login] should be able to login",
  fn: async () => {
    try {
      const payload = {
        username: "userlogin",
        password: "userpassword",
      } satisfies LoginUserRequest;
      const user = await UserTest.create(payload);
      const response = await app.request("/api/users/login", {
        method: "POST",
        body: JSON.stringify({
          username: user.username,
          password: payload.password,
        }),
      });

      assertEquals(response.status, 200);
      const body = await response.json();
      assertExists(body.data.token);
    } finally {
      await UserTest.delete("userlogin");
    }
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "[POST /api/users/login] should be rejected if username is wrong",
  fn: async () => {
    try {
      const response = await app.request("/api/users/login", {
        method: "POST",
        body: JSON.stringify(
          {
            username: "wronguser",
            password: "wrongpassword",
          } satisfies LoginUserRequest,
        ),
      });
      assertEquals(response.status, 401);

      const body = await response.json();
      assertExists(body.errors);
    } finally {
      await UserTest.delete();
    }
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name:
    "[GET /api/users/@me] should not be able to get user data without token",
  fn: async () => {
    const response = await app.request("/api/users/@me", {
      method: "GET",
    });
    assertEquals(response.status, 401);

    const body = await response.json();
    assertExists(body.errors);
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name:
    "[GET /api/users/@me] should not be able to get user data with invalid token",
  fn: async () => {
    const response = await app.request("/api/users/@me", {
      method: "GET",
      headers: {
        Authorization: crypto.randomUUID(),
      },
    });
    assertEquals(response.status, 401);

    const body = await response.json();
    assertExists(body.errors);
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "[GET /api/users/@me] should be able to get own user data",
  fn: async () => {
    const payload = {
      username: "whoami",
      password: "mypassword",
    };

    try {
      await UserTest.delete(payload.username);
      await UserTest.create(payload);
      const { token } = await UserTest.login(payload);

      const response = await app.request("/api/users/@me", {
        method: "GET",
        headers: {
          Authorization: token!,
        },
      });
      assertEquals(response.status, 200);

      const body = await response.json();
      assertEquals(body.data.username, payload.username);
    } finally {
      await UserTest.delete(payload.username);
    }
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "[PATCH /api/users/@me] should be able to update user data",
  fn: async () => {
    let payload = {
      username: "init_username",
      password: "init_password",
    };

    try {
      await UserTest.delete(payload.username);
      await UserTest.create(payload);

      const { token } = await UserTest.login(payload);

      payload = {
        username: "update_my_username",
        password: "update_my_password",
      };
      const response = await app.request("/api/users/@me", {
        method: "PATCH",
        headers: {
          Authorization: token!,
        },
        body: JSON.stringify(
          {
            username: payload.username,
            password: payload.password,
          } satisfies UpdateUserRequest,
        ),
      });
      assertEquals(response.status, 200);

      const body = await response.json();
      assertEquals(body.data.username, payload.username);
    } finally {
      await UserTest.delete(payload.username);
    }
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "[PATCH /api/users/@me] should be able to update username",
  fn: async () => {
    const payload = {
      username: "init_username",
      password: "init_password",
    };

    try {
      await UserTest.delete(payload.username);
      await UserTest.create(payload);

      const { token } = await UserTest.login(payload);

      payload.username = "update_only_my_username";
      const response = await app.request("/api/users/@me", {
        method: "PATCH",
        headers: {
          Authorization: token!,
        },
        body: JSON.stringify(
          {
            username: payload.username,
          } satisfies UpdateUserRequest,
        ),
      });
      assertEquals(response.status, 200);

      const body = await response.json();
      assertEquals(body.data.username, payload.username);
    } finally {
      await UserTest.delete(payload.username);
    }
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "[PATCH /api/users/@me] should be able to update password",
  fn: async () => {
    const payload = {
      username: "init_username",
      password: "init_password",
    };

    try {
      await UserTest.delete(payload.username);
      await UserTest.create(payload);

      const { token } = await UserTest.login(payload);

      payload.password = "update_only_my_password";
      const response = await app.request("/api/users/@me", {
        method: "PATCH",
        headers: {
          Authorization: token!,
        },
        body: JSON.stringify(
          {
            password: payload.password,
          } satisfies UpdateUserRequest,
        ),
      });
      assertEquals(response.status, 200);

      const body = await response.json();
      assertEquals(body.data.username, payload.username);

      const loginResponse = await UserTest.login(payload);
      assertEquals(loginResponse.username, payload.username);
    } finally {
      await UserTest.delete(payload.username);
    }
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "[PATCH /api/users/@me] should be rejected if request body is invalid",
  fn: async () => {
    const payload = {
      username: "init_username",
      password: "init_password",
    };

    try {
      await UserTest.delete(payload.username);
      await UserTest.create(payload);

      const { token } = await UserTest.login(payload);

      const response = await app.request("/api/users/@me", {
        method: "PATCH",
        headers: {
          Authorization: token!,
        },
        body: JSON.stringify(
          {
            username: "",
            password: "",
          } satisfies UpdateUserRequest,
        ),
      });
      assertEquals(response.status, 400);

      const body = await response.json();
      assertExists(body.errors);
    } finally {
      await UserTest.delete(payload.username);
    }
  },
  sanitizeResources: false,
  sanitizeOps: false,
});
