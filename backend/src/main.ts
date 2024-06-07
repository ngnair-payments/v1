import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

// Enable CORS
  app.enableCors({
    origin: 'https://app.ngnair.com', // Replace with your frontend URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
   
  // Use global validation pipe
    app.useGlobalPipes(new ValidationPipe());


   await app.listen(3009);
}
bootstrap();
