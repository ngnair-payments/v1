// src/merchants/merchants.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Merchant } from './entities/merchant.entity';
import { CreateMerchantDto } from './dto/create-merchant.dto';
import { UpdateMerchantDto } from './dto/update-merchant.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MerchantsService {
  constructor(
    @InjectRepository(Merchant)
    private readonly merchantsRepository: Repository<Merchant>,
  ) {}

  async create(createMerchantDto: CreateMerchantDto): Promise<Merchant> {
    const merchant = this.merchantsRepository.create ({
         id: uuidv4(),
     ...createMerchantDto,
   });
    return this.merchantsRepository.save(merchant);
  }

  async update(id: string, updateMerchantDto: UpdateMerchantDto): Promise<Merchant> {
    const merchant = await this.merchantsRepository.findOneBy({ id });

    if (!merchant) {
      throw new BadRequestException('Merchant not found');
    }

    // Ensure mandatory fields are not removed
    if ('legal_name' in updateMerchantDto && (updateMerchantDto.legal_name === undefined || updateMerchantDto.legal_name === null)) {
      throw new BadRequestException('Legal name cannot be removed');
    }

    if ('dba' in updateMerchantDto && (updateMerchantDto.dba === undefined || updateMerchantDto.dba === null)) {
      throw new BadRequestException('DBA cannot be removed');
    }

    if ('ein' in updateMerchantDto && (updateMerchantDto.ein === undefined || updateMerchantDto.ein === null)) {
      throw new BadRequestException('EIN cannot be removed');
    }

    // Apply the update
    Object.assign(merchant, updateMerchantDto);

    return this.merchantsRepository.save(merchant);
  }

  async findAll(): Promise<Merchant[]> {
    return this.merchantsRepository.find();
  }

  async findOne(id: string): Promise<Merchant> {
    return this.merchantsRepository.findOneBy({ id });
  }

  async remove(id: string): Promise<void> {
    await this.merchantsRepository.delete(id);
  }
}
