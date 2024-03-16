import { Injectable } from '@nestjs/common';
import { CreateTestWalletDto } from './dto/create-test-wallet.dto';
import { UpdateTestWalletDto } from './dto/update-test-wallet.dto';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class TestWalletsService {
  constructor(@InjectDataSource() private dataSource: DataSource) {}
  create(createTestWalletDto: CreateTestWalletDto) {
    return 'This action adds a new testWallet';
  }

  findAll() {
    return this.dataSource
      .query(`SELECT id, "walletId", "userId", "addetAt", status
    FROM public."WalletsSharings";`);
  }

  findOne(id: number) {
    return `This action returns a #${id} testWallet`;
  }

  update(id: number, updateTestWalletDto: UpdateTestWalletDto) {
    return `This action updates a #${id} testWallet`;
  }

  remove(id: number) {
    return `This action removes a #${id} testWallet`;
  }
}
