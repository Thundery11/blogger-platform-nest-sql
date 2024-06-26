import { MyStatus } from '../../../src/features/likes/domain/likes.entity';
import {
  postContent,
  postShortDescription,
  postTitle,
  postUpdatedContent,
  postUpdatedShortDescription,
  postUpdatedTitle,
} from '../constants/posts.constants';

export const createdPostObject = {
  id: expect.any(String),
  title: postTitle,
  shortDescription: postShortDescription,
  content: postContent,
  blogId: expect.any(String),
  blogName: expect.any(String),
  createdAt: expect.any(String),
  extendedLikesInfo: {
    likesCount: 0,
    dislikesCount: 0,
    myStatus: MyStatus.None,
    newestLikes: [],
  },
  images: {
    main: [],
  },
};

export const postObject = {
  id: expect.any(String),
  title: postTitle,
  shortDescription: postShortDescription,
  content: postContent,
  blogId: expect.any(String),
  blogName: expect.any(String),
  createdAt: expect.any(String),
  extendedLikesInfo: {
    likesCount: 0,
    dislikesCount: 0,
    myStatus: MyStatus.None,
    newestLikes: [],
  },
  images: {
    main: [
      {
        url: expect.any(String),
        width: expect.any(Number),
        height: expect.any(Number),
        fileSize: expect.any(Number),
      },
      {
        url: expect.any(String),
        width: expect.any(Number),
        height: expect.any(Number),
        fileSize: expect.any(Number),
      },
      {
        url: expect.any(String),
        width: expect.any(Number),
        height: expect.any(Number),
        fileSize: expect.any(Number),
      },
    ],
  },
};

export const updatedPostObject = {
  id: expect.any(String),
  title: postUpdatedTitle,
  shortDescription: postUpdatedShortDescription,
  content: postUpdatedContent,
  blogId: expect.any(String),
  blogName: expect.any(String),
  createdAt: expect.any(String),
  extendedLikesInfo: {
    likesCount: 0,
    dislikesCount: 0,
    myStatus: MyStatus.None,
    newestLikes: [],
  },
  images: {
    main: [],
  },
};
