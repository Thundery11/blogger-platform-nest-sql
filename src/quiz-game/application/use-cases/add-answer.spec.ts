// import { Test, TestingModule } from '@nestjs/testing';
// import { AddAnswerCommand, AddAnswerUseCase } from './add-answer.use-case';
// import { QuizGameQueryRepository } from '../../infrastructure/quiz-game-query.repository';
// import { ForbiddenException } from '@nestjs/common';
// import { Answers, IsCorrectAnswer } from '../../domain/quiz-answers.entity';
// import { QuizGameRepository } from '../../infrastructure/quiiz-game.repository';

// describe('AddAnswerUseCase', () => {
//   let useCase: AddAnswerUseCase;
//   let quizGameRepository: QuizGameRepository;
//   let quizGameQueryRepository: QuizGameQueryRepository;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         AddAnswerUseCase,
//         {
//           provide: QuizGameRepository,
//           useValue: {
//             getCurrentQuestionToAnswerOnIt: jest.fn(),
//             whatAnswerAddingNow: jest.fn(),
//             addAnswerToDb: jest.fn(),
//             addPlayerScoreToDb: jest.fn(),
//             endTheGame: jest.fn(),
//             finishPlayerProgress: jest.fn(),
//             setStatistcsOfUsers: jest.fn(),
//           },
//         },
//         {
//           provide: QuizGameQueryRepository,
//           useValue: {
//             findNotMappedGameForCurrentUser: jest.fn(),
//             getTotalScore: jest.fn(),
//           },
//         },
//       ],
//     }).compile();

//     useCase = module.get<AddAnswerUseCase>(AddAnswerUseCase);
//     quizGameRepository = module.get<QuizGameRepository>(QuizGameRepository);
//     quizGameQueryRepository = module.get<QuizGameQueryRepository>(
//       QuizGameQueryRepository,
//     );
//   });

//   it('should be defined', () => {
//     expect(useCase).toBeDefined();
//   });

//   it('should throw ForbiddenException if player has answered 5 questions', async () => {
//     jest.spyOn(quizGameRepository, 'whatAnswerAddingNow').mockResolvedValue({
//       answers: new Array(5).fill({}),
//     });

//     const command = new AddAnswerCommand({ answer: 'test' }, 1, 1);
//     await expect(useCase.execute(command)).rejects.toThrow(ForbiddenException);
//   });

//   it('should add correct answer to the database', async () => {
//     jest
//       .spyOn(quizGameRepository, 'getCurrentQuestionToAnswerOnIt')
//       .mockResolvedValue({
//         questions: [
//           { id: 1, correctAnswers: ['test'] },
//           { id: 2, correctAnswers: ['test2'] },
//           { id: 3, correctAnswers: ['test3'] },
//           { id: 4, correctAnswers: ['test4'] },
//           { id: 5, correctAnswers: ['test5'] },
//         ],
//       });
//     jest.spyOn(quizGameRepository, 'whatAnswerAddingNow').mockResolvedValue({
//       answers: new Array(4).fill({}),
//     });
//     jest.spyOn(quizGameRepository, 'addAnswerToDb').mockResolvedValue(true);
//     jest
//       .spyOn(quizGameRepository, 'addPlayerScoreToDb')
//       .mockResolvedValue(true);

//     const command = new AddAnswerCommand({ answer: 'test' }, 1, 1);
//     await useCase.execute(command);

//     expect(quizGameRepository.addAnswerToDb).toHaveBeenCalled();
//     expect(quizGameRepository.addPlayerScoreToDb).toHaveBeenCalledWith(1, 1);
//   });

//   it('should add incorrect answer to the database', async () => {
//     jest
//       .spyOn(quizGameRepository, 'getCurrentQuestionToAnswerOnIt')
//       .mockResolvedValue({
//         questions: [
//           { id: 1, correctAnswers: ['test'] },
//           { id: 2, correctAnswers: ['test2'] },
//           { id: 3, correctAnswers: ['test3'] },
//           { id: 4, correctAnswers: ['test4'] },
//           { id: 5, correctAnswers: ['test5'] },
//         ],
//       });
//     jest.spyOn(quizGameRepository, 'whatAnswerAddingNow').mockResolvedValue({
//       answers: new Array(4).fill({}),
//     });
//     jest.spyOn(quizGameRepository, 'addAnswerToDb').mockResolvedValue(true);
//     jest
//       .spyOn(quizGameRepository, 'addPlayerScoreToDb')
//       .mockResolvedValue(true);

//     const command = new AddAnswerCommand({ answer: 'wrong' }, 1, 1);
//     await useCase.execute(command);

//     expect(quizGameRepository.addAnswerToDb).toHaveBeenCalled();
//     expect(quizGameRepository.addPlayerScoreToDb).toHaveBeenCalledWith(1, 0);
//   });
// });
