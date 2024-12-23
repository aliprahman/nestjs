import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request } from '@nestjs/common';
import { transformer } from '@helper/formater.helper'
import { LoginRequest } from '../request/login.request';
import { LoginViewModel } from '../viewmodel/login.viewmodel';
import { AuthService } from '../service/auth.service';
import { SkipAuth } from '@/utils/decorator/skip-auth.decorator';
import { RegisterRequest } from '../request/register.request';
import { RegisterViewModel } from '../viewmodel/register.viewmodel';
import { ForgotPasswordRequest } from '../request/forgot-password.request';
import { ResetPasswordRequest } from '../request/reset-password.request';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @SkipAuth()
  @Post('/login')
  async login(@Body() payload: LoginRequest): Promise<any> {
    const userLogin = await this.authService.signIn(payload);
    return transformer(LoginViewModel, userLogin);
  }

  @SkipAuth()
  @Post('/register')
  async register(@Body() payload: RegisterRequest): Promise<any> {
    const userRegister = await this.authService.signUp(payload);
    return transformer(RegisterViewModel, userRegister);
  }

  @SkipAuth()
  @Post('/forgot-password')
  async forgot(@Body() payload: ForgotPasswordRequest): Promise<any> {
    return await this.authService.forgotPassword(payload.email);
  }

  @SkipAuth()
  @Post('/reset-password')
  async reset(@Body() payload: ResetPasswordRequest): Promise<any> {
    return await this.authService.resetPassword(payload);
  }
}
