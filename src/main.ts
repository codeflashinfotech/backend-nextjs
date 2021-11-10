import { ValidationPipe, ValidationPipeOptions } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import * as helmet from 'helmet';
import { AppModule } from './app.module';
import { AppConfigService } from './config/app/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    allowedHeaders: '*',
  });
  const validations: ValidationPipeOptions = {
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  };

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe(validations));
  app.use(helmet());
  const appConfigService = app.get<AppConfigService>(AppConfigService);
  const options = new DocumentBuilder()
    .setTitle('PantryOn API Docs.')
    .setDescription('Here is PantryOn API documentation. Start with Auth part.')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'PantryOn API Docs',
  };
  SwaggerModule.setup('docs', app, document, customOptions);
  await app.listen(appConfigService.PORT);
}

bootstrap();
