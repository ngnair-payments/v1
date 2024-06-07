// src/merchants/dto/create-merchant.dto.ts
import { IsNotEmpty, IsString,  IsNumber, IsPhoneNumber, IsUUID } from 'class-validator';

export class CreateMerchantDto {
  @IsUUID()
  id: string;

  @IsNotEmpty({ message: 'Legal Name is required.' })
  @IsString()
  legal_name: string;

  @IsNotEmpty()
  @IsString()
  dba: string;

  @IsString()
  friendly_name: string;

  @IsString()
  app_id: string

  @IsNotEmpty()
  @IsNumber()
  ein: number;

  @IsString()
  street: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsString()
  postal_code: string;

  @IsString()
  application_id: string;

  @IsString()
  gateway_id: string;
}
