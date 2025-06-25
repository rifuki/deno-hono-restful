import { hash } from "@bronti/argon2";
import { HTTPException } from "@hono/hono/http-exception";

import { prismaClient } from "@/application/database.ts";
import { RegisterUserRequest, UserResponse } from "@/model/user-model.ts";
import { UserValidation } from "@/validation/user-validation.ts";

export class UserService {
  /**
   * Registers a new user in the system.
   * @param request - The registration request containing username and password.
   * @returns A promise that resolves to the UserResponse containing the username.
   * @throws HTTPException if the username already exists.
   */
  static async register(request: RegisterUserRequest): Promise<UserResponse> {
    // Validate the request using the UserValidation schema
    request = UserValidation.REGISTER.parse(request);

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
    request.password = hash(request.password);

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
}
