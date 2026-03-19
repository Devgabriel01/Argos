// src/modules/risk-engine/risk.types.ts
// Define os tipos do motor de risco para manter contratos stricts com TypeScript.

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface RiskFactor {
  rule: string;       // Nome da regra aplicada
  description: string; // Explicação legível para o usuário
  score: number;      // Pontos adicionados ao score
}

export interface RiskResult {
  score: number;
  level: RiskLevel;
  factors: RiskFactor[];
}

// Input necessário para calcular risco de um contrato
export interface RiskInput {
  value: number;              // Valor do contrato em R$
  supplierFoundedAt: Date;    // Data de fundação do fornecedor
  competitorCount: number;    // Número de concorrentes na licitação
  additiveCount: number;      // Quantidade de aditivos contratuais
  contractStartDate: Date;    // Início do contrato
}
