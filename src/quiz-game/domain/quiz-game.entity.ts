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

  @Column()
  firstPlayerProgressId: number; //????????????

  @OneToOne(() => PlayerProgress)
  @JoinColumn()
  secondPlayerProgress: PlayerProgress;

  @Column({ nullable: true })
  secondPlayerProgressId: number; // ???????????

  @OneToMany(() => QuestionOfTheGame, (q) => q.game, { nullable: true })
  questions: QuestionOfTheGame[];

  @Column({ type: 'enum', enum: GameStatus })
  status: GameStatus;

  @Column()
  pairCreatedDate: string;

  @Column({ nullable: true })
  startGameDate: string;

  @Column({ nullable: true })
  finishGameDate: string;
}
