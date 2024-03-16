import { PartialType } from '@nestjs/swagger';
import { CreateTestWalletDto } from './create-test-wallet.dto';

export class UpdateTestWalletDto extends PartialType(CreateTestWalletDto) {}
