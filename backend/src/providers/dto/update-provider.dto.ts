// src/providers/dto/update-provider.dto.ts
import { IsString, IsEnum, IsOptional } from 'class-validator';
import { ProviderType } from '../entities/provider.entity';

export class UpdateProviderDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(ProviderType)
  type?: string;

  @IsOptional()
  @IsString()
  baseUrl?: string;

}