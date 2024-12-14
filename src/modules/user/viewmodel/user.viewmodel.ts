import { Expose } from "class-transformer";

export class UserViewModel {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  nik: string;
}