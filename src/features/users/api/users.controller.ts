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
import { AllUsersOutputModel } from './models/output/user-output.model';
import { UsersQueryRepository } from '../infrastructure/users-query.repository';
import { SortingQueryParamsForUsers } from './models/query/query-for-sorting';
import { BasicAuthGuard } from '../../auth/guards/basic-auth.guard';

@Controller('sa/users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private usersQueryRepository: UsersQueryRepository,
  ) {}

  @UseGuards(BasicAuthGuard)
  @Post()
  @HttpCode(201)
  async createSuperadminUser(@Body() userCreateModel: UserCreateModel) {
    const userId =
      await this.usersService.createSuperadminUser(userCreateModel);
    if (!userId) {
      throw new NotFoundException();
    }
    return await this.usersQueryRepository.getUser(userId);
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
