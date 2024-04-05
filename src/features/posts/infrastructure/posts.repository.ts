import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreatePostDto, Posts, PostsDocument } from '../domain/posts.entity';
import { Model, Types } from 'mongoose';
import {
  PostFromDb,
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
    const result = await this.dataSource.query(`SELECT COUNT(*) FROM 
    public."Posts"`);
    console.log('🚀 ~ PostsRepository ~ countAllDocuments ~ result:', result);
    return Number(result[0].count);
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
  public async getPostById(postId) {
    return 'id';
  }
  public async getPostForBlogById(
    postId: number,
    blogId: number,
  ): Promise<PostFromDb> {
    const selectQuery = `SELECT p."id", p."title",
    p."shortDescription", p."content", p."createdAt",
    p."blogId", b."name" as "blogName"
    FROM public."Posts" p
    LEFT JOIN "Blogs" b
    ON b.id = p."blogId"
    WHERE b."id" = $1 AND p."id" = $2`;
    const post = await this.dataSource.query(selectQuery, [blogId, postId]);
    console.log('🚀 ~ PostsRepository ~ post:', post);
    if (!post[0]) {
      throw new NotFoundException();
    }
    return post[0];
  }

  public async updatePostForCurrentBlog(
    postId: number,
    blogId: number,
    postUpdateModel: PostUpdateModel,
  ): Promise<boolean> {
    const result = await this.dataSource.query(
      `UPDATE public."Posts"
    SET "title" = '${postUpdateModel.title}', 
    "shortDescription" = '${postUpdateModel.shortDescription}',
    "content" = '${postUpdateModel.content}'
    WHERE "id" = $1 AND "blogId" = $2;`,
      [postId, blogId],
    );
    return result[1] === 1 ? true : false;
  }
  public async getAllPosts(
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
    ORDER BY p."${sortBy}" ${sortDirection}
       LIMIT ${pageSize} OFFSET ${skip};`;
    console.log('🚀 ~ PostsRepository ~ selectQuery:', selectQuery);
    const posts = await this.dataSource.query(selectQuery);
    console.log('🚀 ~ PostsRepository ~ posts:', posts);

    return allPostsOutputMapper(posts);
  }

  public async save(post: PostsDocument) {
    await post.save();
  }

  public async deletePost(blogId: number, postId: number): Promise<boolean> {
    const result = await this.dataSource.query(
      `DELETE FROM public."Posts"
    WHERE "id" = $1 AND "blogId" = $2
    RETURNING "id";`,
      [postId, blogId],
    );
    return result[1] === 1 ? true : false;
  }
}
