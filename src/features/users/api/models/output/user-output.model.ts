import { UsersDocument } from '../../../domain/users.entity';

export class UsersOutputModel {
  id: string;
  login: string;
  email: string;
  createdAt: string;
}

export class AllUsersOutputModel {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: UsersOutputModel[];
}
export class UserInfoAboutHimselfModel {
  email: string;
  login: string;
  userId?: string;
}

export const usersOutputMapper = (user: UsersDocument): UsersOutputModel => {
  const outputModel = new UsersOutputModel();
  outputModel.id = user._id.toString();
  outputModel.login = user.accountData.login;
  outputModel.email = user.accountData.email;
  outputModel.createdAt = user.accountData.createdAt;
  return outputModel;
};
export const userInfoAboutHimselfMapper = (
  user: UsersDocument,
): UserInfoAboutHimselfModel => {
  const outputModel = new UserInfoAboutHimselfModel();
  outputModel.email = user.accountData.email;
  outputModel.login = user.accountData.login;
  outputModel.userId = user._id.toString();
  return outputModel;
};

export const allUsersOutputMapper = (
  users: UsersDocument[],
): UsersOutputModel[] => {
  const allUsersOutput = users.map((user) => ({
    id: user._id.toString(),
    login: user.accountData.login,
    email: user.accountData.email,
    createdAt: user.accountData.createdAt,
  }));
  return allUsersOutput;
};
