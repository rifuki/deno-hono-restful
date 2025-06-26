import { assertEquals, assertExists } from "@std/assert";

import app from "@/app.ts";
import { UserTest } from "./test-util.ts";
import { RegisterUserRequest } from "@/model/user-model.ts";

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
        body: JSON.stringify({
          username: "teto",
          password: "tetopassword",
        }),
      });
      assertEquals(response.status, 200);
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
      const user = await UserTest.create("userlogin");
      const response = await app.request("/api/users/login", {
        method: "POST",
        body: JSON.stringify({
          username: user.username,
          password: "testpassword",
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
        body: JSON.stringify({
          username: "wronguser",
          password: "wrongpassword",
        }),
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
