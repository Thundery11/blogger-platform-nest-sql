import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TestWalletsService } from './test-wallets.service';
import { CreateTestWalletDto } from './dto/create-test-wallet.dto';
import { UpdateTestWalletDto } from './dto/update-test-wallet.dto';

@Controller('test-wallets')
export class TestWalletsController {
  constructor(private readonly testWalletsService: TestWalletsService) {}

  @Post()
  create(@Body() createTestWalletDto: CreateTestWalletDto) {
    return this.testWalletsService.create(createTestWalletDto);
  }

  @Get()
  findAll() {
    return this.testWalletsService.findAll();
  }
  @Get('withWallets')
  withWallets() {
    return this.testWalletsService.findUsersWithWallets();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.testWalletsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTestWalletDto: UpdateTestWalletDto,
  ) {
    return this.testWalletsService.update(+id, updateTestWalletDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.testWalletsService.remove(+id);
  }
}
