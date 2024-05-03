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
  async addFirstPlayerToTheGame(player: PlayerProgress) {
    return await this.playerProgressRepo.save(player);
  }

  async startGame(newGame: Game) {
    return await this.quizGameRepository.save(newGame);
  }
}
