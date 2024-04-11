import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Users } from '../../users/domain/users.entity';
import { Posts } from '../../posts/domain/posts.entity';

@Entity()
export class LastLiked {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  addedAt: string;
  @Column()
  userId: number;
  @ManyToOne(() => Users, (u) => u.lastLiked)
  user: Users;
  @Column()
  postId: number;
  @ManyToOne(() => Posts, (p) => p.lastLiked)
  post: Posts;
}
