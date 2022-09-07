import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import appConfig from './auth/env-helper/app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*'
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true  }));
  await app.listen(appConfig().PORT || 3000);
}
bootstrap();
