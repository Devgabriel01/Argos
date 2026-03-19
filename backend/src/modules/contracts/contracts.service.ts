// src/modules/contracts/contracts.service.ts
// Service responsável por buscar contratos do banco e enriquecer cada um
// com o resultado do motor de risco calculado em runtime.
//
// Fluxo: busca contrato com relações → monta RiskInput → calcula risco →
// persiste score/level no banco → retorna DTO enriquecido.

import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RiskEngineService } from '../risk-engine/risk-engine.service';
import { ContractResponseDto } from './dto/contract-response.dto';

@Injectable()
export class ContractsService implements OnModuleInit {
  constructor(
    private readonly prisma: PrismaService,
    private readonly riskEngine: RiskEngineService,
  ) {}

  // Ao iniciar o módulo, recalcula risco de todos os contratos para garantir
  // que o banco está sempre sincronizado com as regras atuais.
  async onModuleInit() {
    await this.recalculateAllRisks();
  }

  async findAll(): Promise<ContractResponseDto[]> {
    const contracts = await this.prisma.contract.findMany({
      include: {
        agency: true,
        supplier: true,
        additives: true,
      },
      orderBy: { riskScore: 'desc' }, // Ordena do mais arriscado ao menos
    });

    return contracts.map((contract) => {
      const riskResult = this.riskEngine.calculate({
        value: contract.value,
        supplierFoundedAt: contract.supplier.foundedAt,
        competitorCount: contract.competitorCount,
        additiveCount: contract.additives.length,
        contractStartDate: contract.startDate,
      });

      return {
        id: contract.id,
        number: contract.number,
        object: contract.object,
        value: contract.value,
        startDate: contract.startDate,
        endDate: contract.endDate,
        competitorCount: contract.competitorCount,
        additiveCount: contract.additives.length,
        riskScore: riskResult.score,
        riskLevel: riskResult.level,
        riskFactors: riskResult.factors,
        agency: {
          id: contract.agency.id,
          name: contract.agency.name,
          cnpj: contract.agency.cnpj,
          state: contract.agency.state,
        },
        supplier: {
          id: contract.supplier.id,
          name: contract.supplier.name,
          cnpj: contract.supplier.cnpj,
          foundedAt: contract.supplier.foundedAt,
        },
        createdAt: contract.createdAt,
      };
    });
  }

  // Recalcula e persiste score/level de todos os contratos no banco.
  // Útil ao inicializar ou ao atualizar regras do motor de risco.
  private async recalculateAllRisks(): Promise<void> {
    const contracts = await this.prisma.contract.findMany({
      include: { supplier: true, additives: true },
    });

    for (const contract of contracts) {
      const result = this.riskEngine.calculate({
        value: contract.value,
        supplierFoundedAt: contract.supplier.foundedAt,
        competitorCount: contract.competitorCount,
        additiveCount: contract.additives.length,
        contractStartDate: contract.startDate,
      });

      await this.prisma.contract.update({
        where: { id: contract.id },
        data: {
          riskScore: result.score,
          riskLevel: result.level,
          riskFactors: JSON.stringify(result.factors),
        },
      });
    }

    console.log(`[ARGOS] Risco recalculado para ${contracts.length} contrato(s)`);
  }
}
