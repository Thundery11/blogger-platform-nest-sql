import { Module } from '@nestjs/common';
import { UsersService } from '../application/users.service';
import { UsersRepository } from '../infrastructure/users.repository';
import { UsersQueryRepository } from '../infrastructure/users-query.repository';
import { UsersController } from '../api/users.controller';
import { Users } from '../domain/users.entity';
import { EmailsManager } from '../../../infrastucture/managers/emails-manager';
import { EmailAdapter } from '../../../infrastucture/adapters/email-adapter';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([Users])],
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersRepository,
    UsersQueryRepository,
    EmailsManager,
    EmailAdapter,
  ],
  exports: [UsersService, UsersRepository, UsersQueryRepository],
})
export class UsersModule {}
