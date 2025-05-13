import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import * as bodyParser from 'body-parser';
import { FilterException } from './commons/exceptions/fliter.exception';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new FilterException());

  //-- set global prefix
  app.setGlobalPrefix('api');

  //-- setup versioning
  app.enableVersioning({
    type: VersioningType.URI,
  });

  const limitParser = process.env?.BODY_PARSER_LIMIT ?? '30MB';
  app.use(bodyParser.json({ limit: limitParser }));
  app.use(bodyParser.urlencoded({ limit: limitParser, extended: true }));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
