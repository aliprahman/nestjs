import {
  IsNotEmpty, IsString,
  IsStrongPassword,
} from 'class-validator';
import { IsEqualTo } from '@/utils/request/equal-param.request';

export class UpdatePasswordRequest {
  @IsNotEmpty()
  @IsString()
    currentPassword: string;

  @IsNotEmpty()
  @IsString()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1
  })
    newPassword: string;

  @IsNotEmpty()
  @IsString()
  @IsEqualTo('newPassword')
    confirmPassword: string;
}