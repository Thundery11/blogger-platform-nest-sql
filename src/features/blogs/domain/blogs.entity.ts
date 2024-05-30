import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { BlogsCreateModel } from '../api/models/input/create-blog.input.model';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Posts } from '../../posts/domain/posts.entity';
import { Users } from '../../users/domain/users.entity';
import { AggregateRoot } from '@nestjs/cqrs';
import { BlogCreatedEvent } from './events/blog-created.event';
import { BlogUpdatedEvent } from './events/blog-updated-event';
export type BlogsDocument = HydratedDocument<Blogs>;
export type BlogsModelType = Model<BlogsDocument> & typeof statics;

@Entity()
export class Blogs extends AggregateRoot {
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
  @OneToMany(() => Posts, (p) => p.blog)
  posts: Posts[];
  @Column({ nullable: true })
  userId: number;
  @ManyToOne(() => Users, (u) => u.blogs)
  user: Users;

  static createBlog(userId: number, blogsCreateModel: BlogsCreateModel) {
    const createdAt = new Date().toISOString();
    const isMembership = false;
    const blog = new this();
    blog.name = blogsCreateModel.name;
    blog.description = blogsCreateModel.description;
    blog.websiteUrl = blogsCreateModel.websiteUrl;
    blog.createdAt = createdAt;
    blog.isMembership = isMembership;
    blog.userId = userId;
    blog.apply(new BlogCreatedEvent(userId, blogsCreateModel));
    return blog;
  }

  updateBlog(blogsUpdateModel: BlogsCreateModel) {
    this.description = blogsUpdateModel.description;
    this.websiteUrl = blogsUpdateModel.websiteUrl;
    this.name = blogsUpdateModel.name;
    this.apply(new BlogUpdatedEvent(this.id, this.userId));
    return this;
  }
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
