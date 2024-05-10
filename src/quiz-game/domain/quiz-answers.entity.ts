import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  Column,
  ManyToOne,
} from 'typeorm';
import { PlayerProgress } from './player-progress.entity';

export enum IsCorrectAnswer {
  Correct = 'Correct',
  Incorrect = 'Incorrect',
}

@Entity()
export class Answers {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  questionId: number;

  @Column()
  playerProgressId: number;

  @ManyToOne(() => PlayerProgress, (p) => p.answers)
  playerProgress: PlayerProgress;

  @Column({ type: 'enum', enum: IsCorrectAnswer })
  answerStatus: IsCorrectAnswer;

  @Column()
  addedAt: string;
}
