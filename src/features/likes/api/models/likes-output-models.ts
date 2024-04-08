import { LikesDocument, MyStatus } from '../../domain/likes.entity';

export class WhatIsMyStatus {
  myStatus: MyStatus;
}

export class LikesFromDb {
  id: number;
  userId: number;
  parentId: number;
  myStatus: string;
  createdAt: string;
}

export const whatIsMyStatusMapper = (
  whatIsMyStatus: LikesDocument,
): WhatIsMyStatus => {
  const outputModel = new WhatIsMyStatus();
  outputModel.myStatus = whatIsMyStatus.myStatus;
  console.log('likeStatus: ', outputModel);
  return outputModel;
};

export class LastLikedOutputType {
  addedAt: string;
  userId: string;
  login: string;
}
export class LastLikedFromDb {
  addedAt: string;
  userId: number;
  login: string;
}

export const lastLikedOutputMapper = (
  lastLiked: LastLikedFromDb[],
): LastLikedOutputType[] => {
  const output = lastLiked.map((l) => ({
    addedAt: l.addedAt,
    userId: l.userId.toString(),
    login: l.login,
  }));
  return output;
};
