import {
  IsEmail,
  IsNotEmpty, IsString,
  IsStrongPassword,
} from 'class-validator';

export class RegisterRequest {
  @IsNotEmpty()
  @IsString()
    name: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
    email: string;

  @IsNotEmpty()
  @IsString()
    nik: string;

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