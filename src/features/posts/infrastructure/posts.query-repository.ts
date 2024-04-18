import { Injectable, NotFoundException } from '@nestjs/common';
import {
  PostOutputModel,
  allPostsOutputMapper,
  postsOutputMapperFinally,
} from '../api/models/output/post-output.model';
import { DataSource, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Posts } from '../domain/posts.entity';

@Injectable()
export class PostsQueryRepository {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(Posts) private postsRepository: Repository<Posts>,
  ) {}

  public async getPostById(postId: number): Promise<any> {
    try {
      const post = await this.postsRepository
        .createQueryBuilder('p')
        .leftJoin('p.blog', 'b')
        .select(['p', 'b.name']) // Выбираем все поля из сущности Post и поле name из сущности Blog
        .where('p.id = :postId', { postId })
        .getOne();
      if (!post) return null;
      console.log('🚀 ~ PostsQueryRepository ~ getPostById ~ post:', post);
      return postsOutputMapperFinally(post);

      // const post = await this.postsRepository
      //   .createQueryBuilder('p')
      //   .select('p.*, b.name as blogName')
      //   .leftJoin('p.blog', 'b')
      //   .where('p.id = :postId', { postId })
      //   .getRawAndEntities();
      // if (!post) return null;
      // console.log('🚀 ~ PostsQueryRepository ~ getPostById ~ post:', post);
      // return postsOutputMapperFinally(post);
    } catch (e) {
      throw e;
    }
  }
}
//   const post = await this.dataSource.query(
//     `SELECT p.*, b."name" as "blogName"
//     FROM public."Posts" p
//     LEFT JOIN "Blogs" b
//     ON b.id = p."blogId"
//     WHERE p."id" = $1;`,
//     [postId],
//   );
//   if (!post) {
//     throw new NotFoundException();
//   }

//   return postsOutputMapperFinally(post);
// }
