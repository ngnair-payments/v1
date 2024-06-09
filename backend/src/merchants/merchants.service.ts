// src/merchants/merchants.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Merchant } from './entities/merchant.entity';
import { CreateMerchantDto } from './dto/create-merchant.dto';
import { UpdateMerchantDto } from './dto/update-merchant.dto';
import { v4 as uuidv4 } from 'uuid';
import { Provider } from '../providers/entities/provider.entity';

@Injectable()
export class MerchantsService {
  constructor(
    @InjectRepository(Merchant)
    private readonly merchantsRepository: Repository<Merchant>,
    @InjectRepository(Provider)
    private readonly providerRepository: Repository<Provider>,
  ) {}

  async create(createMerchantDto: CreateMerchantDto): Promise<Merchant> {
    const { acquirerId, processorId, achId } = createMerchantDto;

    const acquirer = acquirerId ? await this.providerRepository.findOne({ where: { id: acquirerId } }) : null;;
    const processor = processorId ? await this.providerRepository.findOne({ where: { id: processorId } }) : null;
    const ach = achId ? await this.providerRepository.findOne({ where: { id: achId } }) : null;
    
    const merchant = this.merchantsRepository.create ({
         id: uuidv4(),
     ...createMerchantDto,
      acquirer,
      processor,
      ach,
   });
    return this.merchantsRepository.save(merchant);
  }

  async update(id: string, updateMerchantDto: UpdateMerchantDto): Promise<Merchant> {
    const merchant = await this.merchantsRepository.findOne({ where: { id } });

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

    const { acquirerId, processorId, achId } = updateMerchantDto;

    const acquirer = acquirerId ? await this.providerRepository.findOne({ where: { id: acquirerId } }) : null;
    const processor = processorId ? await this.providerRepository.findOne({ where: { id: processorId } }) : null;
    const ach = achId ? await this.providerRepository.findOne({ where: { id: achId } }) : null;

    if (acquirer) merchant.acquirer = acquirer;
    if (processor) merchant.processor = processor;
    if (ach) merchant.ach = ach;

    // Apply the update
    Object.assign(merchant, updateMerchantDto);

    return this.merchantsRepository.save(merchant);
  }

  async findAll(): Promise<Merchant[]> {
    return this.merchantsRepository.find({ relations: ['acquirer', 'processor', 'ach', 'permissions'] });
  }

  async findOne(id: string): Promise<Merchant> {
    return this.merchantsRepository.findOne({ where: { id }, relations: ['acquirer', 'processor', 'ach', 'permissions'] });
  }
  
  async remove(id: string): Promise<void> {
    const result = await this.merchantsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Merchant with ID ${id} not found`);
    }
  }
}