import { Injectable } from '@nestjs/common';
import { Posts, PostsDocument } from '../domain/posts.entity';
import {
  PostOutputModel,
  allPostsOutputMapper,
} from '../api/models/output/post-output.model';
import { PostUpdateModel } from '../api/models/input/create-post.input.model';
import { DataSource, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(Posts) private postsRepository: Repository<Posts>,
  ) {}

  public async createPost(newPost: Posts): Promise<Posts | null> {
    try {
      const post = await this.postsRepository.save(newPost);
      return post;
    } catch (e) {
      throw e;
    }
    //   const insertQuery = `INSERT INTO public."Posts"(
    // "title", "shortDescription", "content","createdAt", "blogId")
    //  VALUES ('${newPost.title}', '${newPost.shortDescription}','${newPost.content}',
    //  '${newPost.createdAt}','${newPost.blogId}') RETURNING id;`;

    //   const createdPost = await this.dataSource.query(insertQuery);
    //   const postId = createdPost[0].id;
    //   return postId;
  }
  // public async countDocuments(query: object): Promise<number> {
  //   return await this.postsModel.countDocuments(query);
  // }
  async countAllDocumentsForCurrentBlog(blogId: number): Promise<number> {
    try {
      const count = await this.postsRepository.count({
        where: { blogId: blogId },
      });
      return Number(count);
    } catch (e) {
      throw e;
    }
    // const selectQuery = `SELECT COUNT(*) FROM
    // public."Posts" p
    // WHERE p."blogId" = $1`;
    // const result = await this.dataSource.query(selectQuery, [blogId]);
    // const countedPosts = Number(result[0].count);
    // return countedPosts;
  }
  async countAllDocuments(): Promise<number> {
    try {
      const count = await this.postsRepository.count();
      return Number(count);
    } catch (e) {
      throw e;
    }
    // const result = await this.dataSource.query(`SELECT COUNT(*) FROM
    // public."Posts"`);
    // console.log('🚀 ~ PostsRepository ~ countAllDocuments ~ result:', result);
    // return Number(result[0].count);
  }
  public async getAllPostsForCurrentBlog(
    blogId: number,
    sortBy: string,
    sortDirection: string,
    pageSize: number,
    skip: number,
  ): Promise<PostOutputModel[]> {
    try {
      const posts = await this.postsRepository
        .createQueryBuilder('p')
        .leftJoin('p.blog', 'b')
        .select(['p', 'b.name'])
        .where(`b.id = :blogId`, { blogId: blogId })
        .orderBy(`p.${sortBy}`, sortDirection === 'asc' ? 'ASC' : 'DESC')
        .skip(skip)
        .take(pageSize)
        .getMany();
      return allPostsOutputMapper(posts);
    } catch (e) {
      throw e;
    }
    // const selectQuery = `SELECT p."id", p."title",
    // p."shortDescription", p."content", p."createdAt",
    // p."blogId", b."name" as "blogName"
    // FROM public."Posts" p
    // LEFT JOIN "Blogs" b
    // ON b.id = p."blogId"
    // WHERE b."id" = $1
    // ORDER BY p."${sortBy}" ${sortDirection}
    //    LIMIT ${pageSize} OFFSET ${skip};`;
    // const posts = await this.dataSource.query(selectQuery, [blogId]);
    // return allPostsOutputMapper(posts);
  }

  public async getPostById(postId): Promise<number | null> {
    try {
      const post = await this.postsRepository.findOne({
        where: { id: postId },
      });
      if (!post) return null;
      return post.id;
    } catch (e) {
      throw e;
    }
    // const selectQuery = `SELECT  "id" FROM public."Posts"
    // WHERE "id" = $1`;
    // const result = await this.dataSource.query(selectQuery, [postId]);
    // return result[0];
  }
  public async getPostForBlogById(
    postId: number,
    blogId: number,
  ): Promise<Posts | null> {
    try {
      // Проверяем, что пост принадлежит указанному блогу
      const postBelongsToBlog = await this.postsRepository
        .createQueryBuilder('p')
        .where('p.id = :postId', { postId })
        .andWhere('p.blogId = :blogId', { blogId })
        .getOne();

      if (!postBelongsToBlog) {
        // Если пост не принадлежит указанному блогу, возвращаем false
        return null;
      }
      return postBelongsToBlog;
    } catch (e) {
      throw e;
    }
    // const selectQuery = `SELECT p."id", p."title",
    // p."shortDescription", p."content", p."createdAt",
    // p."blogId", b."name" as "blogName"
    // FROM public."Posts" p
    // LEFT JOIN "Blogs" b
    // ON b.id = p."blogId"
    // WHERE b."id" = $1 AND p."id" = $2`;
    // const post = await this.dataSource.query(selectQuery, [blogId, postId]);
    // console.log('🚀 ~ PostsRepository ~ post:', post);
    // if (!post[0]) {
    //   throw new NotFoundException();
    // }
    // return post[0];
  }

  public async updatePostForCurrentBlog(
    postId: number,
    blogId: number,
    postUpdateModel: PostUpdateModel,
  ): Promise<boolean> {
    try {
      const res = await this.postsRepository.update(
        { id: postId, blogId: blogId },
        {
          title: postUpdateModel.title,
          shortDescription: postUpdateModel.shortDescription,
          content: postUpdateModel.content,
        },
      );
      // const result = await this.dataSource.query(
      //   `UPDATE public."Posts"
      // SET "title" = '${postUpdateModel.title}',
      // "shortDescription" = '${postUpdateModel.shortDescription}',
      // "content" = '${postUpdateModel.content}'
      // WHERE "id" = $1 AND "blogId" = $2;`,
      //   [postId, blogId],
      // );
      return res.affected === 1;
    } catch (e) {
      throw e;
    }
  }
  public async getAllPosts(
    sortBy: string,
    sortDirection: string,
    pageSize: number,
    skip: number,
  ): Promise<PostOutputModel[]> {
    try {
      let orderCriteria;
      if (sortBy === 'blogName') {
        orderCriteria = { 'b.name': sortDirection === 'asc' ? 'ASC' : 'DESC' };
      } else {
        orderCriteria = {
          [`p.${sortBy}`]: sortDirection === 'asc' ? 'ASC' : 'DESC',
        };
      }
      const posts = await this.postsRepository
        .createQueryBuilder('p')
        .leftJoin('p.blog', 'b')
        .select(['p', 'b.name'])
        .orderBy(orderCriteria)
        .skip(skip)
        .take(pageSize)
        .getMany();
      console.log('🚀 ~ PostsRepository ~ posts:', posts);
      return allPostsOutputMapper(posts);
    } catch (e) {
      throw e;
    }
    // const selectQuery = `SELECT p."id", p."title",
    // p."shortDescription", p."content", p."createdAt",
    // p."blogId", b."name" as "blogName"
    // FROM public."Posts" p
    // LEFT JOIN "Blogs" b
    // ON b.id = p."blogId"
    // ORDER BY "${sortBy}" ${sortDirection}
    // LIMIT ${pageSize} OFFSET ${skip};`;

    // const posts = await this.dataSource.query(selectQuery);
    // console.log('🚀 ~ PostsRepository ~ posts:', posts);

    // return allPostsOutputMapper(posts);
  }

  public async save(post: PostsDocument) {
    await post.save();
  }

  public async deletePost(blogId: number, postId: number): Promise<boolean> {
    try {
      const res = await this.postsRepository.delete({
        id: postId,
        blogId: blogId,
      });
      // const result = await this.dataSource.query(
      //   `DELETE FROM public."Posts"
      // WHERE "id" = $1 AND "blogId" = $2
      // RETURNING "id";`,
      //   [postId, blogId],
      // );
      return res.affected === 1;
    } catch (e) {
      throw e;
    }
  }
}
