
import { Injectable, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '@/databases/entities/user.entity';
import { LoginRequest } from '../request/login.request';
import * as bcrypt from 'bcrypt';
import { RegisterRequest } from '../request/register.request';
import { ConfigService } from '@nestjs/config';
import * as moment from 'moment';
import { generateRandomString } from '@/utils/helper/string.helper';
import { ForgotPasswordEntity } from '@/databases/entities/forgot-password.entity';
import { ResetPasswordRequest } from '../request/reset-password.request';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(ForgotPasswordEntity)
    private forgotPasswordRepository: Repository<ForgotPasswordEntity>,
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

  async forgotPassword(email: string): Promise<{ message: string }> {
    // validate
    const checkEmail = await this.userRepository.findOne({ where: { email }})
    if (!checkEmail) {
      throw new NotFoundException({ detail: 'Email Not Found'});
    }

    // save token
    const forgot = new ForgotPasswordEntity()
    forgot.email = email;
    forgot.token = generateRandomString(150);
    forgot.expireAt = moment().add(10, 'minute').toDate();
    await this.forgotPasswordRepository.save(forgot);

    // send email

    return  {
      message: 'Your reset password email is heading your way.'
    }
  }

  async resetPassword(dto: ResetPasswordRequest): Promise<{ message: string }> {
    // validate
    const checkToken = await this.forgotPasswordRepository.findOne({
      where: { 
        token: dto.token,
        expireAt: MoreThanOrEqual(moment().toDate())
      }
    })
    if (!checkToken) {
      throw new BadRequestException({ detail: 'Your reset password link has been expired'});
    }

    // update password
    const user = await this.userRepository.findOne({ where: { email: checkToken.email }})
    if (!user) {
      throw new NotFoundException({ detail: 'User Not Found'});
    }
    user.password = bcrypt.hashSync(dto.password, parseInt(this.configService.get('app.salt')))
    await this.userRepository.save(user)

    // delete token by email
    await this.forgotPasswordRepository.softDelete(checkToken.id)

    return  {
      message: 'Your password has been successfully reset.'
    }
  }
}
