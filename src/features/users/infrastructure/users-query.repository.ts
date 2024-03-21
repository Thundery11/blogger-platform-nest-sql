import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Users } from '../domain/users.entity';
import { Model, Types } from 'mongoose';
import {
  UsersOutputModel,
  usersOutputMapper,
  usersOutputMapper1,
} from '../api/models/output/user-output.model';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class UsersQueryRepository {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectModel(Users.name) private usersModel: Model<Users>,
  ) {}
  async getUserById(usersId: Types.ObjectId): Promise<UsersOutputModel> {
    const user = await this.usersModel.findById(usersId, {
      _v: false,
    });
    if (!user) {
      throw new NotFoundException();
    }
    return usersOutputMapper1(user);
  }
  async getUser(userId: number) {
    const user = await this.dataSource.query(
      `SELECT "id", "login", "email", "createdAt",
      "expirationDate" FROM public."Users" WHERE "id" = $1;`,
      [userId],
    );

    return usersOutputMapper(user);
  }
}
