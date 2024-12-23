import {
  IsNotEmpty, IsString,
} from 'class-validator';

export class UpdateProfileRequest {
  @IsNotEmpty()
  @IsString()
    name: string;

  @IsNotEmpty()
  @IsString()
    email: string;

  @IsNotEmpty()
  @IsString()
    nik: string;
}