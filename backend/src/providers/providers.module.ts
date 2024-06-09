// src/providers/providers.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProvidersService } from './providers.service';
import { ProvidersController } from './providers.controller';
import { Provider } from './entities/provider.entity';
import { Endpoint } from './entities/endpoint.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Provider, Endpoint])],
  providers: [ProvidersService],
  controllers: [ProvidersController],
  exports: [TypeOrmModule, ProvidersService],

})
export class ProvidersModule {}
