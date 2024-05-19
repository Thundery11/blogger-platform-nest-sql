import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  OneToMany,
} from 'typeorm';
import { Users } from '../../features/users/domain/users.entity';
import { Answers } from './quiz-answers.entity';
export enum PlayerStatus {
  Active = 'Active',
  Finished = 'Finished',
}
@Entity()
export class PlayerProgress {
  @PrimaryGeneratedColumn('increment')
  public id: number;

  @Column()
  playerId: number;

  @ManyToOne(() => Users, (u) => u.playerProgress) //????
  player: Users;

  @OneToMany(() => Answers, (a) => a.playerProgress)
  answers: Answers[];

  @Column()
  score: number;

  @Column()
  status: PlayerStatus;

  static addPlayer(currentUserId: number) {
    const addedPlayer = new PlayerProgress();
    addedPlayer.playerId = currentUserId;
    addedPlayer.score = 0;
    addedPlayer.status = PlayerStatus.Active;

    return addedPlayer;
  }
}
