import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserCreateModel } from './models/input/create-user.input.model';
import { UsersService } from '../application/users.service';
import {
  AllUsersOutputModel,
  UsersOutputModel,
} from './models/output/user-output.model';
import { UsersQueryRepository } from '../infrastructure/users-query.repository';
import { AllPostsOutputModel } from '../../posts/api/models/output/post-output.model';
import { SortingQueryParamsForUsers } from './models/query/query-for-sorting';
import { BasicAuthGuard } from '../../auth/guards/basic-auth.guard';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private usersQueryRepository: UsersQueryRepository,
  ) {}

  @UseGuards(BasicAuthGuard)
  @Post()
  @HttpCode(201)
  async createSuperadminUser(
    @Body() userCreateModel: UserCreateModel,
  ): Promise<UsersOutputModel> {
    const result =
      await this.usersService.createSuperadminUser(userCreateModel);
    if (!result) {
      throw new NotFoundException();
    }
    return await this.usersQueryRepository.getUserById(result._id);
  }

  @UseGuards(BasicAuthGuard)
  @Get()
  @HttpCode(200)
  async getAllUsers(
    @Query() sortingQueryParams: SortingQueryParamsForUsers,
  ): Promise<AllUsersOutputModel> {
    return await this.usersService.getAllUsers(sortingQueryParams);
  }

  @UseGuards(BasicAuthGuard)
  @Delete(':id')
  @HttpCode(204)
  async deleteUser(@Param('id') id: string): Promise<boolean> {
    const result = await this.usersService.deleteUser(id);
    if (!result) {
      throw new NotFoundException();
    }
    return result;
  }
}
