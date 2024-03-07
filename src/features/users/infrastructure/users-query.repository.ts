import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Users } from '../domain/users.entity';
import { Model, Types } from 'mongoose';
import {
  UsersOutputModel,
  usersOutputMapper,
} from '../api/models/output/user-output.model';

@Injectable()
export class UsersQueryRepository {
  constructor(@InjectModel(Users.name) private usersModel: Model<Users>) {}
  async getUserById(usersId: Types.ObjectId): Promise<UsersOutputModel> {
    const user = await this.usersModel.findById(usersId, {
      _v: false,
    });
    if (!user) {
      throw new NotFoundException();
    }
    return usersOutputMapper(user);
  }
}
