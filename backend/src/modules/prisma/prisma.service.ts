// src/modules/prisma/prisma.service.ts
// Serviço singleton que gerencia a conexão com o banco SQLite via Prisma ORM.
// Implementa OnModuleInit para conectar na inicialização e OnModuleDestroy para
// fechar a conexão ao encerrar o servidor — evita connection leaks.

import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
    console.log('[ARGOS] Prisma conectado ao banco SQLite');
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
