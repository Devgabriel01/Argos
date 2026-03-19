// src/modules/contracts/contracts.module.ts

import { Module } from '@nestjs/common';
import { ContractsController } from './contracts.controller';
import { ContractsService } from './contracts.service';
import { RiskEngineModule } from '../risk-engine/risk-engine.module';

@Module({
  imports: [RiskEngineModule],
  controllers: [ContractsController],
  providers: [ContractsService],
})
export class ContractsModule {}
