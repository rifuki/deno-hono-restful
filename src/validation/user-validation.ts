import { ZodType } from "zod";

import {
  LoginUserRequest,
  LoginUserSchema,
  RegisterUserRequest,
  RegisterUserSchema,
  Token,
  TokenSchema,
} from "../model/user-model.ts";

class UserValidation {
  static readonly REGISTER: ZodType<RegisterUserRequest> = RegisterUserSchema;

  static readonly LOGIN: ZodType<LoginUserRequest> = LoginUserSchema;

  static readonly TOKEN: ZodType<Token> = TokenSchema;
}

export default UserValidation;
