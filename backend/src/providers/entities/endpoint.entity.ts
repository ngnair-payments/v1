// src/providers/endpoint.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Provider } from './provider.entity';

export enum EndpointType {
  TRANSACTIONS = 'transactions',
  TRANSACTION_DETAILS = 'transaction_details',
  PRODUCTS = 'products',
  PRODUCT_DETAILS = 'product_details',
  MERCHANTS = 'merchants',
  MERCHANT_DETAILS = 'merchant_details',
  CATEGORIES = 'categories',
  CATEGORY_DETAILS = 'category_details',
  ACCOUNT = 'account',
  ACCOUNT_DETAILS = 'account_details',
  WALLETS = 'wallets',
  WALLET_DETAILS = 'wallet_details',
  APPLICATIONS = 'applications',
  APPLICATION_DETAILS = 'application_details',
  ACCESS_TOKEN = 'access_token',
  API_KEY = 'api_key',
}

@Entity()
export class Endpoint {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Provider, provider => provider.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'providerId' })
  provider: Provider;

  @Column()
  providerId: string;

  @Column({
    type: 'enum',
    enum: EndpointType,
  })
  type: EndpointType;

  @Column()
  path: string;
}
