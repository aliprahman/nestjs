import {
  IsEmail,
  IsNotEmpty, IsString,
  IsStrongPassword
} from 'class-validator';

export class ResetPasswordRequest {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
    email: string;

  @IsNotEmpty()
  @IsString()
    token: string;

  @IsNotEmpty()
  @IsString()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1
  })
    password: string;
}