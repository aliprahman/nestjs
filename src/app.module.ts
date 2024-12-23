import * as path from 'path';
import {   
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod, 
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerMiddleware } from '@middleware/logger.middleware';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { DataSource } from 'typeorm';
import { ClsModule } from 'nestjs-cls';

import appConfig from '@config/app.config';
import databaseConfig from '@config/database.config';
import mailConfig from './configs/mail.config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from '@module/user/user.module';
import { AuthModule } from '@module/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      load: [appConfig, databaseConfig, mailConfig],
    }),
    ClsModule.forRoot({
      global: true,
      guard: {
        mount: true
      }
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.db_name'),
        logging: configService.get('app.env') == 'development',
        autoLoadEntities: true,
        synchronize: false,
        namingStrategy: new SnakeNamingStrategy(),
      }),
      inject: [ConfigService],
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get('email.host'),
          port: configService.get('email.port'),
          secure: configService.get('email.secure'),
          auth: {
            user: configService.get('email.user'),
            pass: configService.get('email.password')
          }
        },
        defaults: {
          from: configService.get('email.from'),
        },
        template: {
          dir: path.join(__dirname, '/templates/emails/pages'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
        options: {
          partials: {
            dir: path.join(__dirname, '/templates/emails/partials'),
            options: {
              strict: true,
            },
          },
        },
      }),
      inject: [ConfigService],
    }),
    // main module
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule implements NestModule {
  constructor(private dataSource: DataSource) {}
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
