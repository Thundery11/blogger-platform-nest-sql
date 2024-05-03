import { Injectable } from '@nestjs/common';
import { MyStatus } from '../../features/likes/domain/likes.entity';
import { Game, GameStatus } from '../domain/quiz-game.entity';
import { QuizGameRepository } from '../infrastructure/quiiz-game.repository';
import { PlayerProgress } from '../domain/player-progress.entity';

@Injectable()
export class QuizGameService {
  constructor(private quizGameRepository: QuizGameRepository) {}

  async connectToTheGame(currentUserId: number) {
    const isGameWithPandingPlayerExist =
      await this.quizGameRepository.isGameWithPandingPlayerExist();
    console.log(
      '🚀 ~ QuizGameService ~ connectToTheGame ~ isGameWithPandingPlayerExist:',
      isGameWithPandingPlayerExist,
    );

    if (!isGameWithPandingPlayerExist) {
      const firstPlayerProgress = new PlayerProgress();
      firstPlayerProgress.userId = currentUserId;
      firstPlayerProgress.score = 0;
      const addFirstplayerToDb =
        await this.quizGameRepository.addFirstPlayerToTheGame(
          firstPlayerProgress,
        );

      const firstPlayer = await this.quizGameRepository.getPlayer(
        addFirstplayerToDb.userId,
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
    } else {
      return false;
    }
  }
}
