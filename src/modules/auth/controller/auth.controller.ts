import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { transformer } from '@helper/formater.helper'
import { LoginRequest } from '../request/login.request';
import { LoginViewModel } from '../viewmodel/login.viewmodel';
import { AuthService } from '../service/auth.service';
import { SkipAuth } from '@/utils/decorator/skip-auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @SkipAuth()
  @Post('/login')
  async login(@Body() payload: LoginRequest): Promise<any> {
    const userLogin = await this.authService.signIn(payload);
    return transformer(LoginViewModel, userLogin);
  }

}
