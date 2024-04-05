import { MyStatus } from '../../../../likes/domain/likes.entity';
import { PostsDocument } from '../../../domain/posts.entity';

export class PostFromDb {
  constructor(
    public id: number,
    public title: string,
    public shortDescription: string,
    public content: string,
    public blogId: string,
    public blogName: string,
    public createdAt: string,
  ) {}
}
class NewestLikes {
  addedAt: string;

  userId: string;

  login: string;
}
class ExtendedLikesInfo {
  constructor(
    public likesCount: number,
    public dislikesCount: number,
    public myStatus: string,
    public newestLikes: NewestLikes[],
  ) {}

  static getDefault() {
    return new this(0, 0, 'None', []);
  }
}

export class PostOutputModel {
  constructor(
    public id: string,
    public title: string,
    public shortDescription: string,
    public content: string,
    public blogId: string,
    public blogName: string,
    public createdAt: string,
    public extendedLikesInfo: ExtendedLikesInfo,
  ) {}
}
// export const postsOutputMapper = (post: PostsDocument | null) => {
//   if (!post) {
//     return null;
//   }
//   return postsOutputMapperFinally(post);
// };

export const postsOutputMapperFinally = (
  post: PostFromDb[],
): PostOutputModel => {
  const outputModel = post.map((p) => ({
    id: p.id.toString(),
    title: p.title,
    shortDescription: p.shortDescription,
    content: p.content,
    blogId: p.blogId,
    blogName: p.blogName,
    createdAt: p.createdAt,
    extendedLikesInfo: {
      likesCount: 0,
      dislikesCount: 0,
      myStatus: MyStatus.None,
      newestLikes: [],
    },
  }))[0];

  return outputModel;
};

export class AllPostsOutputModel {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: PostOutputModel[];
}

export const allPostsOutputMapper = (
  posts: PostFromDb[],
): PostOutputModel[] => {
  const allPostsOutput = posts.map((post) => ({
    id: post.id.toString(),
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: post.blogId,
    blogName: post.blogName,
    createdAt: post.createdAt,
    extendedLikesInfo: {
      likesCount: 0,
      dislikesCount: 0,
      myStatus: MyStatus.None,
      newestLikes: [],
    },
  }));
  return allPostsOutput;
};
