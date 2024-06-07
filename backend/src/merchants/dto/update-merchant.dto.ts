// src/merchants/dto/update-merchant.dto.ts
import { IsNotEmpty, IsString,  IsNumber, IsPhoneNumber, IsUUID, IsOptional } from 'class-validator';

export class UpdateMerchantDto {
  @IsUUID()
  id?: string;

  @IsOptional({ message: 'Legal Name is required.' })
  @IsString()
  legal_name?: string;

  @IsOptional()
  @IsString()
  dba?: string;

  @IsString()
  @IsOptional()
  friendly_name?: string;

  @IsString()
  @IsOptional()
  app_id?: string

  @IsOptional()
  @IsNumber()
  ein?: number;

  @IsString()
  @IsOptional()
  street?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  state?: string;

  @IsString()
  @IsOptional()
  postal_code?: string;

  @IsString()
  @IsOptional()
  application_id?: string;

  @IsString()
  @IsOptional()
  gateway_id?: string;
}
