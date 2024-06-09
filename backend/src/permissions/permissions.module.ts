import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { User } from '../users/entities/user.entity';
import { Merchant } from '../merchants/entities/merchant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Permission, User, Merchant])],
  controllers: [PermissionsController],
  providers: [PermissionsService],
})
export class PermissionsModule {}
