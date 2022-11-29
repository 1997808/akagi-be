import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as event from 'events';
import {
  HttpExceptionFilter,
  WebsocketExceptionsFilter,
} from './utils/exception';
// import * as fs from 'fs';
// import * as path from 'path';

async function bootstrap() {
  // const httpsOptions = {
  //   key: fs.readFileSync(
  //     path.resolve('certbot', 'conf', 'live', 'karuhi.me', 'privkey.pem'),
  //   ),
  //   cert: fs.readFileSync(
  //     path.resolve('certbot', 'conf', 'live', 'karuhi.me', 'cert.pem'),
  //   ),
  // };

  // const app = await NestFactory.create(AppModule, { httpsOptions });
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());
  event.EventEmitter.defaultMaxListeners = 20;

  const config = new DocumentBuilder()
    .setTitle('Akagi API')
    .setVersion('0.1')
    .addBearerAuth(undefined, 'defaultToken')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);
  app.useGlobalFilters(
    new HttpExceptionFilter(),
    new WebsocketExceptionsFilter(),
  );

  await app.listen(3000, '0.0.0.0');
}
bootstrap();
