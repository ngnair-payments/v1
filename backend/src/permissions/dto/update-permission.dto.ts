// src/permissions/dto/update-permission.dto.ts
import { IsString, IsUUID, IsArray, IsOptional } from 'class-validator';

export class UpdatePermissionDto {
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  userIds?: string[];

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  merchantIds?: string[];

  @IsOptional()
  @IsString()
  action?: string;

  @IsOptional()
  @IsString()
  resource?: string;
}
