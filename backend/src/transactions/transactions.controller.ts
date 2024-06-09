// src/transactions/transactions.controller.ts
import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('v1/transactions')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get(':merchantId/all')
  async getTransactions(
    @Param('merchantId') merchantId: string,
    @Query('providerId') providerId: string,
  ) {
    return this.transactionsService.getTransactions(merchantId, providerId);
  }

  @Get('details/:transactionId')
  async getTransactionDetails(
    @Param('transactionId') transactionId: string,
    @Query('providerId') providerId: string,
  ) {
    return this.transactionsService.getTransactionDetails(transactionId, providerId);
  }
}
