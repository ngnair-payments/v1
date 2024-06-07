// src/merchants/merchant.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { IsNotEmpty, IsEmail, IsString,IsPhoneNumber, IsNumber, IsUUID } from 'class-validator';

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

  @Column()
  @IsString()
  application_id: string;

  @Column()
  @IsString()
  gateway_id: string;
}
