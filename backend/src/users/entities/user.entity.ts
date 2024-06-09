// src/users/entities/user.entity.ts

import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { IsEmail, IsNotEmpty, IsString, IsPhoneNumber } from 'class-validator';
import { Permission } from '../../permissions/entities/permission.entity';


@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 'user' })
  @IsString()
  role: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @Column({ unique: true })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Column()
  @IsPhoneNumber(null)
  @IsNotEmpty()
  phone: string;

  @Column()
  @IsString()
  title: string;

  @Column()
  password: string;

  @ManyToMany(() => Permission, permission => permission.users)
  permissions: Permission[];

}
