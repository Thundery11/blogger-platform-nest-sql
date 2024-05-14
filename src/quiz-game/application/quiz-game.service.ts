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
    gameId: number,
  ) {
    const answer = new Answers();
    const addedAt = new Date().toISOString();
    const allPossibleQuestionsFromGame =
      await this.quizGameRepository.getCurrentQuestionToAnswerOnIt(
        playerProgressId,
      );
    const whatAnswerAddingNow =
      await this.quizGameRepository.whatAnswerAddingNow(playerProgressId);
    console.log(
      '🚀 ~ QuizGameService ~ whatAnswerAddingNow:',
      whatAnswerAddingNow,
    );

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
    let score;
    const finalScorePoint = 1;
    if (IsItCorrectAnswer === true) {
      answerStatus = IsCorrectAnswer.Correct;
      score = 1;
    } else {
      answerStatus = IsCorrectAnswer.Incorrect;
      score = 0;
    }

    const questionId = question!.id;
    answer.questionId = questionId;
    answer.playerProgressId = playerProgressId;
    answer.answerStatus = answerStatus;
    answer.addedAt = addedAt;

    const addAnswerToDb = await this.quizGameRepository.addAnswerToDb(answer);
    const addPlayerScoreToDb = await this.quizGameRepository.addPlayerScoreToDb(
      playerProgressId,
      score,
    );
    console.log(
      '🚀 ~ QuizGameService ~ addPlayerScoreToDb:',
      addPlayerScoreToDb,
    );
    console.log('🚀 ~ QuizGameService ~ addAnswerToDb:', addAnswerToDb);
    const isThatWasLastUnswer =
      await this.quizGameQueryRepository.findNotMappedGameForCurrentUser(
        playerProgressId,
      );
    console.log(
      '🚀 ~ QuizGameService ~ isThatWasLastUnswer:',
      isThatWasLastUnswer,
    );

    const firstPlayerProgressId = isThatWasLastUnswer?.firstPlayerProgress.id;
    console.log(
      '🚀 ~ QuizGameService ~ firstPlayerProgressId:',
      firstPlayerProgressId,
    );
    const secondPlayerProgressId = isThatWasLastUnswer?.secondPlayerProgress.id;
    console.log(
      '🚀 ~ QuizGameService ~ secondPlayerProgressId:',
      secondPlayerProgressId,
    );

    if (
      isThatWasLastUnswer?.firstPlayerProgress.answers.length === 5 &&
      isThatWasLastUnswer?.secondPlayerProgress?.answers.length === 5
    ) {
      let addFinalPointToScore;
      const firstPlayerAnswersCount =
        isThatWasLastUnswer?.firstPlayerProgress.answers[4];
      const doesFirstPlayerHasOneCorrectAnswer =
        isThatWasLastUnswer.firstPlayerProgress.answers.some(
          (a) => a.answerStatus === IsCorrectAnswer.Correct,
        );
      console.log(
        '🚀 ~ QuizGameService ~ doesFirstPlayerHasOneCorrectAnswer:',
        doesFirstPlayerHasOneCorrectAnswer,
      );

      const secondPlayerAnswersCount =
        isThatWasLastUnswer.secondPlayerProgress.answers[4];
      const doesSecondPlayerHasOneCorrectAnswer =
        isThatWasLastUnswer.secondPlayerProgress.answers.some(
          (a) => a.answerStatus === IsCorrectAnswer.Correct,
        );
      console.log(
        '🚀 ~ QuizGameService ~ doesSecondPlayerHasOneCorrectAnswer:',
        doesSecondPlayerHasOneCorrectAnswer,
      );

      const firstPlayerLastAnswerDate = new Date(
        firstPlayerAnswersCount.addedAt,
      );
      const secondPlayerLastAnswerDate = new Date(
        secondPlayerAnswersCount.addedAt,
      );

      if (
        firstPlayerLastAnswerDate < secondPlayerLastAnswerDate &&
        doesFirstPlayerHasOneCorrectAnswer === true
      ) {
        addFinalPointToScore = await this.quizGameRepository.addPlayerScoreToDb(
          firstPlayerProgressId!,
          finalScorePoint,
        );
        await this.quizGameRepository.endTheGame(addedAt, gameId);
      } else if (
        firstPlayerLastAnswerDate > secondPlayerLastAnswerDate &&
        doesSecondPlayerHasOneCorrectAnswer === true
      ) {
        addFinalPointToScore = await this.quizGameRepository.addPlayerScoreToDb(
          secondPlayerProgressId!,
          finalScorePoint,
        );
        await this.quizGameRepository.endTheGame(addedAt, gameId);
      } else {
        await this.quizGameRepository.endTheGame(addedAt, gameId);
      }
    }
    return addAnswerToDb;
    // НУЖНО БУДЕТ ОБНОВИТЬ SCORE/
  }
}
