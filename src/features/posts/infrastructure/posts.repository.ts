import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreatePostDto, Posts, PostsDocument } from '../domain/posts.entity';
import { Model, Types } from 'mongoose';
import {
  PostOutputModel,
  allPostsOutputMapper,
} from '../api/models/output/post-output.model';
import { PostUpdateModel } from '../api/models/input/create-post.input.model';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectModel(Posts.name) private postsModel: Model<Posts>,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  public async createPost(newPost: CreatePostDto): Promise<number | null> {
    const insertQuery = `INSERT INTO public."Posts"(
  "title", "shortDescription", "content","createdAt", "blogId")
   VALUES ('${newPost.title}', '${newPost.shortDescription}','${newPost.content}',
   '${newPost.createdAt}','${newPost.blogId}') RETURNING id;`;

    const createdPost = await this.dataSource.query(insertQuery);
    console.log(
      '🚀 ~ PostsRepository ~ createPost ~ createdPost:',
      createdPost,
    );
    const postId = createdPost[0].id;
    return postId;
  }
  public async countDocuments(query: object): Promise<number> {
    return await this.postsModel.countDocuments(query);
  }
  async countAllDocumentsForCurrentBlog(blogId: number): Promise<number> {
    return await this.postsModel.countDocuments({ blogId: blogId });
  }
  async countAllDocuments(): Promise<number> {
    return await this.postsModel.countDocuments({});
  }
  public async getAllPostsForCurrentBlog(
    blogId: number,
    sortBy: string,
    sortDirection: string,
    pageSize: number,
    skip: number,
  ): Promise<PostOutputModel[]> {
    const posts = await this.postsModel
      .find({ blogId }, { __v: false })
      .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(Number(pageSize));
    return allPostsOutputMapper(posts);
  }
  public async getPostById(postId: Types.ObjectId): Promise<PostsDocument> {
    const post = await this.postsModel.findById(postId, {
      _v: false,
    });
    if (!post) {
      throw new NotFoundException();
    }
    return post;
  }
  public async getAllPosts(
    sortBy: string,
    sortDirection: string,
    pageSize: number,
    skip: number,
  ): Promise<PostOutputModel[]> {
    const posts = await this.postsModel
      .find({}, { __v: false })
      .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(Number(pageSize));

    return allPostsOutputMapper(posts);
  }
  // public async updatePost(
  //   id: string,
  //   postUpdateModel: PostUpdateModel,
  // ): Promise<boolean> {
  //   const result = await this.postsModel.updateOne({ id }, postUpdateModel);
  //   return result.matchedCount ? true : false;
  // }

  public async save(post: PostsDocument) {
    await post.save();
  }

  public async deletePost(id: string): Promise<boolean> {
    const result = await this.postsModel.deleteOne({
      _id: new Types.ObjectId(id),
    });
    return result.deletedCount ? true : false;
  }
}
