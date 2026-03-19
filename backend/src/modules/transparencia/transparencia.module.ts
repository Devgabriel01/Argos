import { Module } from '@nestjs/common';
import { TransparenciaController } from './transparencia.controller';
import { TransparenciaService } from './transparencia.service';
import { RiskEngineModule } from '../risk-engine/risk-engine.module';

@Module({
  imports: [RiskEngineModule],
  controllers: [TransparenciaController],
  providers: [TransparenciaService],
})
export class TransparenciaModule {}
