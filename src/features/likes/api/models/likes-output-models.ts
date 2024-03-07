import { LikesDocument, MyStatus } from '../../domain/likes.entity';

export class WhatIsMyStatus {
  myStatus: MyStatus;
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
