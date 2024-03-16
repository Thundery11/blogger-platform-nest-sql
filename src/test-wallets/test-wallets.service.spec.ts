import { Test, TestingModule } from '@nestjs/testing';
import { TestWalletsService } from './test-wallets.service';

describe('TestWalletsService', () => {
  let service: TestWalletsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TestWalletsService],
    }).compile();

    service = module.get<TestWalletsService>(TestWalletsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
