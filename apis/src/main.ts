/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
// import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Global exception filter
  // app.useGlobalFilters(new HttpExceptionFilter());

  // CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  // API Documentation with Swagger (OpenAPI)
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('KINE-SAAS API')
      .setDescription(
        'API documentation for the KINE-SAAS physiotherapy backend',
      )
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Enter JWT token',
          in: 'header',
        },
        'jwt', // This name here is important for matching @ApiBearerAuth() decorator
      )
      .addTag('auth', 'Authentication endpoints')
      .addTag('users', 'User management endpoints')
      .addTag('patients', 'Patient management endpoints')
      .addTag('medical-records', 'Medical records management endpoints')
      .addTag('appointments', 'Appointment scheduling endpoints')
      .addTag('documents', 'Document management endpoints')
      .addServer(`http://localhost:${process.env.PORT || 3001}`)
      .build();

    const document = SwaggerModule.createDocument(app, config);

    // Save the OpenAPI spec to a file
    const fs = require('fs');
    fs.writeFileSync('./openapi-spec.json', JSON.stringify(document, null, 2));
    console.log('OpenAPI specification saved to openapi-spec.json');

    // Setup Swagger UI
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        tagsSorter: 'alpha',
        operationsSorter: 'alpha',
      },
    });

    console.log(
      `Swagger documentation available at http://localhost:${process.env.PORT || 3001}/api/docs`,
    );
  }

  await app.listen(3001);
}
bootstrap();
