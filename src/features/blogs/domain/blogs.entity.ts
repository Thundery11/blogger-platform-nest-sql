import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { BlogsCreateModel } from '../api/models/input/create-blog.input.model';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
export type BlogsDocument = HydratedDocument<Blogs>;
export type BlogsModelType = Model<BlogsDocument> & typeof statics;

@Entity()
export class Blogs {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  description: string;
  @Column()
  websiteUrl: string;
  @Column()
  createdAt: string;
  @Column()
  isMembership: boolean;
}

@Schema()
export class Blogss {
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  description: string;
  @Prop({ required: true })
  websiteUrl: string;
  @Prop({ required: true })
  createdAt: string;
  @Prop({ required: true })
  isMembership: boolean;
  static createBlog(
    blogsCreateModel: BlogsCreateModel,
    createdAt: string,

    isMembership: boolean,
  ) {
    const blog = new this();

    blog.name = blogsCreateModel.name;
    blog.description = blogsCreateModel.description;
    blog.websiteUrl = blogsCreateModel.websiteUrl;
    blog.createdAt = createdAt;
    blog.isMembership = isMembership;
    return blog;
  }
}
export const BlogsSchema = SchemaFactory.createForClass(Blogs);

const statics = {
  createBlog: Blogss.createBlog,
};
BlogsSchema.statics = statics;
