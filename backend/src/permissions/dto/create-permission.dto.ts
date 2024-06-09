// src/permissions/dto/create-permission.dto.ts
import { IsNotEmpty, IsString, IsUUID, IsArray } from 'class-validator';

export class CreatePermissionDto {
  @IsNotEmpty()
  @IsArray()
  @IsUUID('4', { each: true })
  userIds: string[];

  @IsNotEmpty()
  @IsArray()
  @IsUUID('4', { each: true })
  merchantIds: string[];

  @IsNotEmpty()
  @IsString()
  action: string;

  @IsNotEmpty()
  @IsString()
  resource: string;
}
