import { Controller, Delete, HttpCode, Post } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blogs } from '../blogs/domain/blogs.entity';
import { Model } from 'mongoose';
import { Posts } from '../posts/domain/posts.entity';
import { Users } from '../users/domain/users.entity';
import { Comments } from '../comments/domain/comments.entity';
import { LastLikedDbModel, LikesDbModel } from '../likes/domain/likes.entity';
import { SecurityDevices } from '../security-devices/domain/security-devices-entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Controller('testing/all-data')
export class TestingAllDataController {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  @Delete()
  @HttpCode(204)
  async deleteAll() {
    await this.dataSource.query(
      'TRUNCATE public."Users", public."Devices", public."Blogs", public."Posts", public."Comments", public."LikesForComments", public."LikesForPosts", public."LastLiked", public."users", public."blogs"',
    );
  }
}
