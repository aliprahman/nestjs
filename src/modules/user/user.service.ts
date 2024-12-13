import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '@/databases/entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async get(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  async createUser(): Promise<UserEntity> {
    return this.userRepository.create({
      name: 'alip',
      email: 'aliprrahman@gmail.com',
      nik: '01978239102'
    })
  }
}
