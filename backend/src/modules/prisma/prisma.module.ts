// src/modules/prisma/prisma.module.ts
// Módulo global do Prisma — ao marcar como @Global(), qualquer outro módulo
// pode injetar PrismaService sem precisar importar PrismaModule explicitamente.

import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
