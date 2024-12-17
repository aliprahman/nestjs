
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '@/databases/entities/user.entity';
import { LoginRequest } from '../request/login.request';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private jwtService: JwtService
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
}
