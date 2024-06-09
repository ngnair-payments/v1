// src/permissions/permission.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Merchant } from '../../merchants/entities/merchant.entity';

@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  action: string;

  @Column()
  resource: string;

  @ManyToMany(() => User, user => user.permissions)
  @JoinTable({
    name: 'user_permissions',
    joinColumn: {
      name: 'permission',
      referencedColumnName: 'id'
    },
    inverseJoinColumn: {
      name: 'user',
      referencedColumnName: 'id'
    }
  })
  users: User[];

  @ManyToMany(() => Merchant, merchant => merchant.permissions)
  @JoinTable({
    name: 'merchant_permissions',
    joinColumn: {
      name: 'permission',
      referencedColumnName: 'id'
    },
    inverseJoinColumn: {
      name: 'merchant',
      referencedColumnName: 'id'
    }
  })
  merchants: Merchant[];

}
