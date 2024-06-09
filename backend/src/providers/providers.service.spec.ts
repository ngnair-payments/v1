// // src/providers/providers.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProvidersService } from './providers.service';
import { Provider } from './entities/provider.entity';
import { Endpoint } from './entities/endpoint.entity';
import { CreateProviderDto } from './dto/create-provider.dto';
import { ProviderType } from './entities/provider.entity';
import { NotFoundException } from '@nestjs/common';

const mockProviderRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
});

const mockEndpointRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
});

describe('ProvidersService', () => {
  let service: ProvidersService;
  let providerRepository: Repository<Provider>;
  let endpointRepository: Repository<Endpoint>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProvidersService,
        { provide: getRepositoryToken(Provider), useFactory: mockProviderRepository },
        { provide: getRepositoryToken(Endpoint), useFactory: mockEndpointRepository },
      ],
    }).compile();

    service = module.get<ProvidersService>(ProvidersService);
    providerRepository = module.get<Repository<Provider>>(getRepositoryToken(Provider));
    endpointRepository = module.get<Repository<Endpoint>>(getRepositoryToken(Endpoint));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createProvider', () => {
    it('should create a new provider', async () => {
      const createProviderDto = { 
        name: 'Test Provider',
        type: ProviderType.ACQUIRER,
        baseUrl: 'https://example.com' 
      };
      const createdProvider = { id: '123', ...createProviderDto };
      providerRepository.save = jest.fn().mockResolvedValue(createdProvider);

      const result = await service.createProvider(createProviderDto);
      expect(providerRepository.save).toHaveBeenCalledWith(createProviderDto);
      expect(result).toEqual(createProviderDto);
    });
  });

  describe('getProvider', () => {
    it('should return a provider by ID', async () => {
      const providerId = '123';
      const expectedProvider = { 
        id: providerId, 
        name: 'Test Provider', 
        type: 'acquirer', 
        baseUrl: 'https://example.com' 
      };
      providerRepository.findOneBy = jest.fn().mockResolvedValue(expectedProvider);

      const result = await service.getProvider(providerId);
      expect(result).toEqual(expectedProvider);
    });

    it('should throw a NotFoundException if provider not found', async () => {
      const providerId = '123';
      providerRepository.findOneBy = jest.fn().mockResolvedValue(null);

      await expect(service.getProvider(providerId)).rejects.toThrow(NotFoundException);
    });
  });
});
