import { Module } from '@nestjs/common';
import { TestWalletsService } from './test-wallets.service';
import { TestWalletsController } from './test-wallets.controller';

@Module({
  controllers: [TestWalletsController],
  providers: [TestWalletsService],
})
export class TestWalletsModule {}
