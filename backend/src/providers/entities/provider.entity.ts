// src/providers/provider.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum ProviderType {
  ACQUIRER = 'acquirer',
  PROCESSOR = 'processor',
  ACH = 'ach',
}

@Entity('providers')
export class Provider {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: ProviderType,
    nullable: false,
  })
  type: ProviderType;

  @Column()
  baseUrl: string;
}
