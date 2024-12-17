import { Expose } from "class-transformer";

export class LoginViewModel {
  @Expose()
  access_token: string;
}