// import { SuperAgentTest } from 'supertest';
// import { INestApplication } from '@nestjs/common';
// import {
//   saUsersURI,
//   user01Email,
//   user01Login,
//   user02Email,
//   user02Login,
//   user03Email,
//   user03Login,
//   user04Email,
//   user04Login,
//   userPassword,
// } from '../utils/constants/users.constants';
// import {
//   basicAuthLogin,
//   basicAuthPassword,
//   publicLoginUri,
// } from '../utils/constants/auth.constants';
// import { getAppAndClearDb } from '../utils/functions/get-app';
// import {
//   correctAnswer01,
//   publicAnswersURI,
//   publicCurrentGameURI,
//   publicGameConnectionURI,
//   publicGameURI,
//   publicMyGames,
//   publicMyStats,
//   questionBody,
//   saQuestionsPublishURI,
//   saQuestionsURI,
// } from '../utils/constants/quiz.constants';
// import { randomUUID } from 'crypto';
// import {
//   createdGameObject,
//   startedGameObject,
// } from '../utils/objects/quiz.objects';
// import { answersFinder } from '../utils/functions/answers-finder';
// import { invalidURI } from '../utils/constants/common.constants';
// import { IsCorrectAnswer } from '../../src/quiz-game/domain/quiz-answers.entity';
// import { GameStatus } from '../../src/quiz-game/domain/quiz-game.entity';

import { publicCurrentGameURI } from '../utils/constants/quiz.constants';

// describe('Public quiz testing', () => {
//   let app: INestApplication;
//   let agent;

//   beforeAll(async () => {
//     const data = await getAppAndClearDb();
//     app = data.app;
//     agent = data.agent;
//   });

//   let game01Id;
//   let game02Id;
//   let game03Id;
//   let game04Id;

//   let aTokenUser01;
//   let aTokenUser02;
//   let aTokenUser03;
//   let aTokenUser04;

//   let gameQuestion01Id;
//   let gameQuestion02Id;
//   let gameQuestion03Id;
//   let gameQuestion04Id;
//   let gameQuestion05Id;

//   let answers01;
//   let answers02;
//   let answers03;
//   let answers04;
//   let answers05;

//   let gameObject;

//   describe('03 Game create and connect operations', () => {
//     // Success
//     it(`should create new game with pending user 04`, async () => {
//       const response = await agent
//         .post(publicGameConnectionURI)
//         .auth(aTokenUser03, { type: 'bearer' })
//         .expect(200);

//       createdGameObject.firstPlayerProgress.player.login = user03Login;
//       expect(response.body).toEqual(createdGameObject);

//       game03Id = response.body.id;

//       return response;
//     });
//     it(`should connect user 04 and start the game`, async () => {
//       const response = await agent
//         .post(publicGameConnectionURI)
//         .auth(aTokenUser04, { type: 'bearer' })
//         .expect(200);

//       startedGameObject.firstPlayerProgress.player.login = user03Login;
//       startedGameObject.secondPlayerProgress.player.login = user04Login;
//       expect(response.body).toEqual(startedGameObject);

//       game03Id = response.body.id;

//       return response;
//     });
//   });
//   describe('03 Answers operations', () => {
//     // Success
//     it(`should get questions and answers`, async () => {
//       // Get current game
//       const game = await agent
//         .get(publicCurrentGameURI)
//         .auth(aTokenUser03, { type: 'bearer' })
//         .expect(200);

//       // Get game question IDs
//       gameQuestion01Id = game.body.questions[0].id;
//       gameQuestion02Id = game.body.questions[1].id;
//       gameQuestion03Id = game.body.questions[2].id;
//       gameQuestion04Id = game.body.questions[3].id;
//       gameQuestion05Id = game.body.questions[4].id;

//       // Get questions by admin to get answers
//       const adminQuestions = await agent
//         .get(saQuestionsURI)
//         .auth(basicAuthLogin, basicAuthPassword)
//         .expect(200);

//       // Get answers to game questions and check publish statuses
//       answers01 = answersFinder(adminQuestions, gameQuestion01Id);
//       answers02 = answersFinder(adminQuestions, gameQuestion02Id);
//       answers03 = answersFinder(adminQuestions, gameQuestion03Id);
//       answers04 = answersFinder(adminQuestions, gameQuestion04Id);
//       answers05 = answersFinder(adminQuestions, gameQuestion05Id);

//       // Check answers arrays
//       expect(answers01.length).toBeGreaterThan(0);
//       expect(answers02.length).toBeGreaterThan(0);
//       expect(answers03.length).toBeGreaterThan(0);
//       expect(answers04.length).toBeGreaterThan(0);
//       expect(answers05.length).toBeGreaterThan(0);
//     });
//     it(`should answer [question 01] by user 03 (INCORRECT) and user 04 (INCORRECT)`, async () => {
//       const response01 = await agent
//         .post(publicAnswersURI)
//         .auth(aTokenUser03, { type: 'bearer' })
//         .send({
//           answer: randomUUID(),
//         })
//         .expect(200);

//       expect(response01.body).toEqual({
//         questionId: gameQuestion01Id,
//         answerStatus: IsCorrectAnswer.Incorrect,
//         addedAt: expect.any(String),
//       });

//       const response02 = await agent
//         .post(publicAnswersURI)
//         .auth(aTokenUser04, { type: 'bearer' })
//         .send({
//           answer: randomUUID(),
//         })
//         .expect(200);

//       expect(response02.body).toEqual({
//         questionId: gameQuestion01Id,
//         answerStatus: IsCorrectAnswer.Incorrect,
//         addedAt: expect.any(String),
//       });
//     });
//     it(`should return started current game for user 03`, async () => {
//       const response = await agent
//         .get(publicCurrentGameURI)
//         .auth(aTokenUser03, { type: 'bearer' })
//         .expect(200);

//       gameObject = {
//         id: game03Id,
//         firstPlayerProgress: {
//           answers: [
//             {
//               addedAt: expect.any(String),
//               answerStatus: IsCorrectAnswer.Incorrect,
//               questionId: gameQuestion01Id,
//             },
//           ],
//           player: {
//             id: expect.any(String),
//             login: user03Login,
//           },
//           score: 0,
//         },
//         secondPlayerProgress: {
//           answers: [
//             {
//               addedAt: expect.any(String),
//               answerStatus: IsCorrectAnswer.Incorrect,
//               questionId: gameQuestion01Id,
//             },
//           ],
//           player: {
//             id: expect.any(String),
//             login: user04Login,
//           },
//           score: 0,
//         },
//         questions: [
//           {
//             id: gameQuestion01Id,
//             body: expect.any(String),
//           },
//           {
//             id: gameQuestion02Id,
//             body: expect.any(String),
//           },
//           {
//             id: gameQuestion03Id,
//             body: expect.any(String),
//           },
//           {
//             id: gameQuestion04Id,
//             body: expect.any(String),
//           },
//           {
//             id: gameQuestion05Id,
//             body: expect.any(String),
//           },
//         ],
//         status: GameStatus.Active,
//         pairCreatedDate: expect.any(String),
//         startGameDate: expect.any(String),
//         finishGameDate: null,
//       };

//       expect(response.body).toEqual(gameObject);
//       return response;
//     });
//     it(`should answer [question 02] by user 03 (INCORRECT) and user 04 (INCORRECT)`, async () => {
//       const response01 = await agent
//         .post(publicAnswersURI)
//         .auth(aTokenUser03, { type: 'bearer' })
//         .send({
//           answer: randomUUID(),
//         })
//         .expect(200);

//       expect(response01.body).toEqual({
//         questionId: gameQuestion02Id,
//         answerStatus: IsCorrectAnswer.Incorrect,
//         addedAt: expect.any(String),
//       });

//       const response02 = await agent
//         .post(publicAnswersURI)
//         .auth(aTokenUser04, { type: 'bearer' })
//         .send({
//           answer: randomUUID(),
//         })
//         .expect(200);

//       expect(response02.body).toEqual({
//         questionId: gameQuestion02Id,
//         answerStatus: IsCorrectAnswer.Incorrect,
//         addedAt: expect.any(String),
//       });
//     });
//     it(`should answer [question 03] by user 03 (INCORRECT) and user 04 (INCORRECT)`, async () => {
//       const response01 = await agent
//         .post(publicAnswersURI)
//         .auth(aTokenUser03, { type: 'bearer' })
//         .send({
//           answer: randomUUID(),
//         })
//         .expect(200);

//       expect(response01.body).toEqual({
//         questionId: gameQuestion03Id,
//         answerStatus: IsCorrectAnswer.Incorrect,
//         addedAt: expect.any(String),
//       });

//       const response02 = await agent
//         .post(publicAnswersURI)
//         .auth(aTokenUser04, { type: 'bearer' })
//         .send({
//           answer: randomUUID(),
//         })
//         .expect(200);

//       expect(response02.body).toEqual({
//         questionId: gameQuestion03Id,
//         answerStatus: IsCorrectAnswer.Incorrect,
//         addedAt: expect.any(String),
//       });
//     });
//     it(`should answer [question 04] by user 03 (INCORRECT) and user 04 (INCORRECT)`, async () => {
//       const response01 = await agent
//         .post(publicAnswersURI)
//         .auth(aTokenUser03, { type: 'bearer' })
//         .send({
//           answer: randomUUID(),
//         })
//         .expect(200);

//       expect(response01.body).toEqual({
//         questionId: gameQuestion04Id,
//         answerStatus: IsCorrectAnswer.Incorrect,
//         addedAt: expect.any(String),
//       });

//       const response02 = await agent
//         .post(publicAnswersURI)
//         .auth(aTokenUser04, { type: 'bearer' })
//         .send({
//           answer: randomUUID(),
//         })
//         .expect(200);

//       expect(response02.body).toEqual({
//         questionId: gameQuestion04Id,
//         answerStatus: IsCorrectAnswer.Incorrect,
//         addedAt: expect.any(String),
//       });
//     });
//   });
//   describe('03 Get game and finish operations', () => {
//     // Success
//     it(`should answer [question 05] by user 03 (INCORRECT)`, async () => {
//       const response = await agent
//         .post(publicAnswersURI)
//         .auth(aTokenUser03, { type: 'bearer' })
//         .send({
//           answer: randomUUID(),
//         })
//         .expect(200);

//       expect(response.body).toEqual({
//         questionId: gameQuestion05Id,
//         answerStatus: IsCorrectAnswer.Incorrect,
//         addedAt: expect.any(String),
//       });
//     });
//     it(`should return started current game for user 03`, async () => {
//       const response = await agent
//         .get(publicCurrentGameURI)
//         .auth(aTokenUser03, { type: 'bearer' })
//         .expect(200);

//       gameObject = {
//         id: game03Id,
//         firstPlayerProgress: {
//           answers: [
//             {
//               addedAt: expect.any(String),
//               answerStatus: IsCorrectAnswer.Incorrect,
//               questionId: gameQuestion01Id,
//             },
//             {
//               addedAt: expect.any(String),
//               answerStatus: IsCorrectAnswer.Incorrect,
//               questionId: gameQuestion02Id,
//             },
//             {
//               addedAt: expect.any(String),
//               answerStatus: IsCorrectAnswer.Incorrect,
//               questionId: gameQuestion03Id,
//             },
//             {
//               addedAt: expect.any(String),
//               answerStatus: IsCorrectAnswer.Incorrect,
//               questionId: gameQuestion04Id,
//             },
//             {
//               addedAt: expect.any(String),
//               answerStatus: IsCorrectAnswer.Incorrect,
//               questionId: gameQuestion05Id,
//             },
//           ],
//           player: {
//             id: expect.any(String),
//             login: user03Login,
//           },
//           score: 0,
//         },
//         secondPlayerProgress: {
//           answers: [
//             {
//               addedAt: expect.any(String),
//               answerStatus: IsCorrectAnswer.Incorrect,
//               questionId: gameQuestion01Id,
//             },
//             {
//               addedAt: expect.any(String),
//               answerStatus: IsCorrectAnswer.Incorrect,
//               questionId: gameQuestion02Id,
//             },
//             {
//               addedAt: expect.any(String),
//               answerStatus: IsCorrectAnswer.Incorrect,
//               questionId: gameQuestion03Id,
//             },
//             {
//               addedAt: expect.any(String),
//               answerStatus: IsCorrectAnswer.Incorrect,
//               questionId: gameQuestion04Id,
//             },
//           ],
//           player: {
//             id: expect.any(String),
//             login: user04Login,
//           },
//           score: 0,
//         },
//         questions: [
//           {
//             id: gameQuestion01Id,
//             body: expect.any(String),
//           },
//           {
//             id: gameQuestion02Id,
//             body: expect.any(String),
//           },
//           {
//             id: gameQuestion03Id,
//             body: expect.any(String),
//           },
//           {
//             id: gameQuestion04Id,
//             body: expect.any(String),
//           },
//           {
//             id: gameQuestion05Id,
//             body: expect.any(String),
//           },
//         ],
//         status: GameStatus.Active,
//         pairCreatedDate: expect.any(String),
//         startGameDate: expect.any(String),
//         finishGameDate: null,
//       };

//       expect(response.body).toEqual(gameObject);
//       return response;
//     });
//     it(`should return started current game for user 04`, async () => {
//       const response = await agent
//         .get(publicCurrentGameURI)
//         .auth(aTokenUser04, { type: 'bearer' })
//         .expect(200);
//       expect(response.body).toEqual(gameObject);
//       return response;
//     });
//     it(`should answer [question 05] by user 04 (CORRECT) and finish game`, async () => {
//       const response = await agent
//         .post(publicAnswersURI)
//         .auth(aTokenUser04, { type: 'bearer' })
//         .send({
//           answer: answers05[0],
//         })
//         .expect(200);

//       expect(response.body).toEqual({
//         questionId: gameQuestion05Id,
//         answerStatus: IsCorrectAnswer.Correct,
//         addedAt: expect.any(String),
//       });
//     });
//   });
//   describe('04 Get game by ID operations', () => {
//     // Success
//     it(`should return finished game by id for user 03`, async () => {
//       const response = await agent
//         .get(publicGameURI + game03Id)
//         .auth(aTokenUser03, { type: 'bearer' })
//         .expect(200);

//       gameObject.secondPlayerProgress.score = 1;
//       gameObject.secondPlayerProgress.answers[4] = {
//         addedAt: expect.any(String),
//         answerStatus: IsCorrectAnswer.Correct,
//         questionId: gameQuestion05Id,
//       };
//       gameObject.status = GameStatus.Finished;
//       gameObject.finishGameDate = response.body.finishGameDate;

//       expect(response.body).toEqual(gameObject);
//       return response;
//     });
//     it(`should return finished game by id for user 04`, async () => {
//       const response = await agent
//         .get(publicGameURI + game03Id)
//         .auth(aTokenUser04, { type: 'bearer' })
//         .expect(200);
//       expect(response.body).toEqual(gameObject);
//       return response;
//     });
//   });

//   describe('04 Game create and connect operations', () => {
//     // Success
//     it(`should create new game with pending user 04`, async () => {
//       const response = await agent
//         .post(publicGameConnectionURI)
//         .auth(aTokenUser03, { type: 'bearer' })
//         .expect(200);

//       expect(response.body).toEqual(createdGameObject);

//       game04Id = response.body.id;

//       return response;
//     });
//     it(`should connect user 04 and start the game`, async () => {
//       const response = await agent
//         .post(publicGameConnectionURI)
//         .auth(aTokenUser04, { type: 'bearer' })
//         .expect(200);

//       expect(response.body).toEqual(startedGameObject);
//       return response;
//     });
//   });
//   describe('04 Answers operations', () => {
//     // Success
//     it(`should get questions and answers`, async () => {
//       // Get current game
//       const game = await agent
//         .get(publicCurrentGameURI)
//         .auth(aTokenUser03, { type: 'bearer' })
//         .expect(200);

//       // Get game question IDs
//       gameQuestion01Id = game.body.questions[0].id;
//       gameQuestion02Id = game.body.questions[1].id;
//       gameQuestion03Id = game.body.questions[2].id;
//       gameQuestion04Id = game.body.questions[3].id;
//       gameQuestion05Id = game.body.questions[4].id;

//       // Get questions by admin to get answers
//       const adminQuestions = await agent
//         .get(saQuestionsURI)
//         .auth(basicAuthLogin, basicAuthPassword)
//         .expect(200);

//       // Get answers to game questions and check publish statuses
//       answers01 = answersFinder(adminQuestions, gameQuestion01Id);
//       answers02 = answersFinder(adminQuestions, gameQuestion02Id);
//       answers03 = answersFinder(adminQuestions, gameQuestion03Id);
//       answers04 = answersFinder(adminQuestions, gameQuestion04Id);
//       answers05 = answersFinder(adminQuestions, gameQuestion05Id);

//       // Check answers arrays
//       expect(answers01.length).toBeGreaterThan(0);
//       expect(answers02.length).toBeGreaterThan(0);
//       expect(answers03.length).toBeGreaterThan(0);
//       expect(answers04.length).toBeGreaterThan(0);
//       expect(answers05.length).toBeGreaterThan(0);
//     });
//     it(`should answer [question 01] by user 03 (CORRECT) and user 04 (INCORRECT)`, async () => {
//       const response01 = await agent
//         .post(publicAnswersURI)
//         .auth(aTokenUser03, { type: 'bearer' })
//         .send({
//           answer: answers01[0],
//         })
//         .expect(200);

//       expect(response01.body).toEqual({
//         questionId: gameQuestion01Id,
//         answerStatus: IsCorrectAnswer.Correct,
//         addedAt: expect.any(String),
//       });

//       const response02 = await agent
//         .post(publicAnswersURI)
//         .auth(aTokenUser04, { type: 'bearer' })
//         .send({
//           answer: randomUUID(),
//         })
//         .expect(200);

//       expect(response02.body).toEqual({
//         questionId: gameQuestion01Id,
//         answerStatus: IsCorrectAnswer.Incorrect,
//         addedAt: expect.any(String),
//       });
//     });
//     it(`should return started current game for user 03`, async () => {
//       const response = await agent
//         .get(publicCurrentGameURI)
//         .auth(aTokenUser03, { type: 'bearer' })
//         .expect(200);

//       gameObject = {
//         id: game04Id,
//         firstPlayerProgress: {
//           answers: [
//             {
//               addedAt: expect.any(String),
//               answerStatus: IsCorrectAnswer.Correct,
//               questionId: gameQuestion01Id,
//             },
//           ],
//           player: {
//             id: expect.any(String),
//             login: user03Login,
//           },
//           score: 1,
//         },
//         secondPlayerProgress: {
//           answers: [
//             {
//               addedAt: expect.any(String),
//               answerStatus: IsCorrectAnswer.Incorrect,
//               questionId: gameQuestion01Id,
//             },
//           ],
//           player: {
//             id: expect.any(String),
//             login: user04Login,
//           },
//           score: 0,
//         },
//         questions: [
//           {
//             id: gameQuestion01Id,
//             body: expect.any(String),
//           },
//           {
//             id: gameQuestion02Id,
//             body: expect.any(String),
//           },
//           {
//             id: gameQuestion03Id,
//             body: expect.any(String),
//           },
//           {
//             id: gameQuestion04Id,
//             body: expect.any(String),
//           },
//           {
//             id: gameQuestion05Id,
//             body: expect.any(String),
//           },
//         ],
//         status: GameStatus.Active,
//         pairCreatedDate: expect.any(String),
//         startGameDate: expect.any(String),
//         finishGameDate: null,
//       };

//       expect(response.body).toEqual(gameObject);
//       return response;
//     });
//     it(`should return started current game for user 04`, async () => {
//       const response = await agent
//         .get(publicCurrentGameURI)
//         .auth(aTokenUser04, { type: 'bearer' })
//         .expect(200);
//       expect(response.body).toEqual(gameObject);
//       return response;
//     });
//     it(`should return game by id for user 03`, async () => {
//       const response = await agent
//         .get(publicGameURI + game04Id)
//         .auth(aTokenUser03, { type: 'bearer' })
//         .expect(200);

//       expect(response.body).toEqual(gameObject);
//       return response;
//     });
//     it(`should return game by id for user 04`, async () => {
//       const response = await agent
//         .get(publicGameURI + game04Id)
//         .auth(aTokenUser04, { type: 'bearer' })
//         .expect(200);
//       expect(response.body).toEqual(gameObject);
//       return response;
//     });
//   });

//   describe('05 Game create and connect operations', () => {
//     // Success
//     it(`should create new game with pending user 02`, async () => {
//       const response = await agent
//         .post(publicGameConnectionURI)
//         .auth(aTokenUser01, { type: 'bearer' })
//         .expect(200);

//       createdGameObject.firstPlayerProgress.player.login = user01Login;
//       expect(response.body).toEqual(createdGameObject);

//       return response;
//     });
//     it(`should connect user 02 and start the game`, async () => {
//       const response = await agent
//         .post(publicGameConnectionURI)
//         .auth(aTokenUser02, { type: 'bearer' })
//         .expect(200);

//       startedGameObject.firstPlayerProgress.player.login = user01Login;
//       startedGameObject.secondPlayerProgress.player.login = user02Login;
//       expect(response.body).toEqual(startedGameObject);
//       return response;
//     });
//   });
//   describe('05 Answers operations', () => {
//     // Success
//     it(`should get questions and answers`, async () => {
//       // Get current game
//       const game = await agent
//         .get(publicCurrentGameURI)
//         .auth(aTokenUser01, { type: 'bearer' })
//         .expect(200);

//       // Get game question IDs
//       gameQuestion01Id = game.body.questions[0].id;
//       gameQuestion02Id = game.body.questions[1].id;
//       gameQuestion03Id = game.body.questions[2].id;
//       gameQuestion04Id = game.body.questions[3].id;
//       gameQuestion05Id = game.body.questions[4].id;

//       // Get questions by admin to get answers
//       const adminQuestions = await agent
//         .get(saQuestionsURI)
//         .auth(basicAuthLogin, basicAuthPassword)
//         .expect(200);

//       // Get answers to game questions and check publish statuses
//       answers01 = answersFinder(adminQuestions, gameQuestion01Id);
//       answers02 = answersFinder(adminQuestions, gameQuestion02Id);
//       answers03 = answersFinder(adminQuestions, gameQuestion03Id);
//       answers04 = answersFinder(adminQuestions, gameQuestion04Id);
//       answers05 = answersFinder(adminQuestions, gameQuestion05Id);

//       // Check answers arrays
//       expect(answers01.length).toBeGreaterThan(0);
//       expect(answers02.length).toBeGreaterThan(0);
//       expect(answers03.length).toBeGreaterThan(0);
//       expect(answers04.length).toBeGreaterThan(0);
//       expect(answers05.length).toBeGreaterThan(0);
//     });
//     it(`should answer [question 01] by user 01 (CORRECT) and user 02 (INCORRECT)`, async () => {
//       const response01 = await agent
//         .post(publicAnswersURI)
//         .auth(aTokenUser01, { type: 'bearer' })
//         .send({
//           answer: answers01[0],
//         })
//         .expect(200);

//       expect(response01.body).toEqual({
//         questionId: gameQuestion01Id,
//         answerStatus: IsCorrectAnswer.Correct,
//         addedAt: expect.any(String),
//       });

//       const response02 = await agent
//         .post(publicAnswersURI)
//         .auth(aTokenUser02, { type: 'bearer' })
//         .send({
//           answer: randomUUID(),
//         })
//         .expect(200);

//       expect(response02.body).toEqual({
//         questionId: gameQuestion01Id,
//         answerStatus: IsCorrectAnswer.Incorrect,
//         addedAt: expect.any(String),
//       });
//     });
//   });

//   describe('Games sorting and pagination', () => {
//     it(`should sort games by pair created date (desc)`, async () => {
//       const response = await agent
//         .get(publicMyGames)
//         .auth(aTokenUser01, { type: 'bearer' })
//         .expect(200);

//       expect(response.body.items).toHaveLength(3);
//     });
//   });

//   describe('Games statistics', () => {
//     it(`should return correct stats for user 01`, async () => {
//       const response = await agent
//         .get(publicMyStats)
//         .auth(aTokenUser01, { type: 'bearer' })
//         .expect(200);

//       expect(response.body.sumScore).toBe(9);
//       expect(response.body.avgScores).toBe(3);
//       expect(response.body.gamesCount).toBe(3);
//       expect(response.body.winsCount).toBe(3);
//       expect(response.body.lossesCount).toBe(0);
//       expect(response.body.drawsCount).toBe(0);
//     });
//     it(`should return correct stats for user 02`, async () => {
//       const response = await agent
//         .get(publicMyStats)
//         .auth(aTokenUser02, { type: 'bearer' })
//         .expect(200);

//       expect(response.body.sumScore).toBe(4);
//       expect(response.body.avgScores).toBe(1.33);
//       expect(response.body.gamesCount).toBe(3);
//       expect(response.body.winsCount).toBe(0);
//       expect(response.body.lossesCount).toBe(3);
//       expect(response.body.drawsCount).toBe(0);
//     });
//     it(`should return correct stats for user 03`, async () => {
//       const response = await agent
//         .get(publicMyStats)
//         .auth(aTokenUser03, { type: 'bearer' })
//         .expect(200);

//       expect(response.body.sumScore).toBe(1);
//       expect(response.body.avgScores).toBe(0.5);
//       expect(response.body.gamesCount).toBe(2);
//       expect(response.body.winsCount).toBe(1);
//       expect(response.body.lossesCount).toBe(1);
//       expect(response.body.drawsCount).toBe(0);
//     });
//     it(`should return correct stats for user 04`, async () => {
//       const response = await agent
//         .get(publicMyStats)
//         .auth(aTokenUser04, { type: 'bearer' })
//         .expect(200);

//       expect(response.body.sumScore).toBe(1);
//       expect(response.body.avgScores).toBe(0.5);
//       expect(response.body.gamesCount).toBe(2);
//       expect(response.body.winsCount).toBe(1);
//       expect(response.body.lossesCount).toBe(1);
//       expect(response.body.drawsCount).toBe(0);
//     });
//   });

//   afterAll(async () => {
//     await app.close();
//   });
// });
