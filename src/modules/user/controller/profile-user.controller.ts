import { Body, Controller, Get, Patch } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { transformer } from '@helper/formater.helper'
import { UserViewModel } from '../viewmodel/user.viewmodel';
import { UpdatePasswordRequest } from '../request/update-password.request';
import { ProfileUserService } from '../service/profile-user.service';
import { UpdateProfileRequest } from '../request/update-profile.request';

@Controller('/profile/user')
export class ProfileUserController {
  constructor(
    private clsService: ClsService,
    private readonly profileUserService: ProfileUserService
  ) {}

  @Get('/')
  async me() {
    const user = this.clsService.get('user')
    return transformer(UserViewModel, user)
  }

  @Patch('/password')
  async password(@Body() payload: UpdatePasswordRequest) {
    const user = this.clsService.get('user')
    const updatedUser = await this.profileUserService.updatePassword(user.id, payload)
    return transformer(UserViewModel, updatedUser)
  }

  @Patch('/profile')
  async profile(@Body() payload: UpdateProfileRequest) {
    const user = this.clsService.get('user')
    const updatedUser = await this.profileUserService.updateProfile(user.id, payload)
    return transformer(UserViewModel, updatedUser)
  }
}
