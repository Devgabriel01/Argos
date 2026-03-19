// src/main.ts
// Ponto de entrada do servidor NestJS.
// CORS habilitado para http://localhost:3000 (Next.js dev server).
// Prefixo global "api" — todos os endpoints ficam em /api/contracts etc.

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Permite requisições do frontend Next.js
  app.enableCors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Prefixo global: GET /api/contracts
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`[ARGOS] Backend rodando em http://localhost:${port}`);
  console.log(`[ARGOS] Endpoint: http://localhost:${port}/api/contracts`);
}

bootstrap();
