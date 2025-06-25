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

Deno.test("[POST /api/users] should reject register a new user if username already exists", async () => {
  try {
    // Create a test user first
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
    // Clean up the test user
    await UserTest.delete();
  }
});

Deno.test("[POST /api/users] it should register a new user successfully", async () => {
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
    // Clean up the test user
    await UserTest.delete("teto");
  }
});
