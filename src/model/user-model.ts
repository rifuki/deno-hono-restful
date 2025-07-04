import { z } from "zod";

export const RegisterUserSchema = z.object({
  username: z.string().min(1).max(50),
  password: z.string().min(3).max(100),
});
export type RegisterUserRequest = z.infer<typeof RegisterUserSchema>;
export type RegisterUserResponse = {
  username: string;
};

export const LoginUserSchema = z.object({
  username: z.string().min(1).max(50),
  password: z.string().min(3).max(100),
});
export type LoginUserRequest = z.infer<typeof LoginUserSchema>;
export type LoginUserResponse = {
  username: string;
  token: string | null;
};

export const TokenSchema = z.string().min(1);
export type Token = z.infer<typeof TokenSchema>;

export const UpdateUserSchema = z.object({
  username: z.string().min(1).max(50).optional(),
  password: z.string().min(3).max(100).optional(),
});
export type UpdateUserRequest = z.infer<typeof UpdateUserSchema>;
export type UpdateUserResponse = {
  username: string;
};

// Disabled after using `select` in the Prisma query to select only the necessary fields.
// export function toUserResponse(user: UserModel): UserResponse {
//   return {
//     username: user.username,
//   };
// }
