import { MyStatus } from '../../../../likes/domain/likes.entity';
import { Comments, CommentsDocument } from '../../../domain/comments.entity';

class LikesInfo {
  constructor(
    public likesCount: number,
    public dislikesCount: number,
    public myStatus: string,
  ) {}

  static getDefault() {
    return new this(0, 0, MyStatus.None);
  }
}
class CommentatorInfo {
  constructor(
    public userId: string,
    public userLogin: string,
  ) {}
}

export class CommentFromDb {
  id: number;
  content: string;
  userId: number;
  userLogin: string;
  createdAt: string;
}

export class CommentsOutputModel {
  constructor(
    public id: string,
    public content: string,
    public commentatorInfo: CommentatorInfo,
    public createdAt: string,
    public likesInfo: LikesInfo,
  ) {}
}
export class AllCommentsOutputModel {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: CommentsOutputModel[];
}

export const commentsOutputQueryMapper = (
  comment: Comments,
): CommentsOutputModel => {
  const outputModel = new CommentsOutputModel(
    comment.id.toString(),
    comment.content,
    new CommentatorInfo(comment.userId.toString(), comment.user.login),
    comment.createdAt,
    LikesInfo.getDefault(),
  );
  // comment.map((c) => ({
  //   id: c.id.toString(),
  //   content: c.content,
  //   commentatorInfo: {
  //     userId: c.userId.toString(),
  //     userLogin: c.userLogin,
  //   },
  //   createdAt: c.createdAt,
  //   likesInfo: {
  //     likesCount: 0,
  //     dislikesCount: 0,
  //     myStatus: MyStatus.None,
  //   },
  // }))[0];
  return outputModel;
};

export const AllCommentsOutputMapper = (
  comments: Comments[],
): CommentsOutputModel[] => {
  const allCommentsOutput = comments.map((comment) => ({
    id: comment.id.toString(),
    content: comment.content,
    commentatorInfo: {
      userId: comment.userId.toString(),
      userLogin: comment.user.login,
    },
    createdAt: comment.createdAt,
    likesInfo: {
      likesCount: 0,
      dislikesCount: 0,
      myStatus: MyStatus.None,
    },
  }));
  return allCommentsOutput;
};
