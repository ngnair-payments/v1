import { Test, TestingModule } from '@nestjs/testing';
import { ProvidersController } from './providers.controller';
import { ProvidersService } from './providers.service';
import { CreateProviderDto } from './dto/create-provider.dto';
import { ProviderType } from './entities/provider.entity';
import { Provider } from './entities/provider.entity';

const mockProvidersService = {
  createProvider: jest.fn().mockResolvedValue({}),
  getProviders: jest.fn().mockResolvedValue([]),
  getProvider: jest.fn().mockResolvedValue({}),
  updateProvider: jest.fn().mockResolvedValue({}),
  removeProvider: jest.fn().mockResolvedValue({}),
};

describe('ProvidersController', () => {
  let controller: ProvidersController;
  let service: ProvidersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProvidersController],
      providers: [
        { provide: ProvidersService, useValue: mockProvidersService },
      ],
    }).compile();

    controller = module.get<ProvidersController>(ProvidersController);
    service = module.get<ProvidersService>(ProvidersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createProvider', () => {
    it('should create a new provider', async () => {
      const createProviderDto: CreateProviderDto = { 
        name: 'Test Provider', 
        type: ProviderType.ACQUIRER, 
        baseUrl: 'https://example.com' 
      };
      const createdProvider = { id: '123', ...createProviderDto };
      mockProvidersService.createProvider.mockResolvedValue(createdProvider);

      const result = await controller.createProvider(createProviderDto);
      expect(result).toEqual(createdProvider);
    });
  });

  describe('getProviders', () => {
    it('should return an array of providers', async () => {
      const providers: Provider[] = [
        { id: '123', name: 'Test Provider 1', type: ProviderType.ACQUIRER, baseUrl: 'https://example.com' },
        { id: '124', name: 'Test Provider 2', type: ProviderType.PROCESSOR, baseUrl: 'https://example2.com' }
      ];
      mockProvidersService.getProviders.mockResolvedValue(providers);

      const result = await controller.getProviders();
      expect(result).toEqual(providers);
    });
  });

  describe('getProvider', () => {
    it('should return a provider by ID', async () => {
      const providerId = '123';
      const provider = { id: providerId, name: 'Test Provider', type: ProviderType.ACQUIRER, baseUrl: 'https://example.com' };
      mockProvidersService.getProvider.mockResolvedValue(provider);

      const result = await controller.getProvider(providerId);
      expect(result).toEqual(provider);
    });
  });
});
