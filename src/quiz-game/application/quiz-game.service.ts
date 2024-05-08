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
    const allPossibleQuestionsFromGame =
      await this.quizGameRepository.getCurrentQuestionToAnswerOnIt(
        playerProgressId,
      );
    const whatAnswerAddingNow =
      await this.quizGameRepository.whatAnswerAddingNow(playerProgressId);
    console.log(
      '🚀 ~ QuizGameService ~ whatAnswerAddingNow:',
      whatAnswerAddingNow?.answers.length,
    );

    if (whatAnswerAddingNow?.answers.length === 0) {
      const question = allPossibleQuestionsFromGame?.questions[0];
      console.log('🚀 ~ QuizGameService ~ questions:', question);
      const questionId = question?.id;
      console.log("🚀 ~ QuizGameService ~ questionId:", questionId)
    } else if (whatAnswerAddingNow?.answers.length === 1) {
      const res1 =
        await this.quizGameRepository.getCurrentQuestionToAnswerOnIt(
          playerProgressId,
        );
      console.log('🚀 ~ QuizGameService ~ res:', res1);
    }
    const answer = new Answers();
    answer.playerProgressId = playerProgressId;
    answer.answerStatus = IsCorrectAnswer.Correct;
    answer.addedAt = new Date().toISOString();
    // console.log('🚀 ~ QuizGameService ~ answer:', answer);

    const addAnswerToDb = await this.quizGameRepository.addAnswerToDb(answer);
    console.log('🚀 ~ QuizGameService ~ addAnswerToDb:', addAnswerToDb);
  }
}
