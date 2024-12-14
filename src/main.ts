import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

import { ResponseInterceptor } from '@interceptor/response.interceptor';
import { HttpExceptionFilter } from '@filter/http-exception.filter';
import { CustomValidationPipe } from './utils/pipe/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true});
  const configSerivce = app.get(ConfigService);

  // setup
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new CustomValidationPipe({
    whitelist: true,
    transform: true,
    stopAtFirstError: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }));

  const port = configSerivce.get<number>('app.port')
  await app.listen(port);
}
bootstrap();
