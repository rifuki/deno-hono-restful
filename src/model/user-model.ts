export type RegisterUserRequest = {
  username: string;
  password: string;
};

export type UserResponse = {
  username: string;
  token?: string;
};

// Disabled after using `select` in the Prisma query to select only the necessary fields.
// export function toUserResponse(user: UserModel): UserResponse {
//   return {
//     username: user.username,
//   };
// }
