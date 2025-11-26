import { HttpStatus, Injectable, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { appConfig } from './config';
import cookieParser from 'cookie-parser';
import { AllExceptionsFilter } from './infrastructure/exception/All-exception-filter';
import { winstonConfig } from './infrastructure/winston/winston.config';
import { contacts } from './common/document/swagger/admin/docs';

@Injectable()
class AppService {
  async main() {
    const app = await NestFactory.create(AppModule, {
      logger: winstonConfig,
    });

    app.enableCors({
      // origin: ['http://localhost:5173'],
      origin: ['http://localhost:5173', 'http://localhost:5174'],
      credentials: true,
    });

    app.setGlobalPrefix('api/v1');
    app.use(cookieParser());

    const httpAdapter = app.get(HttpAdapterHost);
    app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

    app.useLogger(['log', 'error', 'warn', 'debug', 'verbose']);

    // validation pipe
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        transformOptions: { enableImplicitConversion: true },
        validationError: { target: false },
        stopAtFirstError: true,
        disableErrorMessages: appConfig.NODE_ENV === 'production',
        exceptionFactory: (errors) => {
          const messages = errors
            .map((err) => Object.values(err.constraints || {}))
            .flat();
          return {
            statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
            message: messages,
            error: 'Unprocessable Entity',
          };
        },
      }),
    );

    // swagger
    const config = new DocumentBuilder()
      .setTitle('ERP')
      .setDescription('The ERP')

      .build();

    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, documentFactory(), {
      swaggerOptions: {
        persistAuthorization: true,
      },
      customSiteTitle: 'CRM Swagger Docs',
    });

    await app.listen(appConfig.PORT, () => {
      console.log(`Swagger url => http://localhost:${appConfig.PORT}/api`);
      console.log(`Server started on port ${appConfig.PORT}`);
    });
  }
}

export default new AppService();
