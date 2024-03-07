import { Injectable } from '@nestjs/common';
import { BlogsRepository } from '../infrastructure/blogs.repository';
import { Blogs, BlogsDocument, BlogsModelType } from '../domain/blogs.entity';
import { Types } from 'mongoose';
import { BlogsCreateModel } from '../api/models/input/create-blog.input.model';
import { BlogsQueryRepository } from '../infrastructure/blogs.query-repository';
import { PostCreateModel } from '../../../features/posts/api/models/input/create-post.input.model';
import {
  ExtendedLikesInfo,
  Posts,
  PostsDocument,
} from '../../../features/posts/domain/posts.entity';
import { PostsRepository } from '../../../features/posts/infrastructure/posts.repository';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class BlogsService {
  constructor(
    private blogsRepository: BlogsRepository,
    private blogsQueryRepository: BlogsQueryRepository,
    private postsRepository: PostsRepository,
    @InjectModel(Blogs.name) private blogsModel: BlogsModelType,
  ) {}

  // async createBlog(blogsCreateModel: BlogsCreateModel): Promise<BlogsDocument> {
  //   const createdAt = new Date().toISOString();
  //   const isMembership = false;
  //   const newBlog = this.blogsModel.createBlog(
  //     blogsCreateModel,
  //     createdAt,
  //     isMembership,
  //   );

  //   return await this.blogsRepository.createBlog(newBlog);
  // }

  // async findAllBlogs(
  //   blogsQueryParams: SortingQueryParams,
  // ): Promise<AllBlogsOutputModel> {
  //   const searchNameTerm = blogsQueryParams.searchNameTerm ?? '';
  //   const sortBy = blogsQueryParams.sortBy ?? 'createdAt';
  //   const sortDirection = blogsQueryParams.sortDirection ?? 'desc';
  //   const pageNumber = blogsQueryParams.pageNumber ?? 1;
  //   const pageSize = blogsQueryParams.pageSize ?? 10;

  //   const query = { name: new RegExp(searchNameTerm, 'i') };
  //   const skip = (pageNumber - 1) * pageSize;
  //   const countedDocuments = await this.blogsRepository.countDocuments(query);
  //   const pagesCount: number = Math.ceil(countedDocuments / pageSize);
  //   const allBlogs = await this.blogsRepository.getAllBlogs(
  //     query,
  //     sortBy,
  //     sortDirection,
  //     pageSize,
  //     skip,
  //   );
  //   const presentationAllblogs = {
  //     pagesCount,
  //     page: Number(pageNumber),
  //     pageSize: Number(pageSize),
  //     totalCount: countedDocuments,
  //     items: allBlogs,
  //   };

  //   return presentationAllblogs;
  // }

  // async updateBlog(
  //   id: string,
  //   blogsUpdateModel: BlogsCreateModel,
  // ): Promise<boolean> {
  //   return await this.blogsRepository.updateBlog(id, blogsUpdateModel);
  // }

  // async deleteBLog(id: string): Promise<boolean> {
  //   return await this.blogsRepository.deleteBlog(id);
  // }

  //   async createPostForSpecificBlog(
  //     postCreateModel: PostCreateModel,
  //     blogId: string,
  //   ): Promise<PostsDocument | null> {
  //     const isBlogExist = await this.blogsQueryRepository.getBlogById(
  //       new Types.ObjectId(blogId),
  //     );
  //     if (!isBlogExist) {
  //       return null;
  //     }

  //     const { title, shortDescription, content } = postCreateModel;
  //     const createdAt = new Date().toISOString();
  //     const id = new Types.ObjectId().toString();

  //     const extendedLikesInfo = new ExtendedLikesInfo();
  //     extendedLikesInfo.likesCount = 0;
  //     extendedLikesInfo.dislikesCount = 0;
  //     extendedLikesInfo.myStatus = 'None';
  //     extendedLikesInfo.newestLikes = [];

  //     const newPost = new Posts();
  //     newPost.title = title;
  //     newPost.shortDescription = shortDescription;
  //     newPost.content = content;
  //     newPost.blogId = isBlogExist.id;
  //     newPost.blogName = isBlogExist.name;
  //     newPost.createdAt = createdAt;
  //     newPost.extendedLikesInfo = extendedLikesInfo;

  //     return this.postsRepository.createPost(newPost);
  //   }
}
