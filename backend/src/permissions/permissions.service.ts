// src/permissions/permissions.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './entities/permission.entity';
import { User } from '../users/entities/user.entity';
import { Merchant } from '../merchants/entities/merchant.entity';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionsRepository: Repository<Permission>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Merchant)
    private readonly merchantRepository: Repository<Merchant>,
  ) {}

  async create(createPermissionDto: CreatePermissionDto): Promise<Permission> {
    const { userIds, merchantIds, action, resource } = createPermissionDto;

    const users = await this.userRepository.findByIds(userIds);
    const merchants = await this.merchantRepository.findByIds(merchantIds);

    const permission = this.permissionsRepository.create({ action, resource, users, merchants });
    return this.permissionsRepository.save(permission);
  }

  async get(): Promise<Permission[]> {
    return this.permissionsRepository.find({ relations: ['users', 'merchants'] });
  }

  async update(id: string, updatePermissionDto: UpdatePermissionDto): Promise<Permission> {
    const permission = await this.permissionsRepository.findOne({ where: { id }, relations: ['users', 'merchants'] });
    if (!permission) {
      throw new NotFoundException(`Permission with ID ${id} not found`);
    }
    const { userIds, merchantIds, action, resource } = updatePermissionDto;

    if (userIds) {
      const users = await this.userRepository.findByIds(userIds);
      permission.users = users;
    }

    if (merchantIds) {
      const merchants = await this.merchantRepository.findByIds(merchantIds);
      permission.merchants = merchants;
    }

    if (action) {
      permission.action = action;
    }

    if (resource) {
      permission.resource = resource;
    }

    return this.permissionsRepository.save(permission);
  }

  async findAll(): Promise<Permission[]> {
    return this.permissionsRepository.find({ relations: ['users', 'merchants'] });
  }

  async findOne(id: string): Promise<Permission> {
    const permission = await this.permissionsRepository.findOne({ where: {id}, relations: ['users', 'merchants'] });
    if (!permission) {
      throw new NotFoundException(`Permission with ID ${id} not found`);
    }
    return permission;
  }

  async remove(id: string): Promise<void> {
    const result = await this.permissionsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Permission with ID ${id} not found`);
    }
  }
}
