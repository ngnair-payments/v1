// // src/providers/providers.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Provider } from './entities/provider.entity';
import { Endpoint,EndpointType } from './entities/endpoint.entity';
import { CreateProviderDto } from './dto/create-provider.dto';
import { CreateEndpointDto } from './dto/create-endpoint.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { UpdateEndpointDto } from './dto/update-endpoint.dto';

@Injectable()
export class ProvidersService {
  constructor(
    @InjectRepository(Provider)
    private readonly providerRepository: Repository<Provider>,
    @InjectRepository(Endpoint)
    private readonly endpointRepository: Repository<Endpoint>,
  ) {}

  async createProvider(createProviderDto: CreateProviderDto): Promise<Provider> {
    const provider = this.providerRepository.create(createProviderDto);
    return this.providerRepository.save(provider);
  }

  async createEndpoint(createEndpointDto: CreateEndpointDto): Promise<Endpoint> {
    const endpoint = this.endpointRepository.create(createEndpointDto);
    return this.endpointRepository.save(endpoint);
  }

  async getProviders(): Promise<Provider[]> {
    return this.providerRepository.find();
  }

  async getProvider(id: string): Promise<Provider> {
    const provider = await this.providerRepository.findOneBy({ id });
    if (!provider) {
      throw new NotFoundException(`Provider with ID ${id} not found`);
    }
    return provider;
  }

  async getProviderEndpoints(providerId: string): Promise<Endpoint[]> {
    return this.endpointRepository.find({ where: { providerId } });
  }

  async getEndpoint(providerId: string, type: EndpointType): Promise<Endpoint> {
    const endpoint = await this.endpointRepository.findOne({ where: { providerId, type } });
    if (!endpoint) {
      throw new NotFoundException(`Endpoint ${type} not found for provider ${providerId}`);
    }
    return endpoint;
  }

  async updateProvider(id: string, updateProviderDto: UpdateProviderDto): Promise<Provider> {
    const provider = await this.providerRepository.findOneBy({ id });
    if (!provider) {
      throw new NotFoundException(`Provider with ID ${id} not found`);
    }
    Object.assign(provider, updateProviderDto);
    return this.providerRepository.save(provider);
  }

  async updateEndpoint(id: string, updateEndpointDto: UpdateEndpointDto): Promise<Endpoint> {
    const endpoint = await this.endpointRepository.findOneBy({ id });
    if (!endpoint) {
      throw new NotFoundException(`Endpoint with ID ${id} not found`);
    }
    Object.assign(endpoint, updateEndpointDto);
    return this.endpointRepository.save(endpoint);
  }

  async removeProvider(id: string): Promise<void> {
    const result = await this.providerRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Provider with ID ${id} not found`);
    }
  }

  async removeEndpoint(id: string): Promise<void> {
    const result = await this.endpointRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Endpoint with ID ${id} not found`);
    }
  }
}
