import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  OneToMany,
} from 'typeorm';
import { Users } from '../../features/users/domain/users.entity';
import { Answers } from './quiz-answers.entity';

@Entity()
export class PlayerProgress {
  @PrimaryGeneratedColumn('increment')
  public id: number;

  @Column()
  userId: number;

  @ManyToOne(() => Users, (u) => u.playerProgress) //????
  user: Users;

  @OneToMany(() => Answers, (a) => a.playerProgress)
  answers: Answers[]; //можно хранить просто массивом

  @Column()
  score: number;

  static addPlayer(currentUserId: number) {
    const addedPlayer = new PlayerProgress();
    addedPlayer.userId = currentUserId;
    addedPlayer.score = 0;

    return addedPlayer;
  }
}
