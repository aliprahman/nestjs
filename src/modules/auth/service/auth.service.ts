
import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '@/databases/entities/user.entity';
import { LoginRequest } from '../request/login.request';
import * as bcrypt from 'bcrypt';
import { RegisterRequest } from '../request/register.request';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async signIn(dto: LoginRequest): Promise<{ access_token: string }> {

    const user = await this.userRepository.findOne({ where: { email: dto.email }});
    if (!user) {
      throw new UnauthorizedException({ detail: 'email or password is invalid' });
    } else  if (!bcrypt.compareSync(dto.password, user.password)) {
      throw new UnauthorizedException({ detail: 'email or password is invalid' });
    }

    const payload = { sub: user.id, email: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signUp(dto: RegisterRequest): Promise<{ access_token: string }> {
    // validate
    const checkEmail = await this.userRepository.findOne({ where: { email: dto.email }})
    if (checkEmail) {
      throw new BadRequestException({ detail: 'Email Already Exist'});
    }

    const checkNIK = await this.userRepository.findOne({ where: { nik: dto.nik }})
    if (checkNIK) {
      throw new BadRequestException({ detail: 'NIK Already Exist'});
    }

    console.log('salt', this.configService.get<number>('app.salt'))

    const user = new UserEntity();
    user.name = dto.name;
    user.email = dto.email;
    user.nik = dto.nik;
    user.password = bcrypt.hashSync(dto.password, parseInt(this.configService.get('app.salt')));
    await this.userRepository.save(user)

    const payload = { sub: user.id };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
