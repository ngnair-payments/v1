// src/providers/dto/create-provider.dto.ts
import { IsNotEmpty, IsString,  IsEnum, IsUUID } from 'class-validator';
import { ProviderType } from '../entities/provider.entity';

export class CreateProviderDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEnum(ProviderType)
  type: ProviderType; // 'acquirer', 'processor', 'ach'

  @IsNotEmpty()
  @IsString()
  baseUrl: string;
}

