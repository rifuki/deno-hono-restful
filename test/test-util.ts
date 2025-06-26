import { hash } from "@felix/argon2";

import app from "@/app.ts";
import { prismaClient } from "@/application/database.ts";
import { LoginUserResponse, RegisterUserResponse } from "@/model/user-model.ts";

const USERNAME = "testuser";
const PASSWORD = "testpassword";

type Payload = {
  username: string;
  password: string;
};

export class UserTest {
  static async create(
    payload: Partial<Payload> = {},
  ): Promise<RegisterUserResponse> {
    const { username = USERNAME, password = PASSWORD } = payload;
    return await prismaClient.user.create({
      data: {
        username: username,
        password: await hash(password),
      },
      select: {
        username: true,
      },
    });
  }

  static async delete(username: string = USERNAME) {
    await prismaClient.user.deleteMany({
      where: {
        username,
      },
    });
  }

  static async login(
    payload: Partial<Payload> = {},
  ): Promise<LoginUserResponse> {
    const { username = USERNAME, password = PASSWORD } = payload;
    const response = await app.request("/api/users/login", {
      method: "POST",
      body: JSON.stringify({
        username,
        password,
      }),
    });

    const user = await response.json();

    return user.data;
  }
}
