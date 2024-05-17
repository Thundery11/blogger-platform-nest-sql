import { Test } from '@nestjs/testing';
import { AppModule, localDbOptions, options } from '../../../src/app.module';
import { useContainer } from 'class-validator';
import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import supertest, { SuperAgentTest } from 'supertest';
import { testingAllDataURI } from '../constants/testing.constants';
import { TypeOrmModule } from '@nestjs/typeorm';
import cookieParser from 'cookie-parser';
import { HttpExceptionFilter } from '../../../src/infrastucture/exception-filters/exception.filter';

export const getAppAndClearDb = async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [TypeOrmModule.forRoot(options), AppModule],
  }).compile();

  const app: INestApplication = moduleRef.createNestApplication();
  const agent = supertest.agent(app.getHttpServer());
  // const agent: SuperAgentTest = supertest.agent(app.getHttpServer());
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      transform: true,
      exceptionFactory: (errors) => {
        console.log(errors);
        const errorsForResponse: { message: string; field: string }[] = [];
        errors.forEach((e) => {
          const constraintsKeys = Object.keys(e.constraints!);
          constraintsKeys.forEach((cKey) => {
            errorsForResponse.push({
              message: e.constraints![cKey],
              field: e.property,
            });
          });
        });
        throw new BadRequestException(errorsForResponse);
      },
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.init();
  await agent.delete(testingAllDataURI);

  return {
    app: app,
    agent: agent,
  };
};
