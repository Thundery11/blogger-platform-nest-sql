import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Users } from '../../features/users/domain/users.entity';

@Entity({
  orderBy: {
    avgScores: 'DESC',
    sumScore: 'DESC',
    winsCount: 'DESC',
    lossesCount: 'ASC',
  },
})
export class Statistics {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column()
  sumScore: number;
  @Column('float', { nullable: true })
  avgScores: number;
  @Column()
  gamesCount: number;
  @Column()
  winsCount: number;
  @Column()
  lossesCount: number;
  @Column()
  drawsCount: number;
  @Column()
  playerId: number;
  @ManyToOne(() => Users, (u) => u.statistics)
  player: Users;

  static addStats(currentUserId, stats) {
    const addedStats = new Statistics();
    addedStats.sumScore = stats.sumScore;
    addedStats.avgScores = stats.avgScores;
    addedStats.gamesCount = stats.gamesCount;
    addedStats.winsCount = stats.winsCount;
    addedStats.lossesCount = stats.lossesCount;
    addedStats.drawsCount = stats.drawsCount;
    addedStats.playerId = currentUserId;
    return addedStats;
  }
}
