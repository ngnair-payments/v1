// src/providers/providers.controller.ts
import { Controller, Post, Body, Get, Param, Patch,  Delete, UseGuards } from '@nestjs/common';
import { ProvidersService } from './providers.service';
import { CreateProviderDto } from './dto/create-provider.dto';
import { CreateEndpointDto } from './dto/create-endpoint.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { UpdateEndpointDto } from './dto/update-endpoint.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { EndpointType } from './entities/endpoint.entity';

@Controller('v1/providers')
@UseGuards(JwtAuthGuard)
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) {}

  @Post()
  createProvider(@Body() createProviderDto: CreateProviderDto) {
    return this.providersService.createProvider(createProviderDto);
  }

  @Post('endpoint')
  createEndpoint(@Body() createEndpointDto: CreateEndpointDto) {
    return this.providersService.createEndpoint(createEndpointDto);
  }

  @Get()
  getProviders() {
    return this.providersService.getProviders();
  }

  @Get(':id')
  getProvider(@Param('id') id: string) {
    return this.providersService.getProvider(id);
  }

  @Get(':providerId/endpoints')
  getProviderEndpoints(@Param('providerId') providerId: string) {
    return this.providersService.getProviderEndpoints(providerId);
  }

  @Get(':providerId/endpoints/:type')
  getEndpoint(@Param('providerId') providerId: string, @Param('type') type: EndpointType) {
    return this.providersService.getEndpoint(providerId, type);
  }

  @Patch(':id')
  updateProvider(@Param('id') id: string, @Body() updateProviderDto: UpdateProviderDto) {
    return this.providersService.updateProvider(id, updateProviderDto);
  }

  @Patch('endpoint/:id')
  updateEndpoint(@Param('id') id: string, @Body() updateEndpointDto: UpdateEndpointDto) {
    return this.providersService.updateEndpoint(id, updateEndpointDto);
  }

  @Delete(':id')
  removeProvider(@Param('id') id: string) {
    return this.providersService.removeProvider(id);
  }

  @Delete('endpoint/:id')
  removeEndpoint(@Param('id') id: string) {
    return this.providersService.removeEndpoint(id);
  }
}
