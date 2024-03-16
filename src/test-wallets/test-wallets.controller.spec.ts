import { Test, TestingModule } from '@nestjs/testing';
import { TestWalletsController } from './test-wallets.controller';
import { TestWalletsService } from './test-wallets.service';

describe('TestWalletsController', () => {
  let controller: TestWalletsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestWalletsController],
      providers: [TestWalletsService],
    }).compile();

    controller = module.get<TestWalletsController>(TestWalletsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
