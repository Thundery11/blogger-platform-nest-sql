import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { QuestionOfTheGame } from './question-of-the-game.entity';
import { PlayerProgress } from './player-progress.entity';

export enum GameStatus {
  PendingSecondPlayer = 'PendingSecondPlayer',
  Active = 'Active',
  Finished = 'Finished',
}
@Entity()
export class Game {
  @PrimaryGeneratedColumn('increment')
  public id: number;

  @OneToOne(() => PlayerProgress)
  @JoinColumn()
  firstPlayerProgress: PlayerProgress;

  @OneToOne(() => PlayerProgress, { nullable: true })
  @JoinColumn()
  secondPlayerProgress: PlayerProgress;

  @OneToMany(() => QuestionOfTheGame, (q) => q.game, { nullable: true })
  questions?: QuestionOfTheGame[] | null;

  @Column({ type: 'enum', enum: GameStatus })
  status: GameStatus;

  @Column()
  pairCreatedDate: string;

  @Column({ nullable: true })
  startGameDate: string;

  @Column({ nullable: true })
  finishGameDate: string;
  // @Column()
  // firstPlayerProgressId: number;
  // @Column({ nullable: true })
  // secondPlayerProgressId: number;

  static createGame(firstPlayer: PlayerProgress): Game {
    const pairCreatedDate = new Date().toISOString();
    const status = GameStatus.PendingSecondPlayer;
    const newGame = new Game();
    newGame.pairCreatedDate = pairCreatedDate;
    newGame.status = status;
    newGame.firstPlayerProgress = firstPlayer;
    newGame.questions = null;

    return newGame;
  }
}
