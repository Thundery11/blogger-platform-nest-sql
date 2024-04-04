import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../../users/module/users.module';
import { AuthService } from '../application/auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from '../strategies/local.strategy';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { AuthController } from '../api/auth.controller';
import { BasicStrategy } from '../strategies/basic.strategy';
import { jwtConstants, tokensLivesConstants } from '../constants/constants';
import { CqrsModule } from '@nestjs/cqrs';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { LoginUserUseCase } from '../application/use-cases/login-user-use-case';
import { MongooseModule } from '@nestjs/mongoose';
import {
  SecurityDevices,
  SecurityDevicesSchema,
} from '../../security-devices/domain/security-devices-entity';
import { SecurityDevicesRepository } from '../../security-devices/infrastructure/security-devices.repository';
import { SecurityDevicesService } from '../../security-devices/application/security-devices.service';
import { RefreshTokenUseCase } from '../application/use-cases/refresh-token-use-case';
import { SecurityDevicesController } from '../../security-devices/api/security-devices.controller';
import { GetDevicesUseCase } from '../../security-devices/application/use-cases/get-devices-use-case';
import { DeleteAllSessionsExceptCurentUseCase } from '../../security-devices/application/use-cases/delete-all-sessions-except-current-use-case';
import { DeleteSpecialSessionUseCase } from '../../security-devices/application/use-cases/delete-special-session-use-case';
import { LogoutUseCase } from '../application/use-cases/logout-use-case';

const useCases = [
  LoginUserUseCase,
  RefreshTokenUseCase,
  GetDevicesUseCase,
  DeleteAllSessionsExceptCurentUseCase,
  DeleteSpecialSessionUseCase,
  LogoutUseCase,
];
@Module({
  imports: [
    CqrsModule,
    UsersModule,
    PassportModule,
    ThrottlerModule.forRoot([
      {
        ttl: 100000,
        limit: 500,
      },
    ]),
    JwtModule.register({
      global: false,
      secret: jwtConstants.JWT_SECRET,
      signOptions: { expiresIn: tokensLivesConstants['1hour'] },
    }),
    MongooseModule.forFeature([
      {
        name: SecurityDevices.name,
        schema: SecurityDevicesSchema,
      },
    ]),
  ],

  providers: [
    AuthService,
    LocalStrategy,
    SecurityDevicesRepository,
    SecurityDevicesService,
    ...useCases,
    JwtStrategy,
    BasicStrategy,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  controllers: [AuthController, SecurityDevicesController],
  exports: [AuthService],
})
export class AuthModule {}
