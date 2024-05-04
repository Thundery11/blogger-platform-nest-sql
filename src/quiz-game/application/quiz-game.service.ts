import { ForbiddenException, Injectable } from '@nestjs/common';
import { MyStatus } from '../../features/likes/domain/likes.entity';
import { Game, GameStatus } from '../domain/quiz-game.entity';
import { QuizGameRepository } from '../infrastructure/quiiz-game.repository';
import { PlayerProgress } from '../domain/player-progress.entity';
import { QuizGameQueryRepository } from '../infrastructure/quiz-game-query.repository';

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
    console.log(
      '🚀 ~ QuizGameService ~ connectToTheGame ~ isUserAlreadyInGame:',
      isUserAlreadyInGame,
    );
    if (isUserAlreadyInGame) {
      throw new ForbiddenException('u are allready in game');
    }

    if (!isGameWithPandingPlayerExist) {
      const firstPlayerProgress = new PlayerProgress();
      firstPlayerProgress.playerId = currentUserId;
      firstPlayerProgress.score = 0;
      const addFirstplayerToDb =
        await this.quizGameRepository.addPlayerToTheGame(firstPlayerProgress);
      console.log(
        '🚀 ~ QuizGameService ~ connectToTheGame ~ addFirstplayerToDb:',
        addFirstplayerToDb,
      );

      const firstPlayer = await this.quizGameRepository.getPlayer(
        addFirstplayerToDb.playerId,
      );
      console.log(
        '🚀 ~ QuizGameService ~ connectToTheGame ~ firstPlayer:',
        firstPlayer,
      );

      const pairCreatedDate = new Date().toISOString();
      const status = GameStatus.PendingSecondPlayer;
      const newGame = Game.createGame(firstPlayer);
      console.log(
        '🚀 ~ QuizGameService ~ connectToTheGame ~ newGame:',
        newGame,
      );
      //   newGame.pairCreatedDate = pairCreatedDate;
      //   newGame.status = status;
      //   newGame.firstPlayerProgress = firstPlayer;
      //   newGame.questions = null;

      return await this.quizGameRepository.startGame(newGame);
    } else if (isGameWithPandingPlayerExist) {
      const secondPlayerProgress = PlayerProgress.addPlayer(currentUserId);
      const addSecondPlayerToDb =
        await this.quizGameRepository.addPlayerToTheGame(secondPlayerProgress);

      const secondPlayer = await this.quizGameRepository.getPlayer(
        addSecondPlayerToDb.playerId,
      );
      console.log(
        '🚀 ~ QuizGameService ~ connectToTheGame ~ secondPlayer:',
        secondPlayer,
      );

      const startGameDate = new Date().toISOString();
      const status = GameStatus.Active;

      const addSecondPlayerToTheGame =
        await this.quizGameRepository.addSecondPlayerToTheGame(
          secondPlayer,
          startGameDate,
          status,
        );

      return addSecondPlayerToTheGame;
    }
  }
}
