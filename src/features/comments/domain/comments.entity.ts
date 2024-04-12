import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from '../../users/domain/users.entity';
import { Posts } from '../../posts/domain/posts.entity';
import { LikesForComments } from '../../likes/domain/likes-for-comments.entity';

@Schema({ _id: false })
export class CommentatorInfo {
  @Prop({ required: true })
  userId: string;
  @Prop({ required: true })
  userLogin: string;
}
const CommentatorInfoSchema = SchemaFactory.createForClass(CommentatorInfo);

@Schema({ _id: false })
export class LikesInfo {
  @Prop({ required: true })
  likesCount: number;
  @Prop({ required: true })
  dislikesCount: number;
  @Prop({ required: true })
  myStatus: string;
}
const LikesInfoSchema = SchemaFactory.createForClass(LikesInfo);

@Entity()
export class Comments {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  content: string;
  @Column()
  createdAt: string;
  @Column()
  userId: number;
  @Column()
  postId: number;
  @ManyToOne(() => Users, (u) => u.comments)
  user: Users;
  @ManyToOne(() => Posts, (p) => p.comments)
  post: Posts;
  @OneToMany(() => LikesForComments, (lk) => lk.comment)
  likesForComments: LikesForComments[];
}

@Schema()
export class Commentss {
  @Prop({ required: true })
  postId: string;
  @Prop({ required: true })
  content: string;
  @Prop({ required: true, type: CommentatorInfoSchema })
  commentatorInfo: CommentatorInfo;
  @Prop({ required: true })
  createdAt: string;
  @Prop({ required: true, type: LikesInfoSchema })
  likesInfo: LikesInfo;
}

export const CommentsSchema = SchemaFactory.createForClass(Comments);
export type CommentsDocument = HydratedDocument<Comments>;
