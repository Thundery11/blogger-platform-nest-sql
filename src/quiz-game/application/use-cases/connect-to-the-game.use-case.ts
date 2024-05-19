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
    console.log(
      '🚀 ~ execute ~ isGameWithPandingPlayerExist:',
      isGameWithPandingPlayerExist,
    );

    const isUserAlreadyInGame =
      await this.quizGameQueryRepository.isUserAlreadyInGame(currentUserId);
    console.log('🚀 ~ execute ~ isUserAlreadyInGame:', isUserAlreadyInGame);

    if (isUserAlreadyInGame) {
      throw new ForbiddenException('u are allready in game');
    }

    if (!isGameWithPandingPlayerExist) {
      const firstPlayerProgress = PlayerProgress.addPlayer(currentUserId);
      console.log('🚀 ~ execute ~ firstPlayerProgress:', firstPlayerProgress);

      const addFirstplayerToDb =
        await this.quizGameRepository.addPlayerToTheGame(firstPlayerProgress);
      console.log('🚀 ~ execute ~ addFirstplayerToDb:', addFirstplayerToDb);

      const firstPlayer = await this.quizGameRepository.getPlayer(
        addFirstplayerToDb.id,
      );
      console.log('🚀 ~ execute ~ firstPlayer:', firstPlayer);

      const newGame = Game.createGame(firstPlayer);
      console.log('🚀 ~ execute ~ newGame:', newGame);

      const createdGame = await this.quizGameRepository.startGame(newGame);
      console.log('🚀 ~ execute ~ createdGame:', createdGame);

      return createdGame;
    } else if (isGameWithPandingPlayerExist) {
      const secondPlayerProgress = PlayerProgress.addPlayer(currentUserId);
      const addSecondPlayerToDb =
        await this.quizGameRepository.addPlayerToTheGame(secondPlayerProgress);

      const secondPlayer = await this.quizGameRepository.getPlayer(
        addSecondPlayerToDb.id,
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
