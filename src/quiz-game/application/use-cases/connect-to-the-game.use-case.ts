import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuizGameRepository } from '../../infrastructure/quiiz-game.repository';
import { QuizGameQueryRepository } from '../../infrastructure/quiz-game-query.repository';
import { ForbiddenException } from '@nestjs/common';
import {
  PlayerProgress,
  PlayerStatus,
} from '../../domain/player-progress.entity';
import { Game, GameStatus } from '../../domain/quiz-game.entity';

export class ConnectToTheGameCommand {
  constructor(public currentUserId: number) {}
}

@CommandHandler(ConnectToTheGameCommand)
export class ConnectToTheGameUseCase
  implements ICommandHandler<ConnectToTheGameCommand>
{
  constructor(
    private quizGameRepository: QuizGameRepository,
    private quizGameQueryRepository: QuizGameQueryRepository,
  ) {}
  async execute(command: ConnectToTheGameCommand): Promise<any> {
    const currentUserId = command.currentUserId;
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
      firstPlayerProgress.status = PlayerStatus.Active;
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
}
