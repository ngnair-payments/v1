import { Module, OnModuleInit  } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Connection } from 'typeorm';
import { UsersModule } from './users/users.module';
import { MerchantsModule } from './merchants/merchants.module';
import { AuthModule } from './auth/auth.module';
import { ProvidersModule } from './providers/providers.module';
import { TransactionsModule } from './transactions/transactions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
   //  isGlobal: true, // Make ConfigModule available globally
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true,
    }),
    inject: [ConfigService],
    }),
   UsersModule,
   MerchantsModule, 
   AuthModule,
   ProvidersModule,
   TransactionsModule,
  ],
})
export class AppModule implements OnModuleInit{
  constructor(private connection: Connection) {
}

async onModuleInit() {
  await this.connection.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
}
}