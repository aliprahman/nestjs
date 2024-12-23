import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Not, Or, Repository } from 'typeorm';
import { UserEntity } from '@/databases/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserRequest } from '../request/create-user.request';
import { UpdateUserRequest } from '../request/update-user.request';
import { PaginationRequest } from '@/utils/request/pagination.request';
import { UpdatePasswordRequest } from '../request/update-password.request';

@Injectable()
export class ProfileUserService {
  private saltOrRounds;
  private defaultPassword;

  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {
    this.saltOrRounds = 10;
    this.defaultPassword = 'password'
  }

  async updatePassword(userId: string, dto: UpdatePasswordRequest): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id: userId }})
    if (!user) {
      throw new NotFoundException({ detail: 'User Not Found'});
    }

    // validate
    if (!bcrypt.compareSync(dto.currentPassword, user.password)) {
      throw new BadRequestException({ detail: 'Current password is invalid' });
    }

    user.password = bcrypt.hashSync(dto.newPassword, this.saltOrRounds);
    return this.userRepository.save(user)
  }

  async updateProfile(userId: string, dto: UpdateUserRequest) {
    // validate
    const user = await this.userRepository.findOne({ where: { id: userId }})
    if (!user) {
      throw new NotFoundException({ detail: 'User Not Found'});
    }

    const checkEmail = await this.userRepository.findOne({ where: { email: dto.email, id: Not(userId) }})
    if (checkEmail) {
      throw new BadRequestException({ detail: 'Email Already Exist'});
    }

    const checkNIK = await this.userRepository.findOne({ where: { nik: dto.nik, id: Not(userId) }})
    if (checkNIK) {
      throw new BadRequestException({ detail: 'NIK Already Exist'});
    }

    user.name = dto.name;
    user.email = dto.email;
    user.nik = dto.nik;
    return this.userRepository.save(user)
  }
}
