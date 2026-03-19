// src/modules/risk-engine/risk-engine.service.ts
// Motor de risco do ARGOS — coração da plataforma.
//
// Aplica 4 regras de detecção de irregularidade:
//   1. EMPRESA_NOVA       → empresa fundada < 2 anos antes do contrato = +15pts
//   2. VALOR_ALTO         → contrato > R$ 500.000 = +10pts
//   3. POUCOS_CONCORRENTES → menos de 3 licitantes = +20pts
//   4. MUITOS_ADITIVOS    → 3 ou mais aditivos = +15pts
//
// Classificação final por score acumulado:
//   0-20   → LOW
//   21-35  → MEDIUM
//   36-50  → HIGH
//   51+    → CRITICAL

import { Injectable } from '@nestjs/common';
import { RiskFactor, RiskInput, RiskLevel, RiskResult } from './risk.types';

@Injectable()
export class RiskEngineService {

  // Limiar de valor alto: contratos acima de R$ 500.000 recebem penalidade
  private readonly HIGH_VALUE_THRESHOLD = 500_000;

  // Empresa com menos de 2 anos de existência é considerada suspeita
  private readonly NEW_COMPANY_YEARS = 2;

  // Menos de 3 concorrentes sugere licitação direcionada
  private readonly MIN_COMPETITORS = 3;

  // 3 ou mais aditivos indicam possível superfaturamento progressivo
  private readonly MAX_ADDITIVES = 3;

  calculate(input: RiskInput): RiskResult {
    const factors: RiskFactor[] = [];
    let score = 0;

    // ── Regra 1: Empresa nova ────────────────────────────────────────────────
    const companyAgeAtContract = this.getYearsDiff(
      input.supplierFoundedAt,
      input.contractStartDate,
    );

    if (companyAgeAtContract < this.NEW_COMPANY_YEARS) {
      const penalty = 15;
      score += penalty;
      factors.push({
        rule: 'EMPRESA_NOVA',
        description: `Fornecedor fundado há apenas ${companyAgeAtContract.toFixed(1)} ano(s) na data do contrato`,
        score: penalty,
      });
    }

    // ── Regra 2: Valor alto ──────────────────────────────────────────────────
    if (input.value > this.HIGH_VALUE_THRESHOLD) {
      const penalty = 10;
      score += penalty;
      factors.push({
        rule: 'VALOR_ALTO',
        description: `Valor contratual de R$ ${input.value.toLocaleString('pt-BR')} excede o limiar de R$ 500.000`,
        score: penalty,
      });
    }

    // ── Regra 3: Poucos concorrentes ─────────────────────────────────────────
    if (input.competitorCount < this.MIN_COMPETITORS) {
      const penalty = 20;
      score += penalty;
      factors.push({
        rule: 'POUCOS_CONCORRENTES',
        description: `Apenas ${input.competitorCount} concorrente(s) na licitação — possível direcionamento`,
        score: penalty,
      });
    }

    // ── Regra 4: Muitos aditivos ─────────────────────────────────────────────
    if (input.additiveCount >= this.MAX_ADDITIVES) {
      const penalty = 15;
      score += penalty;
      factors.push({
        rule: 'MUITOS_ADITIVOS',
        description: `${input.additiveCount} aditivo(s) contratuais — padrão associado a superfaturamento`,
        score: penalty,
      });
    }

    return {
      score,
      level: this.classifyRisk(score),
      factors,
    };
  }

  // Classifica o score em nível de risco semântico
  private classifyRisk(score: number): RiskLevel {
    if (score >= 51) return 'CRITICAL';
    if (score >= 36) return 'HIGH';
    if (score >= 21) return 'MEDIUM';
    return 'LOW';
  }

  // Calcula a diferença em anos entre duas datas com precisão decimal
  private getYearsDiff(from: Date, to: Date): number {
    const msPerYear = 1000 * 60 * 60 * 24 * 365.25;
    return (to.getTime() - from.getTime()) / msPerYear;
  }
}
