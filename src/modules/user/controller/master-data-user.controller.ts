import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { MasterDataUserService } from '../service/master-data-user.service';
import { UserViewModel } from '../viewmodel/user.viewmodel';
import { transformer } from '@helper/formater.helper'
import { CreateUserRequest } from '../request/create-user.request';
import { UpdateUserRequest } from '../request/update-user.request';

@Controller('/master-data/users')
export class MasterDataUserController {
  constructor(private readonly userService: MasterDataUserService) {}

  @Get('/')
  get(): any {
    return this.userService.getAll();
  }

  @Post('/')
  async create(@Body() payload: CreateUserRequest): Promise<any> {
    const newUser = await this.userService.createUser(payload);
    return transformer(UserViewModel, newUser);
  }

  @Get('/:id')
  async detail(@Param('id') id: string): Promise<any> {
    const userDetail = await this.userService.getOne(id)
    return transformer(UserViewModel, userDetail);
  }

  @Patch('/:id')
  async update(@Param('id') id: string, @Body() payload: UpdateUserRequest): Promise<any> {
    const userDetail = await this.userService.updateUser(id, payload)
    return transformer(UserViewModel, userDetail);
  }

  @Delete('/:id')
  async delete(@Param('id') id: string): Promise<any> {
    await this.userService.deleteUser(id)
    return { message: 'User has been successfully deleted'};
  }
}
