import { SuperAgentTest } from 'supertest';
import { INestApplication } from '@nestjs/common';
import {
  basicAuthLogin,
  basicAuthPassword,
} from '../utils/constants/auth.constants';
import { exceptionObject } from '../utils/objects/common.objects';
import { randomUUID } from 'crypto';
import {
  questionAnswersField,
  questionBodyField,
} from '../utils/constants/exceptions.constants';
import { getAppAndClearDb } from '../utils/functions/get-app';
import {
  questionBody,
  questionCorrectAnswer01,
  questionCorrectAnswer02,
  questionCorrectAnswer03,
  questionCorrectAnswerNumeric,
  questionUpdatedBody,
  saQuestionsPublishURI,
  saQuestionsURI,
} from '../utils/constants/quiz.constants';
import { longString508 } from '../utils/constants/common.constants';
import {
  questionCreatedObject,
  questionUpdatedObject,
} from '../utils/objects/quiz.objects';

describe('Super admin quiz questions testing', () => {
  let app: INestApplication;
  // let agent: SuperAgentTest;
  let agent;
  beforeAll(async () => {
    const data = await getAppAndClearDb();
    app = data.app;
    agent = data.agent;
  });

  let questionId;

  describe('Create question', () => {
    //Validation errors[400]
    it(`Should return 400 when trying to create question without body`, async () => {
      const response = await agent
        .post(saQuestionsURI)
        .auth(basicAuthLogin, basicAuthPassword)
        .send({
          correctAnswers: [
            questionCorrectAnswer01,
            questionCorrectAnswer01,
            questionCorrectAnswer03,
          ],
        })
        .expect(400);
      expect(response.body).toEqual(exceptionObject(questionBodyField));
    });

    it(`Should return 400 when body has incorrect format`, async () => {
      const response = await agent
        .post(saQuestionsURI)
        .auth(basicAuthLogin, basicAuthPassword)
        .send({
          body: 123,
          correctAnswers: [
            questionCorrectAnswer01,
            questionCorrectAnswer02,
            questionCorrectAnswer03,
          ],
        })
        .expect(400);
      expect(response.body).toEqual(exceptionObject(questionBodyField));
    });

    it(`should return 400, when trying to create question with incorrect body length`, async () => {
      const response = await agent
        .post(saQuestionsURI)
        .auth(basicAuthLogin, basicAuthPassword)
        .send({
          body: longString508,
          correctAnswers: [
            questionCorrectAnswer01,
            questionCorrectAnswer02,
            questionCorrectAnswer03,
          ],
        })
        .expect(400);
      expect(response.body).toEqual(exceptionObject(questionBodyField));
    });

    //Auth errors [401]
    it(`Should retun 401 when trying to create question with incorrect password of user`, async () => {
      return agent
        .post(saQuestionsURI)
        .auth(basicAuthLogin, randomUUID())
        .send({
          body: questionBody,
          correctAnswers: [
            questionCorrectAnswer01,
            questionCorrectAnswer02,
            questionCorrectAnswer03,
          ],
        })
        .expect(401);
    });

    //Succes
    it(`should create question`, async () => {
      const response = await agent
        .post(saQuestionsURI)
        .auth(basicAuthLogin, basicAuthPassword)
        .send({
          body: questionBody,
          correctAnswers: [
            questionCorrectAnswer01,
            questionCorrectAnswer02,
            questionCorrectAnswer03,
          ],
        })
        .expect(201);
      expect(response.body).toEqual(questionCreatedObject);
      questionId = response.body.id;
    });
  });
  describe(`Update question`, () => {
    //     // Validation errors [400]

    it(`should return 400, when trying to update question without answers`, async () => {
      const response = await agent
        .put(saQuestionsURI + questionId)
        .auth(basicAuthLogin, basicAuthPassword)
        .send({ body: questionUpdatedBody })
        .expect(400);
      expect(response.body).toEqual(exceptionObject(questionAnswersField));
    });

    it('Shoul return 400 , when trying update question with incorrect answers', async () => {
      const response = await agent
        .put(saQuestionsURI + questionId)
        .auth(basicAuthLogin, basicAuthPassword)
        .send({
          body: questionUpdatedBody,
          correctAnsers: 123,
        })
        .expect(400);
      expect(response.body).toEqual(exceptionObject(questionAnswersField));
    });

    // Auth errors [401]

    it(`Should retun 401 when trying to update question with incorrect password of user`, async () => {
      return agent
        .put(saQuestionsURI + questionId)
        .auth(basicAuthLogin, randomUUID())
        .send({
          body: questionUpdatedBody,
          correctAnswers: [
            questionCorrectAnswer01,
            questionCorrectAnswer02,
            questionCorrectAnswer03,
          ],
        })
        .expect(401);
    });

    // Not found errors [404]

    it('Should return 404 , when trying to update not exist question', async () => {
      return agent
        .put(saQuestionsURI + randomUUID())
        .auth(basicAuthLogin, basicAuthPassword)
        .send({
          body: questionUpdatedBody,
          correctAnswers: [
            questionCorrectAnswer01,
            questionCorrectAnswer02,
            questionCorrectAnswer03,
          ],
        })
        .expect(400);
    });
    //Succes

    it('Should update question by Id', async () => {
      await agent
        .put(saQuestionsURI + questionId)
        .auth(basicAuthLogin, basicAuthPassword)
        .send({
          body: questionUpdatedBody,
          correctAnswers: [
            questionCorrectAnswer01,
            questionCorrectAnswer02,
            questionCorrectAnswer03,
            questionCorrectAnswerNumeric,
          ],
        })
        .expect(204);
      const check = await agent
        .get(saQuestionsURI)
        .auth(basicAuthLogin, basicAuthPassword)
        .expect(200);
      expect(check.body.items[0]).toEqual(questionUpdatedObject);
    });
    it('Should update publish status', async () => {
      await agent
        .put(saQuestionsURI + questionId + saQuestionsPublishURI)
        .auth(basicAuthLogin, basicAuthPassword)
        .send({ published: true })
        .expect(204);
      const check = await agent
        .get(saQuestionsURI)
        .auth(basicAuthLogin, basicAuthPassword)
        .expect(200);
      expect(check.body.items[0].published).toBeTruthy();
    });
  });
  describe('Delete question', () => {
    // Auth errors [401]

    it('Should return 401 when trying delete question with incorrect auth', async () => {
      return agent
        .delete(saQuestionsURI + questionId)
        .auth(basicAuthLogin, randomUUID())
        .expect(401);
    });

    // Not found errors [404]

    it('Should return 404 if trying to delete not exist question', async () => {
      await agent
        .delete(saQuestionsURI + randomUUID())
        .auth(basicAuthLogin, basicAuthPassword)
        .expect(400);
    });

    //Success
    it('Should delete question by Id', async () => {
      await agent
        .delete(saQuestionsURI + questionId)
        .auth(basicAuthLogin, basicAuthPassword)
        .expect(204);
      const response = await agent
        .get(saQuestionsURI)
        .auth(basicAuthLogin, basicAuthPassword)
        .expect(200);

      expect(response.body).toEqual({
        pagesCount: 0,
        page: 1,
        pageSize: 10,
        totalCount: 0,
        items: [],
      });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
