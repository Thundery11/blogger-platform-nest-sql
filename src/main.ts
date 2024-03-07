import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './infrastucture/exception-filters/exception.filter';
// import { applyAppSettings, setAppPipes } from './settings/apply.app.settings';
import cookieParser from 'cookie-parser';
import { appSettings } from './settings/app-settings';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // applyAppSettings(app);
  // setAppPipes(app);

  // const config = new DocumentBuilder()
  //   .setTitle('blogger-platform')
  //   .setDescription('The blogger-platform API description')
  //   .setVersion('1.0')
  //   .addTag('blogger-platform')
  //   .build();
  // const document = SwaggerModule.createDocument(app, config);
  // SwaggerModule.setup('api', app, document);

  // somewhere in your initialization file
  appSettings(app);
  await app.listen(3000);
}
bootstrap();
