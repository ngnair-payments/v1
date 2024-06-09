// src/endpoints/dto/update-endpoint.dto.ts
import { IsString, IsUUID, IsEnum, IsOptional } from 'class-validator';
import { EndpointType } from '../entities/endpoint.entity';

export class UpdateEndpointDto {
  @IsOptional()
  @IsUUID()
  providerId?: string;

  @IsOptional()
  @IsEnum(EndpointType)
  type?: EndpointType;

  @IsOptional()
  @IsString()
  path?: string;
  
  }