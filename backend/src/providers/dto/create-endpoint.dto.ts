// src/endpoints/dto/update-endpoint.dto.ts
import { IsString, IsNotEmpty, IsUUID, IsEnum } from 'class-validator';
import { EndpointType } from '../entities/endpoint.entity';

export class CreateEndpointDto {
  @IsNotEmpty()
  @IsUUID()
  providerId: string;

  @IsNotEmpty()
  @IsEnum(EndpointType)
  type: EndpointType;

  @IsNotEmpty()
  @IsString()
  path: string;
  
  }