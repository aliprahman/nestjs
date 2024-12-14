import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { UserEntity } from '@/databases/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserRequest } from '../request/create-user.request';
import { UpdateUserRequest } from '../request/update-user.request';

@Injectable()
export class MasterDataUserService {
  private saltOrRounds;
  private defaultPassword;

  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {
    this.saltOrRounds = 10;
    this.defaultPassword = 'password'
  }

  async getAll(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  async getOne(id: string): Promise<UserEntity> {
    return this.userRepository.findOne({ where: { id }});
  }

  async createUser(dto: CreateUserRequest): Promise<UserEntity> {
    // validate
    const checkEmail = await this.userRepository.findOne({ where: { email: dto.email }})
    if (checkEmail) {
      throw new BadRequestException({ detail: 'Email Already Exist'});
    }

    const checkNIK = await this.userRepository.findOne({ where: { nik: dto.nik }})
    if (checkNIK) {
      throw new BadRequestException({ detail: 'NIK Already Exist'});
    }

    const user = new UserEntity();
    user.name = dto.name;
    user.email = dto.email;
    user.nik = dto.nik;
    user.password = bcrypt.hashSync(this.defaultPassword, this.saltOrRounds);
    return this.userRepository.save(user)
  }

  async updateUser(id: string, dto: UpdateUserRequest) {
    // validate
    const user = await this.userRepository.findOne({ where: { id }})
    if (!user) {
      throw new NotFoundException({ detail: 'User Not Found'});
    }

    const checkEmail = await this.userRepository.findOne({ where: { email: dto.email, id: Not(id) }})
    if (checkEmail) {
      throw new BadRequestException({ detail: 'Email Already Exist'});
    }

    const checkNIK = await this.userRepository.findOne({ where: { nik: dto.nik, id: Not(id) }})
    if (checkNIK) {
      throw new BadRequestException({ detail: 'NIK Already Exist'});
    }

    user.name = dto.name;
    user.email = dto.email;
    user.nik = dto.nik;
    return this.userRepository.save(user)
  }

  async deleteUser(id: string) {
    // validate
    const checkUser = await this.userRepository.findOne({ where: { id }})
    if (!checkUser) {
      throw new NotFoundException({ detail: 'User Not Found'});
    }

    await this.userRepository.softDelete({ id })
  }
}
