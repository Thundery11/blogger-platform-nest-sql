import { Injectable } from '@nestjs/common';
import { PostsRepository } from '../infrastructure/posts.repository';
import { SortingQueryParams } from '../../blogs/api/models/query/query-for-sorting';
import {
  AllPostsOutputModel,
  PostOutputModel,
} from '../api/models/output/post-output.model';
import { BlogsQueryRepository } from '../../blogs/infrastructure/blogs.query-repository';
import {
  PostCreateModel,
  PostCreateModelWithBlogId,
  PostUpdateModel,
} from '../api/models/input/create-post.input.model';
import {
  ExtendedLikesInfo,
  Posts,
  PostsDocument,
} from '../domain/posts.entity';
import { Types } from 'mongoose';
import { Type } from 'class-transformer';

@Injectable()
export class PostsService {
  constructor(
    private postsRepository: PostsRepository,
    private blogsQueryRepository: BlogsQueryRepository,
  ) {}
  // async findAllPostsForCurrentBlog(
  //   sortingQueryParams: SortingQueryParams,
  //   blogId: string,
  // ): Promise<AllPostsOutputModel | null> {
  //   const {
  //     sortBy = 'createdAt',
  //     sortDirection = 'desc',
  //     pageNumber = 1,
  //     pageSize = 10,
  //   } = sortingQueryParams;
  //   // const query = {};
  //   const skip = (pageNumber - 1) * pageSize;
  //   const countedDocuments =
  //     await this.postsRepository.countAllDocumentsForCurrentBlog(blogId);
  //   const pagesCount: number = Math.ceil(countedDocuments / pageSize);

  //   const isBlogExist = await this.blogsQueryRepository.getBlogById(
  //     new Types.ObjectId(blogId),
  //   );
  //   if (!isBlogExist) {
  //     return null;
  //   }

  //   const allPosts = await this.postsRepository.getAllPostsForCurrentBlog(
  //     blogId,
  //     sortBy,
  //     sortDirection,
  //     pageSize,
  //     skip,
  //   );

  //   const presentationalAllPosts = {
  //     pagesCount,
  //     page: Number(pageNumber),
  //     pageSize: Number(pageSize),
  //     totalCount: countedDocuments,
  //     items: allPosts,
  //   };

  //   return presentationalAllPosts;
  // }
  // async findAllPosts(
  //   sortingQueryParams: SortingQueryParams,
  // ): Promise<AllPostsOutputModel> {
  //   const {
  //     sortBy = 'createdAt',
  //     sortDirection = 'desc',
  //     pageNumber = 1,
  //     pageSize = 10,
  //   } = sortingQueryParams;
  //   // const query = {};
  //   const skip = (pageNumber - 1) * pageSize;
  //   const countedDocuments = await this.postsRepository.countAllDocuments();
  //   const pagesCount: number = Math.ceil(countedDocuments / pageSize);

  //   const allPosts = await this.postsRepository.getAllPosts(
  //     sortBy,
  //     sortDirection,
  //     pageSize,
  //     skip,
  //   );

  //   const presentationalAllPosts = {
  //     pagesCount,
  //     page: Number(pageNumber),
  //     pageSize: Number(pageSize),
  //     totalCount: countedDocuments,
  //     items: allPosts,
  //   };

  //   return presentationalAllPosts;
  // }
  // async createPost(
  //   postCreateModelWithBlogId: PostCreateModelWithBlogId,
  // ): Promise<PostsDocument | null> {
  //   const { title, shortDescription, content, blogId } =
  //     postCreateModelWithBlogId;

  //   const isBlogExist = await this.blogsQueryRepository.getBlogById(
  //     new Types.ObjectId(blogId),
  //   );
  //   if (!isBlogExist) {
  //     return null;
  //   }

  //   const createdAt = new Date().toISOString();
  //   const extendedLikesInfo = new ExtendedLikesInfo();
  //   extendedLikesInfo.likesCount = 0;
  //   extendedLikesInfo.dislikesCount = 0;
  //   extendedLikesInfo.myStatus = 'None';
  //   extendedLikesInfo.newestLikes = [];

  //   const newPost = new Posts();
  //   newPost.title = title;
  //   newPost.shortDescription = shortDescription;
  //   newPost.content = content;
  //   newPost.blogId = isBlogExist.id;
  //   newPost.blogName = isBlogExist.name;
  //   newPost.createdAt = createdAt;
  //   newPost.extendedLikesInfo = extendedLikesInfo;

  //   return this.postsRepository.createPost(newPost);
  // }
  // async updatePost(
  //   id: string,
  //   postUpdateModel: PostUpdateModel,
  // ): Promise<boolean> {
  //   const post = await this.postsRepository.getPostById(new Types.ObjectId(id));
  //   post.updatePost(postUpdateModel);
  //   await this.postsRepository.save(post);
  //   return true;
  // }

  // async deletePost(id: string): Promise<boolean> {
  //   return await this.postsRepository.deletePost(id);
  // }
}
