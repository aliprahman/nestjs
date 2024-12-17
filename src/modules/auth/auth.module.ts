import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@/databases/entities/user.entity';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '@/utils/guard/auth.guard';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('app.secret'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
    UserModule
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    }
  ],
  exports: [TypeOrmModule],
})
export class AuthModule {}
