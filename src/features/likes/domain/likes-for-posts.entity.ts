import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { MyStatus } from './likes.entity';
import { Posts } from '../../posts/domain/posts.entity';
import { Users } from '../../users/domain/users.entity';

@Entity()
export class LikesForPosts {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  createdAt: string;
  @Column({ type: 'enum', enum: MyStatus })
  myStatus: MyStatus;
  @Column()
  postId: number;
  @ManyToOne(() => Posts, (p) => p.likesForPosts)
  post: Posts;
  @Column()
  userId: number;
  @ManyToOne(() => Users, (u) => u.likesForPosts)
  user: Users;
}
