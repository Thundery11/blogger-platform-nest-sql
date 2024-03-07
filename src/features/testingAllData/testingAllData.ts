import { Controller, Delete, HttpCode, Post } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blogs } from '../blogs/domain/blogs.entity';
import { Model } from 'mongoose';
import { Posts } from '../posts/domain/posts.entity';
import { Users } from '../users/domain/users.entity';
import { Comments } from '../comments/domain/comments.entity';
import { LastLikedDbModel, LikesDbModel } from '../likes/domain/likes.entity';
import { SecurityDevices } from '../security-devices/domain/security-devices-entity';

@Controller('testing/all-data')
export class TestingAllDataController {
  constructor(
    @InjectModel(Blogs.name) private blogsModel: Model<Blogs>,
    @InjectModel(Posts.name) private postsModel: Model<Posts>,
    @InjectModel(Users.name) private usersModel: Model<Users>,
    @InjectModel(Comments.name) private commentsModel: Model<Comments>,
    @InjectModel(LikesDbModel.name) private likesModel: Model<LikesDbModel>,
    @InjectModel(LastLikedDbModel.name)
    private lastLikedModel: Model<LastLikedDbModel>,
    @InjectModel(SecurityDevices.name)
    private securityDevicesModel: Model<SecurityDevices>,
  ) {}

  @Delete()
  @HttpCode(204)
  async deleteAll() {
    await this.postsModel.deleteMany({});
    await this.blogsModel.deleteMany({});
    await this.usersModel.deleteMany({});
    await this.commentsModel.deleteMany({});
    await this.lastLikedModel.deleteMany({});
    await this.likesModel.deleteMany({});
    await this.securityDevicesModel.deleteMany({});
  }
}
