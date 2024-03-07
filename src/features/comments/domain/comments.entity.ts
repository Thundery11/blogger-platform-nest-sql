import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

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

@Schema()
export class Comments {
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
