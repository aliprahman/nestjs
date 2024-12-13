import { Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  getHello(): any {
    return this.userService.get();
  }

  @Post('/')
  create(): any {
    return this.userService.createUser();
  }
}
