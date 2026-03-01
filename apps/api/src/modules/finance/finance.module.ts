import { Module } from '@nestjs/common';
import { FinanceService } from './finance.service';
import { FinanceController } from './finance.controller';
import { CurrencyService } from './currency.service';

@Module({
  providers: [FinanceService, CurrencyService],
  controllers: [FinanceController],
  exports: [CurrencyService]
})
export class FinanceModule { }
