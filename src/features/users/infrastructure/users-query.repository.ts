import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Users } from '../domain/users.entity';
import { Model, Types } from 'mongoose';
import {
  UsersOutputModel,
  usersOutputMapper,
} from '../api/models/output/user-output.model';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UsersQueryRepository {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async getUser(userId: number): Promise<UsersOutputModel | null> {
    const user = await this.usersRepository.findOneBy({ id: userId });
    // const user = await this.dataSource.query(
    //   `SELECT "id", "login", "email", "createdAt",
    //   "expirationDate" FROM public."Users" WHERE "id" = $1;`,
    //   [userId],
    // );
    if (!user) return null;

    return usersOutputMapper(user);
  }
}
