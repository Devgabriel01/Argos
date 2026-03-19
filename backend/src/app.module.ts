import { Module } from '@nestjs/common';
import { PrismaModule } from './modules/prisma/prisma.module';
import { ContractsModule } from './modules/contracts/contracts.module';
import { AuthModule } from './modules/auth/auth.module';
import { TransparenciaModule } from './modules/transparencia/transparencia.module';

@Module({
  imports: [PrismaModule, AuthModule, ContractsModule, TransparenciaModule],
})
export class AppModule {}
