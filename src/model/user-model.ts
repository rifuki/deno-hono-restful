import { z } from "zod";

export const RegisterUserSchema = z.object({
  username: z.string().min(1).max(20),
  password: z.string().min(3).max(100),
});
export type RegisterUserRequest = z.infer<typeof RegisterUserSchema>;

export const LoginUserSchema = z.object({
  username: z.string().min(1).max(20),
  password: z.string().min(3).max(100),
});
export type LoginUserRequest = z.infer<typeof LoginUserSchema>;

export type UserResponse = {
  username: string;
  token?: string | null;
};

export const TokenSchema = z.string().min(1);
export type Token = z.infer<typeof TokenSchema>;

// Disabled after using `select` in the Prisma query to select only the necessary fields.
// export function toUserResponse(user: UserModel): UserResponse {
//   return {
//     username: user.username,
//   };
// }
