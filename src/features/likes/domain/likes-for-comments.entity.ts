import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { MyStatus } from './likes.entity';
import { Comments } from '../../comments/domain/comments.entity';
import { Users } from '../../users/domain/users.entity';

@Entity()
export class LikesForComments {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  createdAt: string;
  @Column({ type: 'enum', enum: MyStatus })
  myStatus: MyStatus;
  @Column()
  commentId: number;
  @ManyToOne(() => Comments, (c) => c.likesForComments)
  comment: Comments;
  @Column()
  userId: number;
  @ManyToOne(() => Users, (u) => u.likesForPosts)
  user: Users;
}
