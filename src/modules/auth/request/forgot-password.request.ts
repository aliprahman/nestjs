import {
  IsEmail,
  IsNotEmpty, IsString,
} from 'class-validator';

export class ForgotPasswordRequest {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
    email: string;
}