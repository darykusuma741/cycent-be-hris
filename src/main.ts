import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ThrottlerFilter } from '@common/guard/throttler.filter';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ValidationFilter } from '@common/validation/validation.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  const config = new DocumentBuilder().addBearerAuth().setTitle('HRIS API').setDescription('REST API HRIS').setVersion('1.0').build();
  const documentFactory = () => SwaggerModule.createDocument(app, config, {});
  SwaggerModule.setup('doc', app, documentFactory, {
    swaggerOptions: {
      filter: true,
      displayRequestDuration: true,
      displayOperationId: true,
      persistAuthorization: true,
      docExpansion: 'none', // Menyembunyikan detail endpoint saat pertama kali dibuka
      defaultModelsExpandDepth: 0, // Menyembunyikan model default
      layout: 'BaseLayout', // Tema UI
      customCss: `
        .swagger-ui .topbar { background-color: #3C4F76; }
        .swagger-ui .information-container { background-color: #F5F5F5; }
      `, // Menambahkan kustom CSS
      customSiteTitle: 'Custom Swagger UI', // Menambahkan judul kustom
    },
  });

  app.enableCors({
    origin: '*',
    methods: 'GET, POST, PUT, DELETE',
    allowedHeaders: 'Content-Type, Authorization',
  });

  const logger = app.get<Logger>(WINSTON_MODULE_PROVIDER);
  app.useGlobalFilters(new ValidationFilter(logger));
  // app.useGlobalFilters(new PrismaFilter(logger));
  app.useGlobalFilters(new ThrottlerFilter(logger));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
