import { ZodType } from "zod";

import {
  LoginUserRequest,
  LoginUserSchema,
  RegisterUserRequest,
  RegisterUserSchema,
} from "../model/user-model.ts";

class UserValidation {
  static readonly REGISTER: ZodType<RegisterUserRequest> = RegisterUserSchema;

  static readonly LOGIN: ZodType<LoginUserRequest> = LoginUserSchema;
}

export default UserValidation;
