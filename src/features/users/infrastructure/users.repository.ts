import { Injectable } from '@nestjs/common';
import { Users, UsersDocument } from '../domain/users.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  UserInfoAboutHimselfModel,
  UsersOutputModel,
  allUsersOutputMapper,
  userInfoAboutHimselfMapper,
} from '../api/models/output/user-output.model';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UserCreateDto } from '../api/models/input/create-user.input.model';

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
    // const us = await this.dataSource.query(`SELECT * FROM public."Users";`);

    // console.log({ createdUser: createdUser });
    // return us[0];
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
    const users = await this.usersModel
      .find(
        {
          $or: [
            { 'accountData.login': { $regex: searchLoginTerm, $options: 'i' } },
            { 'accountData.email': { $regex: searchEmailTerm, $options: 'i' } },
          ],
        },
        { __v: false, passwordHash: false, passwordSalt: false },
      )
      .sort({ [`accountData.${sortBy}`]: sortDirection === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(Number(pageSize));
    // const userss = await this.dataSource.query(`SELECT * FROM public."Users"`)
    return allUsersOutputMapper(users);
  }

  public async countDocuments(
    searchLoginTerm: string,
    searchEmailTerm: string,
  ): Promise<number> {
    return await this.usersModel.countDocuments({
      $or: [
        { 'accountData.login': { $regex: searchLoginTerm, $options: 'i' } },
        { 'accountData.email': { $regex: searchEmailTerm, $options: 'i' } },
      ],
    });
  }
  public async deleteUser(id: string): Promise<boolean> {
    const result = await this.usersModel.deleteOne({
      _id: new Types.ObjectId(id),
    });
    return result.deletedCount ? true : false;
  }
  async findUserByLogin(loginOrEmail: string): Promise<UsersDocument | null> {
    const user = await this.usersModel.findOne({
      $or: [
        { 'accountData.login': loginOrEmail },
        { 'accountData.email': loginOrEmail },
      ],
    });
    if (!user) {
      return null;
    }
    return user;
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
    id: string,
    confirmationCode: string,
  ): Promise<boolean> {
    const result = await this.usersModel.updateOne(
      { _id: new Types.ObjectId(id) },
      { 'emailConfirmation.confirmationCode': confirmationCode },
    );
    return result.modifiedCount === 1;
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
