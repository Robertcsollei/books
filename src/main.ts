import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strip properties that don't have decorators
      forbidNonWhitelisted: true, // throw errors if non-whitelisted properties are present
      transform: true, // transform payloads to DTO instances
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Test Project API')
    .setDescription('The Test Project API description')
    .setVersion('1.0')
    .addBearerAuth()
    .addServer('http://localhost:3333', 'Local Development')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Custom Swagger UI options
  const customOptions = {
    customCssUrl:
      'https://unpkg.com/swagger-ui-themes@3.0.1/themes/3.x/theme-material.css',
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      filter: true,
    },
  };

  SwaggerModule.setup('docs', app, document, customOptions);

  await app.listen(process.env.PORT ?? 3333);
}
bootstrap().catch(console.error);
