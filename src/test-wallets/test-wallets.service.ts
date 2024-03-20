import { Injectable } from '@nestjs/common';
import { CreateTestWalletDto } from './dto/create-test-wallet.dto';
import { UpdateTestWalletDto } from './dto/update-test-wallet.dto';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

type WalletType = {
  id: string;
  title: string;
};
type UserWithWalletsType = {
  id: number;
  lastName: string;
  wallets: WalletType[];
};
@Injectable()
export class TestWalletsService {
  constructor(@InjectDataSource() private dataSource: DataSource) {}
  create(createTestWalletDto: CreateTestWalletDto) {
    return 'This action adds a new testWallet';
  }
  // `SELECT w.*, u."FirstName" || ' ' || u."LastName" as "FullName"
  // FROM public."Wallets" w
  // LEFT JOIN public."Users" u
  // ON u.id = w."OwnerId";`
  async findAll() {
    const userWallets = await this.dataSource.query(`SELECT * from "ilya"`);
    const result = userWallets.map((w) => ({
      wallet: {
        id: w.id,
        title: w.Title,
        currency: w.Currency,
        balance: w.balance,
      },
      user: {
        id: w.OwnerId,
        fullname: w.FullName,
      },
    }));
    return userWallets;
  }
  async findUsersWithWallets(): Promise<UserWithWalletsType[]> {
    const query = `SELECT ru.*, w."Title" ,w."id" as "WalletId" 
    FROM(
      SELECT u.*
      FROM public."Users" u
      ORDER BY "id" asc
      LIMIT 2 OFFSET 1
    ) as ru
    LEFT JOIN public."Wallets" w
    ON ru."id" = w."OwnerId"
    `;

    const rawResult = await this.dataSource.query(query);
    console.log(rawResult);
    const result: UserWithWalletsType[] = [];
    for (const userRow of rawResult) {
      let userWithWallets = result.find((u) => u.id === userRow.id);
      if (!userWithWallets) {
        userWithWallets = {
          id: userRow.id,
          lastName: userRow.LastName,
          wallets: [],
        };
        result.push(userWithWallets);
      }
      userWithWallets.wallets.push({
        id: userRow.WalletId,
        title: userRow.Title,
      });
    }
    return result;
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
