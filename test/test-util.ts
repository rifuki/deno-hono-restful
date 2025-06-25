import { hash } from "@bronti/argon2";

import { prismaClient } from "@/application/database.ts";
import { UserResponse } from "@/model/user-model.ts";

export class UserTest {
  static async create(): Promise<UserResponse> {
    return await prismaClient.user.create({
      data: {
        username: "testuser",
        password: hash("testpassword"),
      },
      select: {
        username: true,
      },
    });
  }

  static async delete(username?: string) {
    await prismaClient.user.deleteMany({
      where: {
        username: username ?? "testuser",
      },
    });
  }
}
