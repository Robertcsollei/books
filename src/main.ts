import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Your API')
    .setDescription('The API description')
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
bootstrap();
