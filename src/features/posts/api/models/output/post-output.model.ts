import { PostsDocument } from '../../../domain/posts.entity';

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
export const postsOutputMapper = (post: PostsDocument | null) => {
  if (!post) {
    return null;
  }
  return postsOutputMapperFinally(post);
};

export const postsOutputMapperFinally = (
  post: PostsDocument,
): PostOutputModel => {
  console.log(post);

  const outputModel = new PostOutputModel(
    (post.id = post._id.toString()),
    post.title,
    post.shortDescription,
    post.content,
    post.blogId,
    post.blogName,
    post.createdAt,
    ExtendedLikesInfo.getDefault(),
  );

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
  posts: PostsDocument[],
): PostOutputModel[] => {
  const allPostsOutput = posts.map((post) => ({
    id: post._id.toString(),
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: post.blogId,
    blogName: post.blogName,
    createdAt: post.createdAt,
    extendedLikesInfo: {
      likesCount: post.extendedLikesInfo.likesCount,
      dislikesCount: post.extendedLikesInfo.dislikesCount,
      myStatus: post.extendedLikesInfo.myStatus,
      newestLikes: post.extendedLikesInfo.newestLikes,
    },
  }));
  return allPostsOutput;
};
