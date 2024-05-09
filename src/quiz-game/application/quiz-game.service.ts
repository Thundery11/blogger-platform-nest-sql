import { ForbiddenException, Injectable } from '@nestjs/common';
import { MyStatus } from '../../features/likes/domain/likes.entity';
import { Game, GameStatus } from '../domain/quiz-game.entity';
import { QuizGameRepository } from '../infrastructure/quiiz-game.repository';
import { PlayerProgress } from '../domain/player-progress.entity';
import { QuizGameQueryRepository } from '../infrastructure/quiz-game-query.repository';
import { AnswerDto } from '../api/models/input/quiz-game.input.model';
import { Answers, IsCorrectAnswer } from '../domain/quiz-answers.entity';

@Injectable()
export class QuizGameService {
  constructor(
    private quizGameRepository: QuizGameRepository,
    private quizGameQueryRepository: QuizGameQueryRepository,
  ) {}

  async connectToTheGame(currentUserId: number) {
    const isGameWithPandingPlayerExist =
      await this.quizGameRepository.isGameWithPandingPlayerExist();

    const isUserAlreadyInGame =
      await this.quizGameQueryRepository.isUserAlreadyInGame(currentUserId);

    if (isUserAlreadyInGame) {
      throw new ForbiddenException('u are allready in game');
    }

    if (!isGameWithPandingPlayerExist) {
      const firstPlayerProgress = new PlayerProgress();
      firstPlayerProgress.playerId = currentUserId;
      firstPlayerProgress.score = 0;
      const addFirstplayerToDb =
        await this.quizGameRepository.addPlayerToTheGame(firstPlayerProgress);

      const firstPlayer = await this.quizGameRepository.getPlayer(
        addFirstplayerToDb.playerId,
      );

      const newGame = Game.createGame(firstPlayer);

      return await this.quizGameRepository.startGame(newGame);
    } else if (isGameWithPandingPlayerExist) {
      const secondPlayerProgress = PlayerProgress.addPlayer(currentUserId);
      const addSecondPlayerToDb =
        await this.quizGameRepository.addPlayerToTheGame(secondPlayerProgress);

      const secondPlayer = await this.quizGameRepository.getPlayer(
        addSecondPlayerToDb.playerId,
      );

      const gameId = isGameWithPandingPlayerExist!.id;
      const quizQuestion = await this.quizGameRepository.getQuizQuestions();
      console.log(
        '🚀 ~ QuizGameService ~ connectToTheGame ~ quizQuestion:',
        quizQuestion,
      );

      const startGameDate = new Date().toISOString();
      const status = GameStatus.Active;

      const addSecondPlayerToTheGame =
        await this.quizGameRepository.addSecondPlayerToTheGame(
          secondPlayer,
          startGameDate,
          status,
          quizQuestion,
        );
      if (addSecondPlayerToTheGame) {
        return await this.quizGameQueryRepository.findGame(gameId);
      }
      return addSecondPlayerToTheGame;
    }
  }

  async addAnswer(
    answerDto: AnswerDto,
    playerProgressId: number,
    currentUserId: number,
  ) {
    const answer = new Answers();
    const addedAt = new Date().toISOString();
    const allPossibleQuestionsFromGame =
      await this.quizGameRepository.getCurrentQuestionToAnswerOnIt(
        playerProgressId,
      );
    const whatAnswerAddingNow =
      await this.quizGameRepository.whatAnswerAddingNow(playerProgressId);

    const answerCount = whatAnswerAddingNow!.answers.length;
    if (answerCount === 5) {
      throw new ForbiddenException();
    }
    const questionIndex = Math.min(answerCount, 4); // Limiting the question index to 4

    const question = allPossibleQuestionsFromGame!.questions[questionIndex];
    const IsItCorrectAnswer = question?.correctAnswers.some(
      (q) => q === answerDto.answer,
    );

    let answerStatus;
    if (IsItCorrectAnswer === true) {
      answerStatus = IsCorrectAnswer.Correct;
    } else {
      answerStatus = IsCorrectAnswer.Incorrect;
    }

    const questionId = question!.id;
    answer.questionId = questionId;
    answer.playerProgressId = playerProgressId;
    answer.answerStatus = answerStatus;
    answer.addedAt = addedAt;

    const addAnswerToDb = await this.quizGameRepository.addAnswerToDb(answer);
    console.log('🚀 ~ QuizGameService ~ addAnswerToDb:', addAnswerToDb);

    // НУЖНО БУДЕТ ОБНОВИТЬ SCORE
  }

  //   async addAnswer(
  //     answerDto: AnswerDto,
  //     playerProgressId: number,
  //     currentUserId: number,
  //   ) {
  //     const answer = new Answers();
  //     let answerStatus;
  //     const addedAt = new Date().toISOString();
  //     const allPossibleQuestionsFromGame =
  //       await this.quizGameRepository.getCurrentQuestionToAnswerOnIt(
  //         playerProgressId,
  //       );
  //     const whatAnswerAddingNow =
  //       await this.quizGameRepository.whatAnswerAddingNow(playerProgressId);

  //     if (whatAnswerAddingNow!.answers.length === 0) {
  //       const question = allPossibleQuestionsFromGame!.questions[0];
  //       const IsItCorrectAnswer = question?.correctAnswers.some(
  //         (q) => q === answerDto.answer,
  //       );
  //       if (IsItCorrectAnswer === true) {
  //         answerStatus = IsCorrectAnswer.Correct;
  //       } else {
  //         answerStatus = IsCorrectAnswer.Incorrect;
  //       }
  //       const questionId = question!.id;
  //       answer.questionId = questionId;
  //       answer.playerProgressId = playerProgressId;
  //       answer.answerStatus = answerStatus;
  //       answer.addedAt = addedAt;
  //       const addAnswerToDb = await this.quizGameRepository.addAnswerToDb(answer);
  //       console.log('🚀 ~ QuizGameService ~ addAnswerToDb:', addAnswerToDb);

  //       //НУЖНО БУДЕТ ОБНОВИТЬ SCORE
  //     } else if (whatAnswerAddingNow?.answers.length === 1) {
  //       const question = allPossibleQuestionsFromGame!.questions[1];
  //       const IsItCorrectAnswer = question?.correctAnswers.some(
  //         (q) => q === answerDto.answer,
  //       );
  //       if (IsItCorrectAnswer === true) {
  //         answerStatus = IsCorrectAnswer.Correct;
  //       } else {
  //         answerStatus = IsCorrectAnswer.Incorrect;
  //       }
  //       const questionId = question!.id;
  //       answer.questionId = questionId;
  //       answer.playerProgressId = playerProgressId;
  //       answer.answerStatus = answerStatus;
  //       answer.addedAt = addedAt;
  //       const addAnswerToDb = await this.quizGameRepository.addAnswerToDb(answer);
  //       console.log('🚀 ~ QuizGameService ~ addAnswerToDb:', addAnswerToDb);
  //       //НУЖНО БУДЕТ ОБНОВИТЬ SCORE
  //     } else if (whatAnswerAddingNow?.answers.length === 2) {
  //       const question = allPossibleQuestionsFromGame!.questions[2];
  //       const IsItCorrectAnswer = question?.correctAnswers.some(
  //         (q) => q === answerDto.answer,
  //       );
  //       if (IsItCorrectAnswer === true) {
  //         answerStatus = IsCorrectAnswer.Correct;
  //       } else {
  //         answerStatus = IsCorrectAnswer.Incorrect;
  //       }
  //       const questionId = question!.id;
  //       answer.questionId = questionId;
  //       answer.playerProgressId = playerProgressId;
  //       answer.answerStatus = answerStatus;
  //       answer.addedAt = addedAt;
  //       const addAnswerToDb = await this.quizGameRepository.addAnswerToDb(answer);
  //       console.log('🚀 ~ QuizGameService ~ addAnswerToDb:', addAnswerToDb);
  //       //НУЖНО БУДЕТ ОБНОВИТЬ SCORE
  //     } else if (whatAnswerAddingNow?.answers.length === 3) {
  //       const question = allPossibleQuestionsFromGame!.questions[3];
  //       const IsItCorrectAnswer = question?.correctAnswers.some(
  //         (q) => q === answerDto.answer,
  //       );
  //       if (IsItCorrectAnswer === true) {
  //         answerStatus = IsCorrectAnswer.Correct;
  //       } else {
  //         answerStatus = IsCorrectAnswer.Incorrect;
  //       }
  //       const questionId = question!.id;
  //       answer.questionId = questionId;
  //       answer.playerProgressId = playerProgressId;
  //       answer.answerStatus = answerStatus;
  //       answer.addedAt = addedAt;
  //       const addAnswerToDb = await this.quizGameRepository.addAnswerToDb(answer);
  //       console.log('🚀 ~ QuizGameService ~ addAnswerToDb:', addAnswerToDb);
  //     } else if (whatAnswerAddingNow?.answers.length === 4) {
  //       const question = allPossibleQuestionsFromGame!.questions[4];
  //       const IsItCorrectAnswer = question?.correctAnswers.some(
  //         (q) => q === answerDto.answer,
  //       );
  //       if (IsItCorrectAnswer === true) {
  //         answerStatus = IsCorrectAnswer.Correct;
  //       } else {
  //         answerStatus = IsCorrectAnswer.Incorrect;
  //       }
  //       const questionId = question!.id;
  //       answer.questionId = questionId;
  //       answer.playerProgressId = playerProgressId;
  //       answer.answerStatus = answerStatus;
  //       answer.addedAt = addedAt;
  //       const addAnswerToDb = await this.quizGameRepository.addAnswerToDb(answer);
  //       console.log('🚀 ~ QuizGameService ~ addAnswerToDb:', addAnswerToDb);
  //       //НУЖНО БУДЕТ ОБНОВИТЬ SCORE
  //     } else if (whatAnswerAddingNow?.answers.length === 5) {
  //       throw new ForbiddenException();
  //     }
  //   }
  // }
}
