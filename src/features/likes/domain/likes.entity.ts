import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export enum MyStatus {
  None = 'None',
  Like = 'Like',
  Dislike = 'Dislike',
}

@Schema({ _id: false })
class NewestLikes {
  @Prop()
  addedAt: string;
  @Prop()
  userId: string;
  @Prop()
  login: string;
}
export const NewestLikesSchema = SchemaFactory.createForClass(NewestLikes);

@Schema({ _id: false })
export class ExtendedLikesInfo {
  @Prop({ required: true })
  likesCount: number;
  @Prop({ required: true })
  dislikesCount: number;
  @Prop({ required: true })
  myStatus: string;
  @Prop({ default: [] })
  newestLikes: NewestLikes[];
}
export const ExtendedLikesInfoSchema =
  SchemaFactory.createForClass(ExtendedLikesInfo);

@Schema()
export class LikesDbModel {
  @Prop({ required: true })
  userId: string;
  @Prop({ required: true })
  parentId: string;
  @Prop({ required: true })
  createdAt: string;
  @Prop({ required: true })
  myStatus: MyStatus;
}

export type LikesDocument = HydratedDocument<LikesDbModel>;
export const LikesDbSchema = SchemaFactory.createForClass(LikesDbModel);

@Schema()
export class LastLikedDbModel {
  @Prop({ required: true })
  addedAt: string;
  @Prop({ required: true })
  userId: string;
  @Prop({ required: true })
  login: string;
  @Prop({ required: true })
  postId: string;
}
export const LastLikedDbSchema = SchemaFactory.createForClass(LastLikedDbModel);
export type LastLikedDocument = HydratedDocument<LastLikedDbModel>;
