// src/transactions/transactions.service.ts
import { Injectable, HttpService, NotFoundException } from '@nestjs/common';
import { ProvidersService } from '../providers/providers.service';
import { MerchantsService } from '../merchants/merchants.service';
import { EndpointType } from '../providers/entities/endpoint.entity';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly httpService: HttpService,
    private readonly providersService: ProvidersService,
    private readonly merchantsService: MerchantsService,
  ) {}

  async getTransactions(merchantId: string, providerId: string) {
    const endpoint = await this.providersService.getEndpoint(providerId, EndpointType.TRANSACTIONS);
    if (!endpoint) {
      const merchant = await this.merchantsService.findOne(merchantId); // Fetch merchant details
      throw new NotFoundException(`Endpoint transactions not found for ${merchant.dba}`);
    }
    const url = endpoint.path.replace('{merchantId}', merchantId);
    return this.httpService.get(url).toPromise();
  }

  async getTransactionDetails(transactionId: string, providerId: string) {
    const endpoint = await this.providersService.getEndpoint(providerId, EndpointType.TRANSACTION_DETAILS);
    if (!endpoint) {
      const merchant = await this.merchantsService.findOne(transactionId); // Fetch merchant details
      throw new NotFoundException(`Endpoint transactionDetails not found for merchant ${merchant.dba}`);
    }
    const url = endpoint.path.replace('{transactionId}', transactionId);
    return this.httpService.get(url).toPromise();
  }
}
