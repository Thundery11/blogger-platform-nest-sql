import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Game, GameStatus } from '../domain/quiz-game.entity';
import { Repository } from 'typeorm';
import { PlayerProgress } from '../domain/player-progress.entity';

@Injectable()
export class QuizGameRepository {
  constructor(
    @InjectRepository(Game) private quizGameRepository: Repository<Game>,
    @InjectRepository(PlayerProgress)
    private playerProgressRepo: Repository<PlayerProgress>,
  ) {}

  async isGameWithPandingPlayerExist() {
    return await this.quizGameRepository.findOne({
      where: { status: GameStatus.PendingSecondPlayer },
    });
  }
  async addPlayerToTheGame(player: PlayerProgress) {
    return await this.playerProgressRepo.save(player);
  }
  async getPlayer(id: number) {
    const player = await this.playerProgressRepo
      .createQueryBuilder('p')
      .leftJoin('p.user', 'u')
      .leftJoin('p.answers', 'a')
      .select([
        'p.id',
        'p.userId',
        'p.score',
        'u.login',
        'u.id',
        'a.questionOfTheGameId as questionId',
        'a.answerStatus',
        'a.addedAt',
      ])
      .where(`p.userId = :userId`, { userId: id })
      .getOneOrFail();

    return player;
  }

  async startGame(newGame: Game) {
    return await this.quizGameRepository.save(newGame);
  }

  async addSecondPlayerToTheGame(
    secondPlayer: PlayerProgress,
    startGameDate: string,
    status: GameStatus,
  ) {
    const result = await this.quizGameRepository
      .createQueryBuilder()
      .update()
      .set({
        secondPlayerProgress: secondPlayer,
        startGameDate: startGameDate,
        status: status,
      })
      .execute();
    return result.affected === 1;
  }
}
