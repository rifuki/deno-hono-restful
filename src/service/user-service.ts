import { hash, verify } from "@felix/argon2";
import { HTTPException } from "@hono/hono/http-exception";

import { prismaClient } from "@/application/database.ts";
import {
  LoginUserResponse,
  RegisterUserResponse,
  UpdateUserResponse,
} from "@/model/user-model.ts";
import { UserValidation } from "@/validation/index.ts";

import { User } from "@db/client.ts";

class UserService {
  /**
   * Registers a new user in the system.
   * @param request - The registration request containing username and password.
   * @returns A promise that resolves to the UserResponse containing the username.
   * @throws HTTPException if the username already exists.
   */
  static async register(raw_json: unknown): Promise<RegisterUserResponse> {
    // Validate the request using the UserValidation schema
    const request = UserValidation.REGISTER.parse(raw_json);

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
    const response = await prismaClient.user.create({
      data: request,
      select: {
        username: true,
      },
    });

    // Return the user response with the username
    return response;
  }

  static async login(raw_json: unknown): Promise<LoginUserResponse> {
    // Validate the request using the UserValidation schema
    const request = UserValidation.LOGIN.parse(raw_json);

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

  static async get(token: string | undefined): Promise<User> {
    UserValidation.TOKEN.safeParse(token);

    if (!token) {
      throw new HTTPException(401, {
        message: "Authorization token is required.",
      });
    }

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

  static async update(
    user: User,
    raw_json: unknown,
  ): Promise<UpdateUserResponse> {
    const request = UserValidation.UPDATE.parse(raw_json);
    const me = user.username;

    if (request.username) {
      user.username = request.username;
    }
    if (request.password) {
      user.password = await hash(request.password);
    }

    const response = await prismaClient.user.update({
      where: {
        username: me,
      },
      data: {
        username: user.username,
        password: user.password,
      },
    });

    return response;
  }

  static async logout(user: User): Promise<boolean> {
    await prismaClient.user.update({
      where: {
        username: user.username,
      },
      data: {
        token: null,
      },
    });

    return true;
  }
}

export default UserService;
