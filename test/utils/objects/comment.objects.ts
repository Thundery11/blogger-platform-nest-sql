import { MyStatus } from '../../../src/features/likes/domain/likes.entity';
import {
  commentContent,
  commentUpdatedContent,
} from '../constants/comments.constants';

export const commentObject = {
  id: expect.any(String),
  content: commentContent,
  commentatorInfo: {
    userId: expect.any(String),
    userLogin: expect.any(String),
  },
  createdAt: expect.any(String),
  likesInfo: { likesCount: 0, dislikesCount: 0, myStatus: MyStatus.None },
};

export const updatedCommentObject = {
  id: expect.any(String),
  content: commentUpdatedContent,
  commentatorInfo: {
    userId: expect.any(String),
    userLogin: expect.any(String),
  },
  createdAt: expect.any(String),
  likesInfo: { likesCount: 0, dislikesCount: 0, myStatus: MyStatus.None },
};
