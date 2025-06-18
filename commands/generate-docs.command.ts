import { Command, CommandRunner } from 'nest-commander';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from '../src/app.module';
import { mkdirSync, writeFileSync } from 'fs';
import { dump } from 'js-yaml';
import { execSync } from 'child_process';
import { join, resolve } from 'path';

@Command({
  name: 'generate-docs',
  description: 'Generate OpenAPI docs and Redoc HTML',
})
export class GenerateDocsCommand extends CommandRunner {
  async run(): Promise<void> {
    const app = await NestFactory.create(AppModule);

    const config = new DocumentBuilder()
      .setTitle('Test Project API')
      .setDescription('The Test Project API description')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    const yamlString = dump(document, { noRefs: true });

    const rootDir = process.cwd();
    const docsDir = resolve(rootDir, 'docs');
    const publicDir = resolve(rootDir, 'public');
    const openApiPath = join(docsDir, 'openapi.yaml');
    const docsHtmlPath = join(publicDir, 'index.html');

    mkdirSync(docsDir, { recursive: true });
    mkdirSync(publicDir, { recursive: true });

    writeFileSync(openApiPath, yamlString);

    const redocCommand = `npx @redocly/cli build-docs "${openApiPath}" --output "${docsHtmlPath}"`;
    execSync(redocCommand, { stdio: 'inherit' });

    await app.close();
  }
}
