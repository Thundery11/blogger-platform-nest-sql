import { Injectable } from '@nestjs/common';
import { Users, UsersDocument } from '../domain/users.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  UserFomDb,
  UserInfoAboutHimselfModel,
  UsersOutputModel,
  allUsersOutputMapper,
  userInfoAboutHimselfMapper,
} from '../api/models/output/user-output.model';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UserCreateDto } from '../api/models/input/create-user.input.model';

// const selectUsersConstant = ['login', 'email', 'createdAt', 'expirationDate'];
@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(Users.name) private usersModel: Model<Users>,
    @InjectDataSource() private dataSource: DataSource,
  ) {}
  async createSuperadminUser(userCreateDto: UserCreateDto) {
    const insertQuery = `INSERT INTO public."Users"(
      login, email, "passwordHash", "passwordSalt", "createdAt",
       "confirmationCode", "expirationDate", "isConfirmed")
      VALUES ('${userCreateDto.login}', '${userCreateDto.email}', 
        '${userCreateDto.passwordHash}', '${userCreateDto.passwordSalt}', '${userCreateDto.createdAt}', '${userCreateDto.confirmationCode}',
         '${userCreateDto.expirationDate}', '${userCreateDto.isConfirmed}') RETURNING id`;

    const newUser = await this.dataSource.query(insertQuery);
    const userId = newUser[0].id;
    return userId;
  }
  public async getAllUsers(
    sortBy: string,
    sortDirection: string,
    pageSize: number,
    skip: number,
    searchLoginTerm: string,
    searchEmailTerm: string,
  ): Promise<UsersOutputModel[]> {
    const selectQuery = `SELECT "id", "login", "email", "createdAt",
    "expirationDate" FROM public."Users" u
    WHERE u."login" ILIKE $1 OR u."email" ILIKE $2
     ORDER BY u."${sortBy}" ${sortDirection} 
     LIMIT ${pageSize} OFFSET ${skip};
     `;
    const users = await this.dataSource.query(selectQuery, [
      `%${searchLoginTerm}%`,
      `%${searchEmailTerm}%`,
    ]);
    return allUsersOutputMapper(users);
  }

  public async countDocuments(
    searchLoginTerm: string,
    searchEmailTerm: string,
  ): Promise<number> {
    const selectQuery = `SELECT COUNT(*) FROM public."Users" u
    WHERE u."login" ILIKE $1 OR u."email" ILIKE $2;`;
    const result = await this.dataSource.query(selectQuery, [
      `%${searchLoginTerm}%`,
      `%${searchEmailTerm}%`,
    ]);
    const totalCount = Number(result[0].count);
    return totalCount;
    // ``
  }

  public async deleteUser(id: string): Promise<boolean> {
    const result = await this.dataSource.query(`DELETE FROM public."Users"
    WHERE "id" = ${id}
    RETURNING "id";`);
    return result[1] === 1 ? true : false;
  }
  async findUserByLogin(loginOrEmail: string): Promise<UserFomDb | null> {
    const user = await this.dataSource.query(
      `SELECT * FROM public."Users" u
    WHERE u."login" LIKE $1 OR u."email" LIKE $1;`,
      [loginOrEmail],
    );
    if (!user[0]) {
      return null;
    }
    return user[0];
  }
  async findUserById(
    currentUserId: string,
  ): Promise<UserInfoAboutHimselfModel | null> {
    const user = await this.usersModel.findById(
      new Types.ObjectId(currentUserId),
      {
        _v: false,
      },
    );
    if (!user) {
      return null;
    }
    return userInfoAboutHimselfMapper(user);
  }
  async findUserByIdForRefreshTokens(
    currentUserId: string,
  ): Promise<UsersDocument | null> {
    const user = await this.usersModel.findById(
      new Types.ObjectId(currentUserId),
      {
        _v: false,
      },
    );
    if (!user) {
      return null;
    }
    return user;
  }
  async updateConfirmationCode(
    id: number,
    confirmationCode: string,
  ): Promise<boolean> {
    const result = await this.dataSource.query(
      `UPDATE public."Users" 
    SET "confirmationCode" = '${confirmationCode}'
    WHERE "id" = ${id};`,
    );
    return result[1] === 1 ? true : false;
  }
  async findUserByConfirmationCode(
    code: string,
  ): Promise<UsersDocument | null> {
    return await this.usersModel.findOne({
      'emailConfirmation.confirmationCode': code,
    });
  }
  async updateConfirmation(id: string): Promise<boolean> {
    const result = await this.usersModel.updateOne(
      { _id: new Types.ObjectId(id) },
      { 'emailConfirmation.isConfirmed': true },
    );
    return result.modifiedCount === 1;
  }
}
