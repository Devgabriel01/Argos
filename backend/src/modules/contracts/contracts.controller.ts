// src/modules/contracts/contracts.controller.ts
// Controller REST — expõe o endpoint GET /contracts com headers CORS habilitados
// para permitir consumo pelo frontend Next.js rodando em porta diferente.

import { Controller, Get } from '@nestjs/common';
import { ContractsService } from './contracts.service';
import { ContractResponseDto } from './dto/contract-response.dto';

@Controller('contracts')
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  // GET /contracts
  // Retorna todos os contratos com scores de risco calculados e ordenados
  // do mais crítico ao menos crítico.
  @Get()
  async findAll(): Promise<ContractResponseDto[]> {
    return this.contractsService.findAll();
  }
}
