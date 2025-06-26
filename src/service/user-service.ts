import { hash, verify } from "@felix/argon2";
import { HTTPException } from "@hono/hono/http-exception";

import { prismaClient } from "@/application/database.ts";
import { LoginUserResponse, RegisterUserResponse } from "@/model/user-model.ts";
import { UserValidation } from "@/validation/index.ts";

import { User } from "@db/client.ts";

class UserService {
  /**
   * Registers a new user in the system.
   * @param request - The registration request containing username and password.
   * @returns A promise that resolves to the UserResponse containing the username.
   * @throws HTTPException if the username already exists.
   */
  static async register(raw: unknown): Promise<RegisterUserResponse> {
    // Validate the request using the UserValidation schema
    const request = UserValidation.REGISTER.parse(raw);

    // Check if the username already exists in the database
    const totalUserWithSameUsername = await prismaClient.user.count({
      where: {
        username: request.username,
      },
    });

    // If a user with the same username exists, throw an HTTPException
    if (totalUserWithSameUsername > 0) {
      throw new HTTPException(400, {
        message: "Username already exists.",
      });
    }

    // Hash the password before saving it to the database
    request.password = await hash(request.password);

    // Create a new user in the database and select only the username field
    const user = await prismaClient.user.create({
      data: request,
      select: {
        username: true,
      },
    });

    // Return the user response with the username
    return user;
  }

  static async login(raw: unknown): Promise<LoginUserResponse> {
    // Validate the request using the UserValidation schema
    const request = UserValidation.LOGIN.parse(raw);

    const user = await prismaClient.user.findUnique({
      where: {
        username: request.username,
      },
    });

    if (!user) {
      throw new HTTPException(401, {
        message: "Invalid username or password.",
      });
    }

    const isPasswordValid = await verify(user.password, request.password);
    if (!isPasswordValid) {
      throw new HTTPException(401, {
        message: "Invalid username or password.",
      });
    }

    const response = await prismaClient.user.update({
      where: {
        username: request.username,
      },
      data: {
        token: crypto.randomUUID(),
      },
      select: {
        username: true,
        token: true,
      },
    });

    return response;
  }

  static async get(token: string): Promise<User> {
    UserValidation.TOKEN.parse(token);

    const user = await prismaClient.user.findFirst({
      where: {
        token,
      },
    });

    if (!user) {
      throw new HTTPException(401, { message: "Invalid token." });
    }

    return user;
  }
}

export default UserService;
