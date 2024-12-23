import {
  IsNotEmpty,
  IsString,
  IsStrongPassword
} from 'class-validator';
import { IsEqualTo } from '@/utils/request/equal-param.request';

export class ResetPasswordRequest {
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

  @IsNotEmpty()
  @IsString()
  @IsEqualTo('password')
    confirmPassword: string;
}