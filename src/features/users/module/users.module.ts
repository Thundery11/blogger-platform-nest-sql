import { Module } from '@nestjs/common';
import { UsersService } from '../application/users.service';
import { UsersRepository } from '../infrastructure/users.repository';
import { UsersQueryRepository } from '../infrastructure/users-query.repository';
import { UsersController } from '../api/users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Users, UsersSchema } from '../domain/users.entity';
import { EmailsManager } from '../../../infrastucture/managers/emails-manager';
import { EmailAdapter } from '../../../infrastucture/adapters/email-adapter';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([
      {
        name: Users.name,
        schema: UsersSchema,
      },
    ]),
  ],
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
