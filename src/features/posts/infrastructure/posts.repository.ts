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
    const postId = createdPost[0].id;
    return postId;
  }
  public async countDocuments(query: object): Promise<number> {
    return await this.postsModel.countDocuments(query);
  }
  async countAllDocumentsForCurrentBlog(blogId: number): Promise<number> {
    const selectQuery = `SELECT COUNT(*) FROM
    public."Posts" p
    WHERE p."blogId" = $1`;
    const result = await this.dataSource.query(selectQuery, [blogId]);
    const countedPosts = Number(result[0].count);
    return countedPosts;
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
    const selectQuery = `SELECT p."id", p."title",
    p."shortDescription", p."content", p."createdAt",
    p."blogId", b."name" as "blogName"
    FROM public."Posts" p
    LEFT JOIN "Blogs" b
    ON b.id = p."blogId"
    WHERE b."id" = $1
    ORDER BY p."${sortBy}" ${sortDirection}
       LIMIT ${pageSize} OFFSET ${skip};`;
    const posts = await this.dataSource.query(selectQuery, [blogId]);
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
    const selectQuery = `SELECT p."id", p."title", p."shortDescription", p."content", p."createdAt", p."blogId"
    FROM public."Posts" p
    LEFT JOIN "Blogs" b
    ON b.id = p."blogId"
    WHERE p."id" = $1
    ORDER BY p."${sortBy}" ${sortDirection}
       LIMIT ${pageSize} OFFSET ${skip};`;
    const posts = await this.dataSource.query(selectQuery);
    console.log('🚀 ~ PostsRepository ~ posts:', posts);

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
