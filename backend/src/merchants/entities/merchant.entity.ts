// src/merchants/merchant.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { Provider } from '../../providers/entities/provider.entity';
import { Permission } from '../../permissions/entities/permission.entity';

@Entity('merchants')
export class Merchant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsNotEmpty()
  @IsString()
  legal_name: string;

  @Column()
  @IsNotEmpty()
  @IsString()
  dba: string;

  @Column()
  @IsString()
  friendly_name: string;

  @Column()
  @IsNotEmpty()
  @IsNumber()
  ein: number;

  @Column()
  @IsString()
  street: string;

  @Column()
  @IsString()
  city: string;

  @Column()
  @IsString()
  state: string;

  @Column()
  @IsString()
  postal_code: string;

  @ManyToMany(() => Permission, permission => permission.merchants)
  @JoinTable()
  permissions: Permission[];

  @ManyToOne(() => Provider)
  @JoinColumn({ name: 'acquirerId' })
  acquirer: Provider;

  @Column({ nullable: true })
  acquirerName: string;

  @Column({ nullable: true })
  acquirerAccountId: string;

  @ManyToOne(() => Provider)
  @JoinColumn({ name: 'processorId' })
  processor: Provider;

  @Column({ nullable: true })
  processorName: string;

  @Column({ nullable: true })
  processorAccountId: string;

  @ManyToOne(() => Provider)
  @JoinColumn({ name: 'achId' })
  ach: Provider;

  @Column({ nullable: true })
  achName: string;

  @Column({ nullable: true })
  achAccountId: string;
}
